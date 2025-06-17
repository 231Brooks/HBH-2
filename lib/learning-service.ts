import prisma from './prisma'
import { hasPortalPermission } from './user-roles'
import { RealtimeService } from './pusher-server'

export class LearningService {
  static async enrollUser(userId: string, courseId: string) {
    // Check prerequisites
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { 
        prerequisites: {
          include: {
            prerequisite: true
          }
        },
        modules: {
          orderBy: { order: 'asc' },
          take: 1
        }
      }
    })
    
    if (!course) throw new Error('Course not found')
    if (!course.isPublished) throw new Error('Course not available')
    
    // Verify prerequisites are met
    for (const prereq of course.prerequisites) {
      const completed = await this.isCourseCompleted(userId, prereq.prerequisiteId)
      if (!completed) {
        throw new Error(`Prerequisite course "${prereq.prerequisite.title}" not completed`)
      }
    }
    
    // Create progress record
    const progress = await prisma.courseProgress.create({
      data: {
        userId,
        courseId,
        progress: 0,
        currentModuleId: course.modules[0]?.id || null,
      },
      include: {
        course: {
          include: {
            instructor: true,
            modules: { orderBy: { order: 'asc' } }
          }
        }
      }
    })

    // Send real-time notification
    await RealtimeService.notifyCourseEnrollment(userId, progress.course)

    return progress
  }
  
  static async updateProgress(
    progressId: string, 
    moduleId: string, 
    timeSpent: number, 
    completed: boolean = false
  ) {
    const progress = await prisma.courseProgress.findUnique({
      where: { id: progressId },
      include: { 
        course: { 
          include: { 
            modules: { orderBy: { order: 'asc' } },
            unlocks: true
          } 
        } 
      }
    })
    
    if (!progress) throw new Error('Progress not found')
    
    // Update time spent and current module
    const updatedProgress = await prisma.courseProgress.update({
      where: { id: progressId },
      data: {
        currentModuleId: moduleId,
        timeSpent: progress.timeSpent + timeSpent,
        lastAccessedAt: new Date(),
      }
    })
    
    // Calculate progress percentage
    const completedModules = await this.getCompletedModules(progressId)
    const totalModules = progress.course.modules.length
    const newProgress = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0
    
    // Update progress percentage
    await prisma.courseProgress.update({
      where: { id: progressId },
      data: { progress: newProgress }
    })
    
    let unlockedFeatures: any[] = []
    let certificationsEarned: any[] = []
    
    // Check if course is completed
    if (completed || newProgress === 100) {
      if (!progress.completedAt) {
        // Mark course as completed
        await prisma.courseProgress.update({
          where: { id: progressId },
          data: { 
            completedAt: new Date(),
            progress: 100
          }
        })
        
        // Unlock features
        unlockedFeatures = await this.unlockFeatures(progress.userId, progress.course.unlocks)
        
        // Check for certifications
        certificationsEarned = await this.checkCertifications(progress.userId, progress.courseId)
        
        // Create completion notification
        await prisma.portalNotification.create({
          data: {
            userId: progress.userId,
            title: 'Course Completed!',
            message: `Congratulations! You've completed "${progress.course.title}"`,
            type: 'SUCCESS',
            category: 'ACHIEVEMENT',
            relatedId: progress.courseId,
            relatedType: 'course'
          }
        })

        // Send real-time notifications
        await RealtimeService.notifyCourseCompletion(
          progress.userId,
          progress.course,
          unlockedFeatures
        )
      }
    }
    
    return {
      progress: updatedProgress,
      unlockedFeatures,
      certificationsEarned
    }
  }
  
  static async unlockFeatures(userId: string, unlocks: any[]) {
    const unlockedFeatures = []
    
    for (const unlock of unlocks) {
      if (unlock.platform === 'HBH2' || unlock.platform === 'BOTH') {
        await this.updateHBH2Permissions(userId, unlock.featureName)
        unlockedFeatures.push(unlock)
      }
      if (unlock.platform === 'PORTAL' || unlock.platform === 'BOTH') {
        await this.updatePortalPermissions(userId, unlock.featureName)
        unlockedFeatures.push(unlock)
      }
    }
    
    return unlockedFeatures
  }
  
  static async isCourseCompleted(userId: string, courseId: string): Promise<boolean> {
    const progress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })
    
    return progress?.completedAt !== null
  }
  
  static async getCompletedModules(progressId: string) {
    // This would track individual module completion
    // For now, we'll use a simplified approach based on quiz scores
    const progress = await prisma.courseProgress.findUnique({
      where: { id: progressId },
      include: {
        quizScores: {
          where: { score: { gte: 70 } }, // Passing score
          include: {
            quiz: {
              include: {
                module: true
              }
            }
          }
        }
      }
    })
    
    return progress?.quizScores.map(score => score.quiz.module) || []
  }
  
  static async checkCertifications(userId: string, courseId: string) {
    // Check if completing this course earns any certifications
    const certifications = await prisma.certification.findMany({
      where: {
        requiredCourses: {
          has: courseId
        }
      }
    })
    
    const earnedCertifications = []
    
    for (const cert of certifications) {
      // Check if all required courses are completed
      const allCompleted = await Promise.all(
        cert.requiredCourses.map(reqCourseId => 
          this.isCourseCompleted(userId, reqCourseId)
        )
      )
      
      if (allCompleted.every(Boolean)) {
        // Award certification
        const existingCert = await prisma.certification.findFirst({
          where: {
            userId,
            name: cert.name
          }
        })
        
        if (!existingCert) {
          const newCert = await prisma.certification.create({
            data: {
              userId,
              name: cert.name,
              description: cert.description,
              issuer: 'HBH Portal',
              earnedAt: new Date(),
              verificationCode: this.generateVerificationCode()
            }
          })
          
          earnedCertifications.push(newCert)
        }
      }
    }
    
    return earnedCertifications
  }
  
  private static async updateHBH2Permissions(userId: string, featureName: string) {
    // Update user permissions for HBH-2 features
    // This would integrate with the existing permission system
    console.log(`Unlocking HBH-2 feature "${featureName}" for user ${userId}`)
  }
  
  private static async updatePortalPermissions(userId: string, featureName: string) {
    // Update user permissions for Portal features
    console.log(`Unlocking Portal feature "${featureName}" for user ${userId}`)
  }
  
  private static generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }
}
