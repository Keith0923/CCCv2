import { DataTable } from '../../components/DataTable';
import { useAppState } from '../../app/state';

export function JobsPage() {
  const { data } = useAppState();
  return <div><h1>Jobs (Supplemental)</h1><DataTable columns={['ID', 'Module', 'Status', 'Created']} rows={data.jobs.map((j) => [j.id, j.module, j.status, j.createdAt])} /></div>;
}
