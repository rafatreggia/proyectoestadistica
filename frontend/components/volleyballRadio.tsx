import { forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { cn } from "@/lib/utils"


interface VolleyballRadioProps {
  id: string
  value: string
  label: string
  isSelected:boolean
}

export const VolleyballRadio = forwardRef<HTMLDivElement, VolleyballRadioProps>(({ id, value, label, isSelected }, ref) => {
  // Get the current value from the RadioGroup context
  

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm transition-all",
        isSelected && "bg-blue-50 border-blue-400",
      )}
    >
      <div className="relative w-4 h-4">
        <RadioGroupItem value={value} id={id} className="absolute opacity-0 z-10" />
        <div
          className={cn(
            "w-4 h-4 rounded-full border border-blue-300 flex items-center justify-center overflow-hidden transition-all",
            isSelected ? "bg-blue-100 border-blue-500" : "bg-white",
          )}
        >
          {isSelected && (
            <img
              src="/images/pelota.webp"
              alt="Volleyball"
              width={16}
              height={16}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      <Label htmlFor={id} className="font-medium cursor-pointer">
        {label}
      </Label>
    </div>
  )
})

VolleyballRadio.displayName = "VolleyballRadio"

