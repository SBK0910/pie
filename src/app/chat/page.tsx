'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';

export default function ChatPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto h-screen flex flex-col">
        <div className="flex justify-between items-center p-6">
          <h1 className="text-xl font-semibold">Financial Assistant</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="text-sm text-muted-foreground hover:bg-transparent hover:underline"
          >
            ← Back to Form
          </Button>
        </div>
        <ChatInterface />
      </main>
    </div>
  );
}
