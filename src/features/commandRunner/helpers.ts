import { Device, DeviceRole, JobStatus } from '../../domains/types';

export type CommandPreset = 'show version' | 'show ip interface brief' | 'show logging';

export interface CommandRun {
  id: string;
  command: CommandPreset;
  targetDeviceId: string;
  targetSite?: string;
  issueContext?: string;
  status: JobStatus;
  output: string;
  createdAt: string;
}

const commandPresets: CommandPreset[] = ['show version', 'show ip interface brief', 'show logging'];

export function getCommandPresets() {
  return commandPresets;
}

function renderOutput(command: CommandPreset, device: Device, role: DeviceRole, issue?: string) {
  const issueLine = issue ? `Issue context: ${issue}` : 'Issue context: none';

  if (command === 'show version') {
    return [
      `${device.name} uptime is 2 weeks, 4 days`,
      `Role profile: ${role}`,
      'Cisco IOS XE Software, Version 17.9.4a',
      issueLine
    ].join('\n');
  }

  if (command === 'show ip interface brief') {
    return [
      'Interface              IP-Address      OK? Method Status                Protocol',
      `Vlan1                  ${device.managementIp}  YES NVRAM  up                    up`,
      `Loopback0              ${device.preferredManagementIpCandidate ?? 'unassigned'}  YES unset  ${issue === 'mgmt-ambiguity' ? 'down' : 'up'}                  ${issue === 'mgmt-ambiguity' ? 'down' : 'up'}`,
      issueLine
    ].join('\n');
  }

  return [
    '*Mar 31 08:21:10.120: %SYS-5-CONFIG_I: Configured from console by admin',
    issue === 'mis-role'
      ? '*Mar 31 08:24:11.532: %POLICY-4-ROLE_MISMATCH: role profile differs from observed uplinks'
      : '*Mar 31 08:24:11.532: %LINK-3-UPDOWN: Interface Gi1/0/24 changed state to up',
    `${device.name} last 20 log lines displayed`,
    issueLine
  ].join('\n');
}

export function createCommandRun(input: { command: CommandPreset; device: Device; issue?: string; site?: string }): CommandRun {
  const role = input.device.roleOverride ?? input.device.roleDetected;
  return {
    id: `cr-${Math.random().toString(36).slice(2, 8)}`,
    command: input.command,
    targetDeviceId: input.device.id,
    targetSite: input.site || input.device.siteId,
    issueContext: input.issue,
    status: 'success',
    output: renderOutput(input.command, input.device, role, input.issue),
    createdAt: new Date().toISOString()
  };
}
