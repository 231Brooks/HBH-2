"use client"

import React, { useState } from "react"
import { Camera, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ImageUploadModal } from "./image-upload-modal"
import { ProfileSettingsModal } from "./profile-settings-modal"
import { useSupabase } from "@/contexts/supabase-context"
import { ROLE_DESCRIPTIONS, type UserRole } from "@/lib/user-roles"

interface ProfileHeaderProps {
  user: {
    id: string
    name?: string
    email: string
    image?: string
    coverPhoto?: string
    role: UserRole
    location?: string
    bio?: string
    rating?: number
    reviewCount: number
  }
  isOwnProfile?: boolean
  onProfileUpdate?: () => void
}

export function ProfileHeader({ user, isOwnProfile = false, onProfileUpdate }: ProfileHeaderProps) {
  const [showCoverUpload, setShowCoverUpload] = useState(false)
  const [showProfileUpload, setShowProfileUpload] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { supabase } = useSupabase()

  const handleImageUpdate = async (imageUrl: string, type: 'profile' | 'cover') => {
    if (!supabase || !isOwnProfile) return

    setIsUpdating(true)
    try {
      const updateData = type === 'profile' 
        ? { image: imageUrl }
        : { cover_photo: imageUrl }

      const { error } = await supabase.auth.updateUser({
        data: updateData
      })

      if (error) throw error

      onProfileUpdate?.()
    } catch (error) {
      console.error('Failed to update profile image:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const defaultCoverPhoto = "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=1200&h=300&fit=crop&crop=center"

  return (
    <div className="relative">
      {/* Cover Photo Section */}
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden rounded-t-lg">
        <div 
          className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center"
          style={{
            backgroundImage: `url(${user.coverPhoto || defaultCoverPhoto})`
          }}
        >
          {/* Cover Photo Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          
          {/* Edit Cover Photo Button */}
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700"
              onClick={() => setShowCoverUpload(true)}
              disabled={isUpdating}
            >
              <Camera className="h-4 w-4 mr-2" />
              Edit Cover
            </Button>
          )}
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="relative px-4 md:px-6 pb-6">
        {/* Profile Picture */}
        <div className="absolute -top-12 md:-top-16 left-4 md:left-6">
          <div className="relative">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
              <AvatarImage
                src={user.image || "/placeholder.svg"}
                alt={user.name || "Profile"}
              />
              <AvatarFallback className="text-xl md:text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Edit Profile Picture Button */}
            {isOwnProfile && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-0 right-0 h-7 w-7 md:h-8 md:w-8 rounded-full p-0 bg-white shadow-md hover:bg-gray-50"
                onClick={() => setShowProfileUpload(true)}
                disabled={isUpdating}
              >
                <Edit3 className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="pt-16 md:pt-20 flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                {user.name || "Anonymous User"}
              </h1>
              <Badge variant="secondary" className="text-xs md:text-sm">
                {ROLE_DESCRIPTIONS[user.role].title}
              </Badge>
            </div>

            {user.location && (
              <p className="text-gray-600 flex items-center gap-1 text-sm md:text-base">
                <span>📍</span>
                {user.location}
              </p>
            )}

            {user.bio && (
              <p className="text-gray-700 max-w-2xl text-sm md:text-base leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Rating and Reviews */}
            {user.rating && user.reviewCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-medium">{user.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{user.reviewCount} review{user.reviewCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs md:text-sm"
                onClick={() => setShowSettings(true)}
              >
                <Edit3 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ImageUploadModal
        isOpen={showCoverUpload}
        onClose={() => setShowCoverUpload(false)}
        onUpload={(url) => handleImageUpdate(url, 'cover')}
        title="Update Cover Photo"
        aspectRatio="cover"
      />

      <ImageUploadModal
        isOpen={showProfileUpload}
        onClose={() => setShowProfileUpload(false)}
        onUpload={(url) => handleImageUpdate(url, 'profile')}
        title="Update Profile Picture"
        aspectRatio="square"
      />

      <ProfileSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onSave={async (data) => {
          // Handle profile data update
          console.log('Saving profile data:', data)
          onProfileUpdate?.()
        }}
      />
    </div>
  )
}
