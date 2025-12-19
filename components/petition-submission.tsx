'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { petitionSchema, type PetitionSchema } from '@/lib/schemas';
import { BackButton } from '@/components/back-button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { savePetition } from '@/app/student/submit-petition/action';

const PetitionSubmission = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    trigger,
  } = useForm<PetitionSchema>({
    resolver: zodResolver(petitionSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const [descriptionLength, setDescriptionLength] = React.useState(0);

  const onSubmit = async (petitionData: PetitionSchema) => {
    setIsSubmitting(true);

    toast.promise(savePetition(petitionData), {
      loading: 'Loading...',
      success: (result) => {
        if (result.error) {
          setIsSubmitting(false);
          return 'Fehler beim Senden der Petition';
        }
        reset();
        setShowAllErrors(false);
        setDescriptionLength(0);
        setIsSubmitting(false);
        router.push('/petitions');
        return 'Petition erfolgreich eingereicht!';
      },
      error: () => {
        setIsSubmitting(false);
        return 'Fehler beim Senden der Petition';
      },
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAllErrors(true);
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(onSubmit)(e);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionLength(e.target.value.length);
  };

  return (
    <div className={'mt-4'}>
      <div className="max-w-2xl mx-auto">
        <BackButton className="mb-4" />
        <div className="bg-card shadow-md rounded-lg p-8 border border-border">
          <h1 className="text-3xl font-bold text-foreground mb-2">Petition einreichen</h1>
          <p className="text-muted-foreground mb-8">
            Hast du eine Idee, wie die B3 besser werden kann? Schlage eine konkrete Verbesserung vor
            und lass die Community darüber abstimmen — so kommt die Stimme ganz nach oben!
          </p>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="flex-1">
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Titel <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                type="text"
                {...register('title')}
                className={cn(
                  errors.title && (touchedFields.title || showAllErrors)
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                )}
              />
              {errors.title && (touchedFields.title || showAllErrors) && (
                <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Beschreibung <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                rows={6}
                {...register('description')}
                onChange={(e) => {
                  register('description').onChange(e);
                  handleDescriptionChange(e);
                }}
                className={cn(
                  'resize-none',
                  errors.description && (touchedFields.description || showAllErrors)
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                )}
              />
              <div className="mt-1 flex justify-between items-start">
                <div className="flex-1">
                  {errors.description && (touchedFields.description || showAllErrors) && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm ml-4 whitespace-nowrap',
                    touchedFields.description && descriptionLength < 10
                      ? 'text-destructive'
                      : descriptionLength > 1000
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                  )}
                >
                  {descriptionLength} / 1000
                </span>
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full py-3 text-base font-medium">
                {isSubmitting ? 'Wird gesendet...' : 'Petition einreichen'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetitionSubmission;
