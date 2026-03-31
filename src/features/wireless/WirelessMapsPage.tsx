import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { selectWirelessMaps } from './selectors';

export function WirelessMapsPage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const floor = params.get('floor') ?? '';
  const device = params.get('device') ?? '';
  const issue = params.get('issue') ?? '';

  const maps = selectWirelessMaps(site || undefined, floor || undefined);
  const activeMap = maps[0];

  return (
    <div>
      <div className="page-header">
        <h1>Wireless Maps Lite</h1>
        <p>Floor-aware spatial view for AP/client/heat context.</p>
      </div>

      <Panel title="Site / Floor Context">
        <p>Site: {site || activeMap?.siteId || 'all'} / Floor: {floor || activeMap?.floor || 'all'} / Issue: {issue || 'none'}</p>
      </Panel>

      <Panel title="2D Floor Map (Lite)">
        {activeMap ? (
          <div className="wireless-map-lite">
            <div className="wireless-map-title">{activeMap.siteId} / {activeMap.building} / {activeMap.floor}</div>
            <div className="wireless-map-canvas">
              {activeMap.aps.map((ap) => <span key={ap.id} className={`map-dot map-ap map-${ap.health}`} style={{ left: `${ap.x}%`, top: `${ap.y}%` }}>{ap.label}</span>)}
              {activeMap.clients.map((client) => <span key={client.id} className="map-dot map-client" style={{ left: `${client.x}%`, top: `${client.y}%` }}>{client.label}</span>)}
            </div>
            <div className="wireless-zone-row">
              {activeMap.zones.map((zone) => <span key={zone.id} className={`zone zone-${zone.intensity}`}>{zone.label}</span>)}
            </div>
          </div>
        ) : (
          <p>No map in current focus.</p>
        )}
      </Panel>

      <Panel title="AP / Client Summary">
        <DataTable
          columns={['Floor', 'AP Count', 'Client Count', 'Heat Zones', 'Actions']}
          rows={maps.map((map) => [
            map.floor,
            map.aps.length,
            map.clients.length,
            map.zones.map((z) => z.label).join(', '),
            <>
              <Link to={`/wireless/maps?site=${map.siteId}&floor=${map.floor}`}>Focus</Link>
              {' | '}
              <Link to={`/wireless/security?site=${map.siteId}&floor=${map.floor}`}>Wireless Security</Link>
            </>
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        <Link to={device ? `/device-360/${device}` : '/device-360/dev-1'}>Back to Device 360</Link>
        <Link to={site ? `/wireless/security?site=${site}&floor=${floor}&issue=${issue}` : '/wireless/security'}>Go Wireless Security</Link>
      </div>
    </div>
  );
}
