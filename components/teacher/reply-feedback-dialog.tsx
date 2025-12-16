'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { addReply } from '@/app/feedback/[id]/actions';
import { toast } from 'sonner';

interface ReplyFeedbackDialogProps {
  feedbackId: string;
  trigger: React.ReactNode;
}

export function ReplyFeedbackDialog({ feedbackId, trigger }: ReplyFeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      await addReply(feedbackId, message);
      toast.success('Antwort gesendet');
      setOpen(false);
      setMessage('');
    } catch (error) {
      toast.error('Fehler beim Senden der Antwort');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Auf Feedback antworten</DialogTitle>
          <DialogDescription>
            Ihre Antwort wird dem Schüler angezeigt und der Status auf "beantwortet" gesetzt.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ihre Antwort..."
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Abbrechen
          </Button>
          <Button onClick={handleReply} disabled={!message.trim() || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Antworten
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
