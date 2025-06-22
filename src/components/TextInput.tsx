'use client';

import { Form, FormControl, FormField, FormItem } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, SendHorizonalIcon } from 'lucide-react';
import { MessageFormValues, messageSchema } from '@/schemas/schema';
import { cn } from '@/lib/utils';

interface TextInputProps {
    onSubmit: (values: MessageFormValues) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

export default function TextInput({ onSubmit, isLoading = false, className }: TextInputProps) {
    const form = useForm<MessageFormValues>({
        resolver: zodResolver(messageSchema),
        mode: 'onChange',
        defaultValues: {
            content: '',
        },
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, field: any) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
        } else {
            field.onKeyDown?.(e);
        }
    };

    return (
        <div className={cn("fixed bottom-0 left-0 right-0 bg-transparent", className)}>
            <div className="mx-auto max-w-3xl px-4 py-3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background/95">
                        <div className="relative">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Textarea
                                                    {...field}
                                                    placeholder="Ask me anything..."
                                                    className="min-h-[44px] h-20 md:h-28 resize-none pr-12 py-3 w-full text-sm"
                                                    onKeyDown={(e) => handleKeyDown(e, field)}
                                                    disabled={isLoading}
                                                    rows={1}
                                                />
                                                <Button
                                                    type="submit"
                                                    size="icon"
                                                    className="absolute right-2 bottom-1.5 h-8 w-8 p-2 rounded-full bg-white hover:bg-primary/90"
                                                    disabled={isLoading || !form.formState.isValid}
                                                >
                                                    <SendHorizonalIcon className="h-4 w-4" />
                                                    <span className="sr-only">Send message</span>
                                                </Button>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}