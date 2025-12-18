import PetitionsList from '@/components/petitions-list';
import { BackButton } from '@/components/back-button';
import { fetchApprovedPetitions } from '@/app/petitions/actions';

const PetitionsPage = async () => {
  const approvedPetitions = await fetchApprovedPetitions(); // Placeholder for fetched petitions

  return (
    <div className="mx-auto py-8">
      <BackButton className="mb-4" />
      <h1 className="text-3xl font-bold mb-6">Aktuelle Petitionen</h1>
      <PetitionsList petitions={approvedPetitions} />
    </div>
  );
};

export default PetitionsPage;
