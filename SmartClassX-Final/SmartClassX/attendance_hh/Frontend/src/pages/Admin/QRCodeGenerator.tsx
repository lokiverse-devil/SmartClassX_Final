import React, { useState, useEffect } from 'react';
import { QrCode, MapPin, Clock, RefreshCw } from 'lucide-react';
import { generateQRCode, validateQRCode } from '../../utils/qrUtils';
import { storage } from '../../utils/storage';
import { QRCode as QRCodeType } from '../../types';

export const QRCodeGenerator: React.FC = () => {
  const [activeQR, setActiveQR] = useState<QRCodeType | null>(null);
  const [sessionType, setSessionType] = useState<'check-in' | 'check-out'>('check-in');
  const [useLocation, setUseLocation] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; radius: number }>({
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 2000,
  });
  const [generating, setGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Fetch active QR code from backend on component load
  const fetchActiveQR = async () => {
    try {
      const apiBase = (import.meta as any)?.env?.VITE_API_URL || 'http://10.16.182.197:5000';
      const response = await fetch(`${apiBase}/api/qrcode/active`);
      
      if (response.ok) {
        const activeQRData = await response.json();
        if (activeQRData) {
          const qr: QRCodeType = {
            id: String(activeQRData.id),
            code: activeQRData.code,
            generatedAt: new Date(activeQRData.generated_at),
            expiresAt: new Date(activeQRData.expires_at),
            isActive: true,
            sessionType: activeQRData.session_type,
            location: {
              latitude: parseFloat(activeQRData.latitude),
              longitude: parseFloat(activeQRData.longitude),
              radius: parseInt(activeQRData.radius)
            }
          };
          setActiveQR(qr);
          
          // Calculate remaining time
          const now = new Date().getTime();
          const expiresAt = new Date(activeQRData.expires_at).getTime();
          const remaining = Math.max(0, expiresAt - now);
          setTimeLeft(remaining);
          
          console.log('Loaded active QR code from backend:', qr);
        }
      }
    } catch (error) {
      console.log('No active QR code found or backend not reachable');
    }
  };

  // Commented out: Don't fetch active QR on component load
  // useEffect(() => {
  //   fetchActiveQR();
  // }, []);

  // ✅ Countdown timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeQR) {
        const now = new Date().getTime();
        const expiresAt = new Date(activeQR.expiresAt).getTime();
        const remaining = Math.max(0, expiresAt - now);
        setTimeLeft(remaining);

        // Auto remove QR when expired
        if (remaining <= 0) setActiveQR(null);
      } else {
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQR]);

  const handleGenerateQR = async () => {
    setGenerating(true);
    try {
      // Always include location data (use current location or default)
      const qrLocation = useLocation ? location : {
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 2000
      };
      
      console.log('Generating QR with location:', qrLocation);
      
      // Generate QR through backend API
      const newQR: QRCodeType = await generateQRCode(sessionType, qrLocation);
      
      console.log('Generated QR code:', newQR);
      
      // Set the active QR for display
      setActiveQR(newQR);
      setTimeLeft(30 * 60 * 1000); // Start 30 min countdown
      
      // Show success message
      alert(`✅ QR Code generated successfully!\n\nSession: ${sessionType}\nLocation: ${qrLocation.latitude}, ${qrLocation.longitude}\nRadius: ${qrLocation.radius}m\nExpires in: 30 minutes\n\nStudents can now scan this QR code to mark attendance.`);
      
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert(`❌ Failed to generate QR code: ${error.message}\n\nPlease check if the backend server is running.`);
    } finally {
      setGenerating(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radius: 2000,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTo12Hour = (date?: string | Date) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">QR Code Generator</h2>
        <div className="text-sm text-muted-foreground">
          Generate secure QR codes for attendance marking
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Controls */}
        <div className="rounded-lg p-6 space-y-6 glass">
          <h3 className="text-lg font-semibold text-foreground">Generation Settings</h3>
          {/* Session Type Buttons */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Session Type</label>
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setSessionType('check-in')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  sessionType === 'check-in'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-foreground hover:bg-muted'
                }`}
              >
                Check-in
              </button>
              <button
                onClick={() => setSessionType('check-out')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  sessionType === 'check-out'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-foreground hover:bg-muted'
                }`}
              >
                Check-out
              </button>
            </div>
          </div>

          {/* Location Settings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">Location Restriction</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLocation}
                  onChange={(e) => setUseLocation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {useLocation && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={location.latitude}
                      onChange={(e) => setLocation({ ...location, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={location.longitude}
                      onChange={(e) => setLocation({ ...location, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Radius (meters)</label>
                  <input
                    type="number"
                    value={location.radius}
                    onChange={(e) => setLocation({ ...location, radius: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  />
                </div>
                <button
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Use Current Location</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateQR}
            disabled={generating}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-colors disabled:opacity-50"
          >
            {generating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
            <span>{generating ? 'Generating...' : 'Generate New QR Code'}</span>
          </button>
        </div>

        {/* QR Display */}
        <div className="rounded-lg p-6 text-center space-y-4 glass">
          {activeQR ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Active QR Code</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg">
                <img src={activeQR.code} alt="QR Code" className="mx-auto w-64 h-64" />
              </div>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{activeQR.sessionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Generated:</span>
                  <span className="font-medium">{formatTo12Hour(activeQR.generatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">{formatTo12Hour(activeQR.expiresAt)}</span>
                </div>
                {activeQR.location && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">
                      {activeQR.location.latitude.toFixed(4)}, {activeQR.location.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Warning or Expired */}
              {timeLeft > 0 && timeLeft <= 5 * 60 * 1000 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠ QR Code expires in {formatTime(timeLeft)}
                  </p>
                </div>
              )}

              {timeLeft === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">❌ QR Code Expired</p>
                </div>
              )}
            </>
          ) : (
            <div className="py-16">
              <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active QR code</p>
              <p className="text-sm text-muted-foreground/80">
                Generate a new QR code to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};