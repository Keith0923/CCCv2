const labelMap: Record<string, string> = {
  'mis-role': 'Mis-Role',
  'mgmt-ambiguity': 'Mgmt Ambiguity',
  unassigned: 'Unassigned'
};

export function IssueTag({ value }: { value: string }) {
  const cls = value === 'mis-role' ? 'issue-role' : value === 'mgmt-ambiguity' ? 'issue-mgmt' : 'issue-unassigned';
  return <span className={`issue-tag ${cls}`}>{labelMap[value] ?? value}</span>;
}
