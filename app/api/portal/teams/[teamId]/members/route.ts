import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { hasPortalPermission } from '@/lib/user-roles'
import prisma from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { teamId } = params
    const { addMembers, removeMembers, newLeaderId } = await request.json()

    // Get team and verify permissions
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        leader: true,
        members: true
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Check if user can manage this team
    const canManageTeam = hasPortalPermission(user.role as any, 'canManageAllTeams') || 
                         team.leaderId === user.id

    if (!canManageTeam) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Add members
    if (addMembers && addMembers.length > 0) {
      // Verify all users exist
      const usersToAdd = await prisma.user.findMany({
        where: { id: { in: addMembers } }
      })

      if (usersToAdd.length !== addMembers.length) {
        return NextResponse.json(
          { error: 'Some users not found' },
          { status: 400 }
        )
      }

      // Add members to team
      await prisma.team.update({
        where: { id: teamId },
        data: {
          members: {
            connect: addMembers.map((id: string) => ({ id }))
          }
        }
      })

      // Update users' team assignment
      await prisma.user.updateMany({
        where: { id: { in: addMembers } },
        data: { teamId }
      })

      // Create notifications for new members
      for (const userId of addMembers) {
        await prisma.portalNotification.create({
          data: {
            userId,
            title: 'Added to Team',
            message: `You have been added to the team "${team.name}"`,
            type: 'INFO',
            category: 'TEAM',
            relatedId: teamId,
            relatedType: 'team',
            actionUrl: `/portal/teams/${teamId}`,
            actionText: 'View Team'
          }
        })
      }
    }

    // Remove members
    if (removeMembers && removeMembers.length > 0) {
      // Don't allow removing the leader
      if (removeMembers.includes(team.leaderId)) {
        return NextResponse.json(
          { error: 'Cannot remove team leader' },
          { status: 400 }
        )
      }

      // Remove members from team
      await prisma.team.update({
        where: { id: teamId },
        data: {
          members: {
            disconnect: removeMembers.map((id: string) => ({ id }))
          }
        }
      })

      // Clear users' team assignment
      await prisma.user.updateMany({
        where: { id: { in: removeMembers } },
        data: { teamId: null }
      })

      // Create notifications for removed members
      for (const userId of removeMembers) {
        await prisma.portalNotification.create({
          data: {
            userId,
            title: 'Removed from Team',
            message: `You have been removed from the team "${team.name}"`,
            type: 'WARNING',
            category: 'TEAM',
            relatedId: teamId,
            relatedType: 'team'
          }
        })
      }
    }

    // Change leader
    if (newLeaderId && newLeaderId !== team.leaderId) {
      // Verify new leader is a team member
      const newLeader = await prisma.user.findUnique({
        where: { id: newLeaderId }
      })

      if (!newLeader) {
        return NextResponse.json(
          { error: 'New leader not found' },
          { status: 400 }
        )
      }

      // Update team leader
      await prisma.team.update({
        where: { id: teamId },
        data: { leaderId: newLeaderId }
      })

      // Ensure new leader is a member
      await prisma.team.update({
        where: { id: teamId },
        data: {
          members: {
            connect: { id: newLeaderId }
          }
        }
      })

      // Update new leader's team assignment
      await prisma.user.update({
        where: { id: newLeaderId },
        data: { teamId }
      })

      // Create notifications
      await prisma.portalNotification.create({
        data: {
          userId: newLeaderId,
          title: 'Team Leadership',
          message: `You are now the leader of "${team.name}"`,
          type: 'SUCCESS',
          category: 'TEAM',
          relatedId: teamId,
          relatedType: 'team',
          actionUrl: `/portal/teams/${teamId}`,
          actionText: 'Manage Team'
        }
      })

      await prisma.portalNotification.create({
        data: {
          userId: team.leaderId,
          title: 'Team Leadership Changed',
          message: `Leadership of "${team.name}" has been transferred to ${newLeader.name}`,
          type: 'INFO',
          category: 'TEAM',
          relatedId: teamId,
          relatedType: 'team'
        }
      })
    }

    // Return updated team
    const updatedTeam = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            role: true,
          }
        },
        _count: {
          select: { 
            members: true,
            kpis: true,
            goals: true
          }
        }
      }
    })

    return NextResponse.json({ team: updatedTeam })
  } catch (error) {
    console.error('Error updating team members:', error)
    return NextResponse.json(
      { error: 'Failed to update team members' },
      { status: 500 }
    )
  }
}
