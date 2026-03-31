export function Tabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button key={tab} className={tab === value ? 'active' : ''} onClick={() => onChange(tab)}>{tab}</button>
      ))}
    </div>
  );
}
