import StudentDashboard from '@/components/student-dashboard';
import { NextPage } from 'next';
import { getMyFeedbacks } from '@/app/feedbacks/actions';

const DashboardPage: NextPage = async () => {
  const feedbacks = await getMyFeedbacks();

  return <StudentDashboard feedbacks={feedbacks} />;
};

export default DashboardPage;
