"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Control,
    FieldPath,
    FieldValues,
    Path,
    PathValue,
} from "react-hook-form";

interface FormSliderFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    label: React.ReactNode;
    control: Control<T>;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    labelFormatter?: (value: number) => string;
}

export function FormSliderField<T extends FieldValues>({
    name,
    label,
    control,
    min = 0,
    max = 100,
    step = 1,
    className,
    labelFormatter = (value) => value.toString(),
}: FormSliderFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { value, onChange, ...field } }) => (
                <FormItem className={className}>
                    <div className="flex justify-between items-center">
                        <FormLabel>{label}</FormLabel>
                        <span className="text-sm font-medium">
                            {labelFormatter(value as number)}
                        </span>
                    </div>
                    <FormControl>
                        <Slider
                            {...field}
                            value={[value as number]}
                            onValueChange={(vals) => {
                                onChange(vals[0] as PathValue<T, Path<T>>);
                            }}
                            min={min}
                            max={max}
                            step={step}
                        />
                    </FormControl>
                    <FormMessage className="text-xs" />
                </FormItem>
            )}
        />
    );
}
