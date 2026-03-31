export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input placeholder="Search" value={value} onChange={(e) => onChange(e.target.value)} className="search" />;
}
