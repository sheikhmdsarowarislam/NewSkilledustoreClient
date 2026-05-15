"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { useSession } from "@/lib/hooks/use-session"
import { resetPassword } from "@/lib/api-client"
import { Lock, Bell, Shield, Trash2, Key, AlertTriangle, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { accessToken, user, update } = useSession()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user has access token
    if (!accessToken) {
      setError("Session expired. Please sign in again.")
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
      return
    }

    setError("")
    setSuccess("")

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      // Refresh session to ensure we have a valid token
      await update()
      
      await resetPassword(
        {
          password: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        accessToken!
      )
      setSuccess("Password updated successfully! Logging out...")
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
      
      // Wait a moment to show the success message, then logout and redirect
      setTimeout(async () => {
        await signOut({ 
          callbackUrl: "/signin?message=password-updated",
          redirect: true 
        })
      }, 1500)
    } catch (err) {
      const error = err as Error
      const errorMessage = error.message || "Failed to update password"
      
      console.error('❌ Password reset error:', errorMessage)
      
      // Check if error is related to social auth
      if (errorMessage.includes("Cannot reset password") || errorMessage.includes("account type")) {
        setError("You signed in with a social provider (Google, Facebook, etc.). Password changes are not available for social authentication accounts.")
      } else if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
        setError("Your session has expired. Please sign in again and try.")
      } else {
        setError(errorMessage)
      }
      setIsLoading(false)
    }
  }

  // Check if user is using social auth
  const isSocialAuthUser = !!user?.avatar && (
    user.avatar.includes('googleusercontent.com') ||
    user.avatar.includes('fbcdn.net') ||
    user.avatar.includes('githubusercontent.com') ||
    user.avatar.includes('twimg.com')
  )

  return (
    <div className="min-h-screen bg-[#03050a] pt-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Account <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="text-gray-400">Manage your account security and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
                  <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Change Password</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your password to keep your account secure
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isSocialAuthUser ? (
                <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-400">
                  <Shield className="w-4 h-4" />
                  <span className="ml-2">
                    You signed in with a social provider. Password changes are not available for social authentication accounts.
                  </span>
                </Alert>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {error && (
                    <Alert variant="error" className="bg-red-500/10 border-red-500/30 text-red-400">
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="success" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                      {success}
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.old ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        required
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showPasswords.old ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
                        placeholder="Enter new password (min 8 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Account Preferences */}
          <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-violet-500/30 transition-all duration-300 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-0.5 shadow-lg shadow-violet-500/20">
                  <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-violet-400" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Account Preferences</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account preferences and privacy
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-400">
                        Receive updates about your courses
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 hover:border-violet-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Privacy Settings</h4>
                      <p className="text-sm text-gray-400">
                        Control who can see your profile
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-gradient-to-br from-red-900/20 via-red-800/10 to-red-900/20 border-red-500/30 hover:border-red-500/50 transition-all duration-300 shadow-xl shadow-red-500/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-0.5 shadow-lg shadow-red-500/20">
                  <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-red-400 text-xl">Danger Zone</CardTitle>
                  <CardDescription className="text-gray-400">
                    Irreversible and destructive actions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-start gap-3 mb-4">
                  <Trash2 className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Delete Account</h4>
                    <p className="text-sm text-gray-400">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                </div>
                <Button 
                  variant="destructive"
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
