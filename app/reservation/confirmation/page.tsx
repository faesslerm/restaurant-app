import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Reservation Confirmed!</CardTitle>
          <CardDescription>We've sent your reservation code to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Please check your inbox for an email containing your unique reservation code. You'll need this code to
            access your reservation and place orders when you arrive.
          </p>
          <p className="text-sm text-muted-foreground">If you don't see the email, please check your spam folder.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
            <Link href="/auth">I have my code</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
