import PetitionsList from '@/components/petitions-list';
import { BackButton } from '@/components/back-button';
import { fetchApprovedPetitions } from '@/app/petitions/actions';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PetitionsPage = async () => {
  const approvedPetitions = await fetchApprovedPetitions(); // Placeholder for fetched petitions

  return (
    <div className="mx-auto py-8">
      <BackButton className="mb-4" />
      <div className="flex justify-between items-center px-2 mb-6">
        <h1 className="text-3xl font-bold">Aktuelle Petitionen</h1>
        <Button asChild size="sm" className="gap-2">
          <Link href="/student/submit-petition">
            <Plus className="w-4 h-4" />
            Petition einreichen
          </Link>
        </Button>
      </div>
      <PetitionsList petitions={approvedPetitions} />
    </div>
  );
};

export default PetitionsPage;
