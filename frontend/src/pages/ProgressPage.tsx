import ProgressSection from '../components/ProgressSection';
import type { Workout } from '../components/types';

type ProgressPageProps = {
  workouts: Workout[];
};

function ProgressPage({ workouts }: ProgressPageProps) {
  return (
    <section className="card">
      <ProgressSection workouts={workouts} />
    </section>
  );
}

export default ProgressPage;