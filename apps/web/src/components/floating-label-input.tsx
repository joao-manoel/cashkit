"use client"

import { useState, InputHTMLAttributes } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export function FloatingLabelInput({
  label,
  id,
  className,
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState("")

  return (
    <div className="relative">
      <Input
        id={id}
        className={`pt-6 pb-2 px-4 w-full text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <Label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 ${
          isFocused || value
            ? "top-2 text-xs text-blue-500"
            : "top-1/2 -translate-y-1/2 text-gray-500"
        }`}
      >
        {label}
      </Label>
    </div>
  )
}