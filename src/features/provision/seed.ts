import { ProvisionTemplate } from '../../domains/types';

export const provisionTemplates: ProvisionTemplate[] = [
  {
    id: 'tpl-day0-access',
    name: 'Access Day0 Baseline',
    category: 'day0',
    parameterSchema: [
      { key: 'hostnamePrefix', label: 'Hostname Prefix', required: true },
      { key: 'snmpCommunity', label: 'SNMP Community', required: true }
    ]
  },
  {
    id: 'tpl-wireless-ssid',
    name: 'Wireless SSID Baseline',
    category: 'wireless',
    parameterSchema: [
      { key: 'ssidName', label: 'SSID Name', required: true },
      { key: 'vlanId', label: 'VLAN ID', required: true }
    ]
  }
];
