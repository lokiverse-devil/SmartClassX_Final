import QRCode from 'qrcode';
import { QRCode as QRCodeType } from '../types';
import { encryptQRData } from './security';

export const generateQRCode = async (
  sessionType: 'check-in' | 'check-out',
  location?: { latitude: number; longitude: number; radius: number }
): Promise<QRCodeType> => {
  const apiBase = (import.meta as any)?.env?.VITE_API_URL || 'http://10.16.182.1972.1972.197:5000';
  
  const response = await fetch(`${apiBase}/api/qrcode/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionType, location }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate QR code: ${response.status}`);
  }

  const data = await response.json();
  const generatedAt = new Date(data.generatedAt || data.generated_at);
  const expiresAt = new Date(data.expiresAt || data.expires_at);

  const qr: QRCodeType = {
    id: String(data.id),
    code: data.code,
    generatedAt,
    expiresAt,
    isActive: true,
    sessionType,
    location: data.location || location,
  };
  return qr;
};

export const validateQRCode = (qrCode: QRCodeType): boolean => {
  const now = new Date();
  return qrCode.isActive && now < qrCode.expiresAt;
};