'use client'

import { personalInfoSchema } from "@/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, User, Briefcase, Cake, ArrowLeft, ArrowRight } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface PersonalInfoProps {
  data: z.infer<typeof personalInfoSchema> & {
    [key: string]: any;
  };
  onBack: () => void;
  onNext: (values: z.infer<typeof personalInfoSchema>) => void;
}

export default function PersonalInfo({ data, onBack, onNext }: PersonalInfoProps) {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: data.name,
      dob: data.dob,
      occupation: data.occupation,
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((formValues) => onNext(formValues))} className="space-y-6">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  className="h-11 text-base"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Cake className="h-4 w-4" />
                  Date of Birth
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal h-auto w-full flex items-center justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem className="h-full flex flex-col">
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4" />
                  Occupation
                </FormLabel>
                <div className="w-full">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-auto w-full [&>span]:w-full">
                        <SelectValue placeholder="Select your occupation" className="w-full" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(personalInfoSchema.shape.occupation.enum).map((occupation) => (
                        <SelectItem key={occupation} value={occupation}>
                          {occupation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 text-base font-medium flex items-center justify-center gap-2"
            size="lg"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12 text-base font-medium flex items-center justify-center gap-2"
            size="lg"
          >
            <span>Continue</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  )
}