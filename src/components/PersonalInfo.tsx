'use client'

import { personalInfoSchema } from "@/schemas/personal"
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
import { CalendarIcon, User, Briefcase, Cake, ArrowRight } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoProps {
    data: PersonalInfoData;
    onNext: (data: PersonalInfoData) => void;
}

export default function PersonalInfo({
    data,
    onNext
}: PersonalInfoProps) {
    const form = useForm<PersonalInfoData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            name: data?.name || '',
            dob: data?.dob || new Date(),
            occupation: data?.occupation || 'Student',
        },
        mode: 'onChange'
    });

    const onSubmit = (values: PersonalInfoData) => {
        onNext(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                        <User className="h-4 w-4" />
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            className="h-10 text-sm w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal h-10 text-sm",
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
                                <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                        <Briefcase className="h-4 w-4" />
                                        Occupation
                                    </FormLabel>
                                    <div className="w-full">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-10 w-full [&>span]:w-full text-sm">
                                                    <SelectValue placeholder="Select occupation" className="w-full text-sm" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(personalInfoSchema.shape.occupation.enum).map((occupation) => (
                                                    console.log(occupation),
                                                    <SelectItem key={occupation} value={occupation} className="text-sm">
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
                </div>

                <div className="w-full pt-2">
                    <Button
                        type="submit"
                        className="h-10 w-full text-sm font-medium flex items-center justify-center gap-2"
                        size="lg"
                    >
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </Form>
    )
}