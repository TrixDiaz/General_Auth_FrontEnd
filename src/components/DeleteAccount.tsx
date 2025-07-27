import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from './ui/dialog'

export default function DeleteAccount() {
  const [ open, setOpen ] = useState(false)
  const [ confirmText, setConfirmText ] = useState('')

  const handleDelete = () => {
    // Replace with your actual delete logic (e.g., Zustand/API)
    console.log('Account deleted!')
    setOpen(false)
  }

  // Reset confirm input when dialog closes
  useEffect(() => {
    if (!open) setConfirmText('')
  }, [ open ])

  const isConfirmed = confirmText.trim().toLowerCase() === 'delete'

  return (
    <div className="flex justify-end w-full p-4">
      <div className="flex flex-col bg-secondary border border-border p-6 rounded-lg w-full">
        <h2 className="text-xl font-semibold text-destructive mb-2">Delete Account</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Once your account is deleted, all of its data will be permanently removed. This action cannot be undone.
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="self-start">Delete Account</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Account Deletion</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Please type <span className="font-semibold text-destructive">delete</span> below to proceed.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <Input
                placeholder="Type 'delete' to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className={isConfirmed ? 'border-green-500' : ''}
              />
            </div>

            <DialogFooter className="flex justify-between gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={!isConfirmed}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
