import * as React from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Control,
    FieldPath,
    FieldValues,
    Path,
    PathValue,
} from "react-hook-form";

import { ReactNode } from 'react';

interface FormSelectFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    label: ReactNode;
    options: { value: string; label: string }[];
    control: Control<T>;
    placeholder?: string;
    className?: string;
}

export function FormSelectField<T extends FieldValues>({
    name,
    label,
    options,
    control,
    placeholder = "Select an option",
    className,
}: FormSelectFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={(value) => field.onChange(value as PathValue<T, Path<T>>)}
                        value={field.value ?? ""}
                    >
                        <FormControl>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}