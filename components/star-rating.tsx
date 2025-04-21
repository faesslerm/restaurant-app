"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  totalStars?: number
  initialRating?: number
  onChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  interactive?: boolean
}

export function StarRating({
  totalStars = 5,
  initialRating = 0,
  onChange,
  size = "md",
  interactive = true,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (index: number) => {
    if (!interactive) return
    const newRating = index + 1
    setRating(newRating)
    onChange?.(newRating)
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "cursor-pointer transition-all duration-100",
              hoverRating >= starValue || (!hoverRating && rating >= starValue)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300",
              interactive ? "hover:scale-110" : "",
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        )
      })}
    </div>
  )
}
