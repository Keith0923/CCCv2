export function DataTable({
  columns,
  rows,
  selectedRow,
  onRowSelect,
  actionColumnIndexes,
  className
}: {
  columns: string[];
  rows: React.ReactNode[][];
  selectedRow?: number;
  onRowSelect?: (idx: number) => void;
  actionColumnIndexes?: number[];
  className?: string;
}) {
  const actionIdxSet = new Set(actionColumnIndexes ?? []);

  return (
    <table className={`data-table ${className ?? ''}`.trim()}>
      <thead>
        <tr>{columns.map((c, idx) => <th key={c} className={actionIdxSet.has(idx) ? 'action-col' : ''}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            className={selectedRow === i ? 'selected-row' : ''}
            onClick={() => onRowSelect?.(i)}
            role={onRowSelect ? 'button' : undefined}
          >
            {row.map((cell, j) => <td key={j} className={actionIdxSet.has(j) ? 'action-col' : ''}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
