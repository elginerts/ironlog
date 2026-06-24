import History from '../components/History';
import type { Workout } from '../components/types';

type HistoryPageProps = {
  workouts: Workout[];
  onDelete?: (id: number) => Promise<boolean> | void;
  isLoading?: boolean;
};

function HistoryPage({ workouts, onDelete, isLoading = false }: HistoryPageProps) {
  return (
    <section className="card">
      <h2>History</h2>
      <History workouts={workouts} onDelete={onDelete} isLoading={isLoading} />
    </section>
  );
}

export default HistoryPage;
