'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { categoryOptions, CategoryValue } from '@/lib/types';
import { feedbackSchema, type FeedbackSchema } from '@/lib/schemas';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { saveFeedback } from '@/app/submit-feedback/action';
import { BackButton } from '@/components/back-button';
import { toast } from 'sonner';

const SubmitFeedbackPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryValue | ''>('');
  const [showAllErrors, setShowAllErrors] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    setValue,
    trigger,
  } = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      category: '' as CategoryValue,
      title: '',
      description: '',
    },
  });

  const [descriptionLength, setDescriptionLength] = React.useState(0);

  const onSubmit = async (feedbackData: FeedbackSchema) => {
    setIsSubmitting(true);

    toast.promise(saveFeedback(feedbackData), {
      loading: 'Loading...',
      success: () => {
        reset();
        setShowAllErrors(false);
        setSelectedCategory('');
        setDescriptionLength(0);
        setIsSubmitting(false);
        return 'Feedback erfolgreich übermittelt!';
      },
      error: (err) => {
        setIsSubmitting(false);
        return 'Fehler beim Senden des Feedbacks: ' + (err?.message || 'Unbekannter Fehler');
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
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <BackButton className="mb-4" />
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback einreichen</h1>
          <p className="text-gray-600 mb-8">Teilen Sie uns Ihr Feedback mit.</p>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title')}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title && (touchedFields.title || showAllErrors)
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.title && (touchedFields.title || showAllErrors) && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              <div className="w-48">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorie <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value as CategoryValue);
                    setValue('category', value as CategoryValue, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                >
                  <SelectTrigger
                    className={`w-full py-5 ${
                      errors.category && (touchedFields.category || showAllErrors)
                        ? 'border-red-500'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Kategorien</SelectLabel>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.category && (touchedFields.category || showAllErrors) && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={6}
                {...register('description')}
                onChange={handleDescriptionChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description && (touchedFields.description || showAllErrors)
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              <div className="mt-1 flex justify-between items-start">
                <div className="flex-1">
                  {errors.description && (touchedFields.description || showAllErrors) && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
                <span
                  className={`text-sm ml-4 whitespace-nowrap ${
                    touchedFields.description && descriptionLength < 10
                      ? 'text-red-500'
                      : descriptionLength > 1000
                        ? 'text-red-500'
                        : 'text-gray-500'
                  }`}
                >
                  {descriptionLength} / 1000
                </span>
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full py-3 text-base font-medium">
                {isSubmitting ? 'Wird gesendet...' : 'Feedback absenden'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedbackPage;
