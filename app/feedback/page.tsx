"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FeedbackForm } from "@/components/feedback-form"

export default function FeedbackPage() {
  const router = useRouter()
  const [authCode, setAuthCode] = useState<string | null>(null)

  useEffect(() => {
    const code = localStorage.getItem("authCode")
    setAuthCode(code)
  }, [])

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Your Feedback</h1>
        <p className="text-muted-foreground">We value your opinion and would love to hear about your experience.</p>
      </div>

      <FeedbackForm reservationCode={authCode || undefined} />
    </div>
  )
}
