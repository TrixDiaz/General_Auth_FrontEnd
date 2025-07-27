import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

export default function ChangePassword() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full p-4">
      {/* Fixed width section */}
      <div className="w-full md:w-[280px] flex-shrink-0">
        <h1 className="text-2xl font-bold">Change Password</h1>
        <p className="text-sm text-muted-foreground">
          Update your password for account security.
        </p>
      </div>

      {/* Expanding form section */}
      <form className="w-full bg-secondary p-4 rounded-lg flex-1 space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="old-password">Old Password</Label>
          <Input
            id="old-password"
            type="password"
            placeholder="Enter current password"
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            className="w-full"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full md:w-auto">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
}
