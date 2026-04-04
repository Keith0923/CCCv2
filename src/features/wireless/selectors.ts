import { floorMapSeed, wirelessSecuritySeed } from './seed';

export function selectWirelessMaps(site?: string, floor?: string) {
  return floorMapSeed.filter((map) => {
    if (site && map.siteId !== site) return false;
    if (floor && map.floor !== floor) return false;
    return true;
  });
}

export function selectWirelessSecurity(site?: string, floor?: string) {
  const rows = wirelessSecuritySeed.filter((event) => {
    if (site && event.siteId !== site) return false;
    if (floor && event.floor !== floor) return false;
    return true;
  });

  return {
    rows,
    summary: {
      rogue: rows.filter((x) => x.category === 'rogue').length,
      suspicious: rows.filter((x) => x.category === 'suspicious').length,
      contained: rows.filter((x) => x.category === 'contained').length,
      monitoring: rows.filter((x) => x.category === 'monitoring').length
    }
  };
}
