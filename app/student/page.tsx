import StudentDashboard from '@/components/student-dashboard';
import { NextPage } from 'next';
import { getMyFeedbacks } from '@/app/student/feedback/actions';
import { getMyRecentPetitions } from '@/app/student/petitions/actions';

const DashboardPage: NextPage = async () => {
  const feedbacks = await getMyFeedbacks();
  const petitions = await getMyRecentPetitions();

  return <StudentDashboard feedbacks={feedbacks} petitions={petitions} />;
};

export default DashboardPage;
