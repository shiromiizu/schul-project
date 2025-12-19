'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deletePetition } from '@/app/student/petitions/actions';
import { toast } from 'sonner';

interface DeletePetitionDialogProps {
  petitionId: string;
  petitionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePetitionDialog({
  petitionId,
  petitionTitle,
  open,
  onOpenChange,
}: DeletePetitionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const deletePromise = deletePetition(petitionId);

    toast.promise(deletePromise, {
      loading: 'Wird gelöscht...',
      success: () => {
        onOpenChange(false);
        return 'Petition erfolgreich gelöscht';
      },
      error: (err) => {
        setIsDeleting(false);
        return err.message || 'Fehler beim Löschen der Petition';
      },
      position: 'bottom-left',
      classNames: {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Petition löschen
          </DialogTitle>
          <DialogDescription>
            Möchten Sie die folgende Petition wirklich unwiderruflich löschen?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium text-sm">{petitionTitle}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Abbrechen
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Wird gelöscht...' : 'Löschen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

