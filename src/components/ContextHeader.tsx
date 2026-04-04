type ContextHeaderProps = {
  site?: string;
  device?: string;
  issue?: string;
  time?: string;
  className?: string;
};

const valueOf = (v?: string) => (v && v.trim().length > 0 ? v : '-');

export function ContextHeader({ site, device, issue, time, className }: ContextHeaderProps) {
  return (
    <div className={className ?? 'context-header'} aria-label="Context Header">
      <span><strong>Site:</strong> {valueOf(site)}</span>
      <span><strong>Device:</strong> {valueOf(device)}</span>
      <span><strong>Issue:</strong> {valueOf(issue)}</span>
      <span><strong>Time:</strong> {valueOf(time)}</span>
    </div>
  );
}
