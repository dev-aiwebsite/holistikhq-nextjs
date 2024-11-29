"use client"

import { addDays, format } from "date-fns"

import { cn } from "@lib/utils"
import { Button } from "@app/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@app/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select"
import { Calendar } from "@app/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"


type TypeDatePickerWithPreset = {
  variant?: 'icon',
  className?: string,
  onSelect?: (date: Date | undefined) => void,
  value?: Date
}
export function DatePickerWithPresets({variant, className, onSelect, value }:TypeDatePickerWithPreset) {
  const [date, setDate] = useState<Date | undefined>(value);

  function handleOnSelect(date: Date | undefined) {
    setDate(date);
    if (onSelect) {
      onSelect(date); // Pass the selected date to the onSelect handler
    }
  }

  useEffect(()=>{
    if(value == date) return
    setDate(value)
  },[value])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant == 'icon' ? 'ghost' : 'outline'}
          size={variant == 'icon' ? 'icon' : 'default'}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            className,
            !date && "text-muted-foreground",
            variant == 'icon' && 'w-fit p-1 h-7 aspect-square item-center justify-center border border-dashed text-gray-400 border-current rounded-full hover:text-app-orange-500/80 hover:bg-white',
            date && 'text-app-orange-500/80 border-solid',
          )}
        >
          <div className="flex flex-row gap-2">
            <CalendarIcon size={15} strokeWidth={1.5}/>
            {variant !== 'icon' && (date ? format(date, "PPP") : <span>Pick a date</span>)}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select
          onValueChange={(value) => {
            const selectedDate = addDays(new Date(), parseInt(value));
            setDate(selectedDate);
            handleOnSelect(selectedDate); // Call handleOnSelect with the new date
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={handleOnSelect} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
