"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type ShareBillProps = {
  amount: number
  numberOfPeople: number
  amountPerPerson: number
}

export function ShareBill({ amount, numberOfPeople, amountPerPerson }: ShareBillProps) {
  const [emails, setEmails] = useState<string[]>(Array(numberOfPeople - 1).fill(""))
  const [open, setOpen] = useState(false)

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const handleShare = () => {
    // In a real app, this would send emails to the provided addresses
    toast({
      title: "Bill shared successfully",
      description: `Payment request sent to ${emails.filter(Boolean).length} people.`,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex gap-2">
          <Share className="h-4 w-4" />
          Share Bill with Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Bill</DialogTitle>
          <DialogDescription>Send payment requests to your friends for their portion of the bill.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted p-3 rounded-md text-sm">
            <p>
              Total amount: <span className="font-medium">${amount.toFixed(2)}</span>
            </p>
            <p>
              Split between: <span className="font-medium">{numberOfPeople} people</span>
            </p>
            <p>
              Amount per person: <span className="font-medium">${amountPerPerson.toFixed(2)}</span>
            </p>
          </div>

          <div className="space-y-3">
            {emails.map((email, index) => (
              <div key={index} className="space-y-1">
                <Label htmlFor={`friend-email-${index}`}>Friend {index + 1} email</Label>
                <Input
                  id={`friend-email-${index}`}
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleShare} className="bg-amber-600 hover:bg-amber-700">
            Send Payment Requests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
