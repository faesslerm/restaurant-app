"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { submitFeedback } from "@/app/feedback/actions"
import { toast } from "@/components/ui/use-toast"
import { ExternalLink, ThumbsUp, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FeedbackFormProps {
  reservationCode?: string
}

export function FeedbackForm({ reservationCode }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [voucherCode, setVoucherCode] = useState<string | null>(null)
  const [showGoogleReview, setShowGoogleReview] = useState(false)
  const [staffHelp, setStaffHelp] = useState(false)

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    // Reset states when rating changes
    setIsSubmitted(false)
    setVoucherCode(null)
    setShowGoogleReview(false)
    setStaffHelp(false)
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitFeedback({
        rating,
        comment,
        reservationCode,
        requestStaffHelp: rating <= 3,
        email: email || undefined,
      })

      if (result.success) {
        setIsSubmitted(true)

        if (rating === 5) {
          setVoucherCode(result.voucherCode || null)
          setShowGoogleReview(true)
        } else if (rating <= 3) {
          setStaffHelp(true)
        }

        toast({
          title: "Thank you for your feedback!",
          description: "We appreciate you taking the time to share your experience.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to submit feedback. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleReview = () => {
    // Open Google review page in a new tab
    window.open("https://g.page/r/review", "_blank")

    // Show voucher after clicking the Google review link
    if (voucherCode) {
      toast({
        title: "Voucher Generated!",
        description: `Your $5 voucher code is: ${voucherCode}`,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>How was your experience?</CardTitle>
        <CardDescription>Your feedback helps us improve our service</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSubmitted ? (
          <>
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-muted-foreground mb-1">Rate your experience</p>
              <StarRating size="lg" onChange={handleRatingChange} />
              <p className="text-sm mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comments (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Tell us what you liked or how we can improve..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="For follow-up if needed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="py-4">
            {showGoogleReview && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <ThumbsUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium text-lg">Thank you for your 5-star rating!</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Leave a Google review and get a $5 voucher for your next visit.
                  </p>
                </div>

                <Button
                  onClick={handleGoogleReview}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Leave a Google Review
                </Button>

                {voucherCode && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      After leaving your review, use this voucher code on your next visit:
                    </p>
                    <p className="font-mono font-bold text-lg mt-2 bg-amber-50 p-2 rounded-md">{voucherCode}</p>
                  </div>
                )}
              </div>
            )}

            {staffHelp && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">We're sorry to hear that</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A staff member will come to your table shortly to address your concerns.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Thank you for giving us the opportunity to improve your experience.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {rating === 4 && (
              <div className="text-center py-2">
                <h3 className="font-medium">Thank you for your feedback!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We're glad you enjoyed your experience. We'll use your feedback to make it even better next time.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {!isSubmitted && (
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
