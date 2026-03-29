export function SummaryStrip({ items }: { items: { label: string; value: string | number }[] }) {
  return (
    <div className="summary-strip">
      {items.map((item) => (
        <div key={item.label} className="summary-item">
          <div>{item.label}</div><strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
