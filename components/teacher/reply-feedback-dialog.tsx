'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { replySchema, type ReplySchema } from '@/lib/schemas';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface ReplyFeedbackDialogProps {
  feedbackId: string;
  trigger: React.ReactNode;
}

export function ReplyFeedbackDialog({ feedbackId, trigger }: ReplyFeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReplySchema>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: '',
    },
    mode: 'onChange',
  });

  const { watch, reset } = form;
  const message = watch('message');

  const onSubmit = async (data: ReplySchema) => {
    setIsSubmitting(true);
    try {
      await addReply(feedbackId, data.message);
      toast.success('Antwort gesendet');
      setOpen(false);
      reset();
    } catch (error) {
      toast.error('Fehler beim Senden der Antwort');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) reset();
    }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Auf Feedback antworten</DialogTitle>
          <DialogDescription>
            Ihre Antwort wird dem Schüler angezeigt und der Status auf "Gesehen" gesetzt.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Ihre Antwort (10-1000 Zeichen)..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <FormMessage />
                    <span className={message?.length > 1000 ? "text-destructive" : ""}>
                      {message?.length || 0}/1000
                    </span>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Antworten
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
