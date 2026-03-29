import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('cccv2', {
  version: '0.1.0'
});
