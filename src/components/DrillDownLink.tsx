import { Link } from 'react-router-dom';

type DrillDownLinkProps = {
  to: string;
  label: string;
  reason: string;
};

export function DrillDownLink({ to, label, reason }: DrillDownLinkProps) {
  return (
    <span className="drilldown-link-wrap">
      <Link to={to}>{label}</Link>
      <small className="drilldown-reason">{reason}</small>
    </span>
  );
}
