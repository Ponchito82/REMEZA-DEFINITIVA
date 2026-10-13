import { apiGet, apiPut } from "./client";

export type DeviceData = {
  id: string;
  deviceId: string;
  biometricEnabled: boolean;
};

/** Da de alta el dispositivo o actualiza el que ya estaba; repetirlo no cambia nada. */
export function setDeviceBiometric(deviceId: string, enabled: boolean): Promise<DeviceData> {
  return apiPut<DeviceData>("/api/v1/devices/biometric", { deviceId, enabled });
}

export async function listDevices(): Promise<DeviceData[]> {
  return (await apiGet<DeviceData[]>("/api/v1/devices")) ?? [];
}
