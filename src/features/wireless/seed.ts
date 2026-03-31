export interface FloorMapLite {
  id: string;
  siteId: string;
  building: string;
  floor: string;
  aps: Array<{ id: string; label: string; x: number; y: number; health: 'healthy' | 'warning' }>;
  clients: Array<{ id: string; label: string; x: number; y: number }>;
  zones: Array<{ id: string; label: string; intensity: 'low' | 'medium' | 'high' }>;
}

export interface WirelessSecurityEventLite {
  id: string;
  siteId: string;
  floor: string;
  category: 'rogue' | 'suspicious' | 'contained' | 'monitoring';
  severity: 'low' | 'medium' | 'high';
  summary: string;
  relatedAp: string;
}

export const floorMapSeed: FloorMapLite[] = [
  {
    id: 'map-1',
    siteId: 'SJC-Campus',
    building: 'HQ-1',
    floor: 'Floor-1',
    aps: [
      { id: 'ap-1', label: 'AP-Lobby', x: 18, y: 24, health: 'healthy' },
      { id: 'ap-2', label: 'AP-East', x: 68, y: 40, health: 'warning' }
    ],
    clients: [
      { id: 'cl-1', label: 'Client-23', x: 30, y: 38 },
      { id: 'cl-2', label: 'Client-77', x: 58, y: 58 }
    ],
    zones: [
      { id: 'z-1', label: 'Lobby heat', intensity: 'medium' },
      { id: 'z-2', label: 'East wing heat', intensity: 'high' }
    ]
  },
  {
    id: 'map-2',
    siteId: 'NYC-Branch',
    building: 'BR-1',
    floor: 'Floor-3',
    aps: [
      { id: 'ap-3', label: 'AP-Core', x: 35, y: 30, health: 'healthy' }
    ],
    clients: [
      { id: 'cl-3', label: 'Client-12', x: 45, y: 46 }
    ],
    zones: [
      { id: 'z-3', label: 'Center zone heat', intensity: 'low' }
    ]
  }
];

export const wirelessSecuritySeed: WirelessSecurityEventLite[] = [
  { id: 'ws-1', siteId: 'SJC-Campus', floor: 'Floor-1', category: 'rogue', severity: 'high', summary: 'Unknown AP beacon detected near east wing.', relatedAp: 'AP-East' },
  { id: 'ws-2', siteId: 'SJC-Campus', floor: 'Floor-1', category: 'contained', severity: 'medium', summary: 'Rogue client containment active on AP-East.', relatedAp: 'AP-East' },
  { id: 'ws-3', siteId: 'NYC-Branch', floor: 'Floor-3', category: 'monitoring', severity: 'low', summary: 'Neighbor AP fingerprint under monitoring.', relatedAp: 'AP-Core' },
  { id: 'ws-4', siteId: 'NYC-Branch', floor: 'Floor-3', category: 'suspicious', severity: 'medium', summary: 'Suspicious SSID broadcast overlaps corp profile.', relatedAp: 'AP-Core' }
];
