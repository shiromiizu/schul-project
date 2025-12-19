import { fetchStudentPetitions } from './actions';
import { StudentPetitionsList } from '@/components/student/student-petitions-list';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default async function StudentPetitionsPage() {
  const petitions = await fetchStudentPetitions();

  return (
    <div className={'mt-4'}>
      <BackButton className="mb-4" />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-2xl">Meine Petitionen</CardTitle>
              <CardDescription className="mt-1">
                Übersicht über Ihre eingereichten Petitionen und deren Status
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentPetitionsList petitions={petitions} />
        </CardContent>
      </Card>
    </div>
  );
}
