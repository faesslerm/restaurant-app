import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Utensils, CreditCard, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full bg-gradient-to-b from-amber-100 to-amber-50 py-12 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
          FlowDine
        </h1>
        <p className="mt-4 text-lg text-amber-700">
          Book, eat, and pay - all from your phone
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/reservation">Book a Table</Link>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md px-4 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">
          How It Works
        </h2>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">1. Book a Reservation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Reserve your table and receive a unique code via email
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Utensils className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">2. Order Your Meal</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Use your code to log in and order food directly from your phone
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">3. Pay and Go</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pay your bill instantly through Stripe and leave when you're
                ready
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">4. Share Your Experience</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Leave feedback and earn rewards for your next visit
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center space-y-4">
          <Button
            asChild
            variant="outline"
            className="border-amber-600 text-amber-600 hover:bg-amber-50"
          >
            <Link href="/auth">Already have a code?</Link>
          </Button>
          <div>
            <Link
              href="/feedback"
              className="text-sm text-amber-600 hover:underline"
            >
              Leave feedback from a previous visit
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
