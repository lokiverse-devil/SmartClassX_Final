// src/components/QRScanner.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Wifi, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { storage } from '../../utils/storage';
import { verifyLocation, verifyWiFi } from '../../utils/security';
import QrScanner from 'react-qr-scanner';
import QrScannerLib from 'qr-scanner';

// dynamic backend URL: works on laptop (10.16.182.197) and mobile (open frontend via laptop IP)
const BACKEND_URL = `http://${window.location.hostname}:5000`;
// If mobile still can't reach, you can hardcode your laptop IP for testing:
// const BACKEND_URL = 'http://192.168.29.213:5000';

export const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [wifiStatus, setWifiStatus] = useState<boolean | null>(null);
  const [campusLocation, setCampusLocation] = useState<{ latitude: number; longitude: number; radius: number } | null>(null);
  const [loadingCampusLocation, setLoadingCampusLocation] = useState(true);
  const [activeQRStatus, setActiveQRStatus] = useState<{ hasActiveQR: boolean; expiresAt?: string } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get the authenticated user from localStorage (set by useAuth hook)
  const getAuthenticatedUser = () => {
    try {
      const storedUser = localStorage.getItem('attendo_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getAuthenticatedUser();
  
  // Create a current student object from the authenticated user
  const currentStudent = currentUser ? {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    studentId: currentUser.rollNo || currentUser.studentId || `TEMP-${String(currentUser.id).slice(0, 6)}`,
    department: currentUser.department || 'Unknown',
    year: currentUser.year || '1st year',
    phoneNumber: '',
    totalAttendance: 0,
    presentDays: 0,
    totalDays: 20,
    createdAt: new Date(currentUser.createdAt)
  } : null;

  // Fetch active QR code location from backend
  const fetchActiveQRLocation = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/qrcode/active`);
      if (response.ok) {
        const activeQR = await response.json();
        if (activeQR) {
          // Set active QR status FIRST (regardless of location)
          setActiveQRStatus({
            hasActiveQR: true,
            expiresAt: activeQR.expires_at
          });
          console.log('Active QR code found:');
          console.log('- ID:', activeQR.id);
          console.log('- Session type:', activeQR.session_type);
          console.log('- Generated at:', activeQR.generated_at);
          console.log('- Expires at:', activeQR.expires_at);
          console.log('- Is active:', activeQR.is_active);
          
          // Set campus location (if available)
          if (activeQR.latitude && activeQR.longitude && activeQR.radius) {
            setCampusLocation({
              latitude: parseFloat(activeQR.latitude),
              longitude: parseFloat(activeQR.longitude),
              radius: parseInt(activeQR.radius)
            });
            console.log('Active QR location fetched:', {
              latitude: parseFloat(activeQR.latitude),
              longitude: parseFloat(activeQR.longitude),
              radius: parseInt(activeQR.radius)
            });
          } else {
            console.warn('QR code found but no location data. Using default location.');
            // Use default location if QR doesn't have location data
            setCampusLocation({
              latitude: 40.7128,
              longitude: -74.0060,
              radius: 2000
            });
          }
        } else {
          console.warn('No active QR code found');
          setActiveQRStatus({ hasActiveQR: false });
        }
      } else {
        console.error('Failed to fetch active QR location:', response.status);
        setActiveQRStatus({ hasActiveQR: false });
      }
    } catch (error) {
      console.error('Error fetching active QR location:', error);
      setActiveQRStatus({ hasActiveQR: false });
    } finally {
      setLoadingCampusLocation(false);
    }
  };

  useEffect(() => {
    // Debug authentication on component load
    console.log('QRScanner loaded. Current user:', currentUser);
    console.log('Current student:', currentStudent);
    
    if (!currentUser) {
      console.warn('No authenticated user found in localStorage');
    }
    
    // Fetch active QR location first
    fetchActiveQRLocation();
    // request geolocation once on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setLocation(loc);

          // === DEBUG LOGS: device & campus coords + quick distance check ===
          console.log('Device location (from geolocation):', loc);
          console.log('Campus location (from active QR):', campusLocation);

          // quick distance debug using verifyLocation if campus location is available
          if (campusLocation) {
            try {
              const quickCheck = verifyLocation(
                loc.latitude,
                loc.longitude,
                campusLocation.latitude,
                campusLocation.longitude,
                campusLocation.radius
              );
              console.log(`Quick distance check (within ${campusLocation.radius}m?) ->`, quickCheck);
            } catch (e) {
              console.warn('verifyLocation threw error (check implementation):', e);
            }
          } else {
            console.warn('Campus location not yet loaded from active QR');
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else {
      console.warn('Geolocation not supported by this browser');
    }

    // check wifi (your verifyWiFi should return boolean)
    verifyWiFi()
      .then(status => {
        setWifiStatus(status);
        console.log('WiFi status (verifyWiFi):', status);
      })
      .catch(err => {
        console.error('verifyWiFi error:', err);
        setWifiStatus(false);
      });
  }, []);

  // Log when campusLocation state gets updated
  useEffect(() => {
    if (campusLocation) {
      console.log('✅ Campus location state has been updated:', campusLocation);
      console.log('🔄 Re-running location validation with new campus data...');
    }
  }, [campusLocation]);

  // Real-time countdown timer for QR code expiry
  useEffect(() => {
    if (!activeQRStatus?.hasActiveQR || !activeQRStatus?.expiresAt) {
      setTimeRemaining('');
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const expiresAt = new Date(activeQRStatus.expiresAt!);
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('EXPIRED');
        setActiveQRStatus({ hasActiveQR: false });
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [activeQRStatus]);

  // compute location validity (used for status and button disabling)
  const locationValid = (() => {
    if (!location) {
      console.log('❌ Location validation failed: Device location not available');
      return false;
    }
    if (!campusLocation) {
      console.log('❌ Location validation failed: Campus location not loaded yet');
      return false;
    }
    
    try {
      const ok = verifyLocation(
        location.latitude,
        location.longitude,
        campusLocation.latitude,
        campusLocation.longitude,
        campusLocation.radius
      );
      // Debug
      console.log(`✅ Location validation result (radius ${campusLocation.radius}m):`, ok);
      console.log(`📍 Device location: ${location.latitude}, ${location.longitude}`);
      console.log(`🏫 Campus location: ${campusLocation.latitude}, ${campusLocation.longitude}`);
      if (ok) {
        console.log(`📍 You are within ${campusLocation.radius}m of campus!`);
      } else {
        console.log(`🚫 You are outside the ${campusLocation.radius}m campus radius`);
      }
      return ok;
    } catch (e) {
      console.error('❌ Error in verifyLocation:', e);
      return false;
    }
  })();






  const handleQRScan = async (data: string | null) => {
    console.log('handleQRScan called, qrData:', data);
    console.log('Current user:', currentUser);
    console.log('Current student:', currentStudent);
    
    if (!data) return;
    if (!currentStudent) {
      console.error('No current student found. User:', currentUser);
      setResult({ 
        success: false, 
        message: `❌ Authentication Error!

Student not found. Please log in again.

🔍 Debug Info:
• User ID: ${currentUser?.id || 'Not found'}
• User Email: ${currentUser?.email || 'Not found'}
• User Role: ${currentUser?.role || 'Not found'}

Please try logging out and logging back in.` 
      });
      return;
    }
    if (scanning) return;

    setScanning(true);
    setResult(null);

    // location check
    if (!locationValid) {
      const radiusMessage = campusLocation ? `within ${campusLocation.radius}m` : 'on campus';
      setResult({ success: false, message: `You must be on/near campus (${radiusMessage}) to mark attendance.` });
      setScanning(false);
      return;
    }

    // wifi check
    if (!wifiStatus) {
      setResult({ success: false, message: 'Please connect to campus WiFi to mark attendance.' });
      setScanning(false);
      return;
    }

    try {
      // send to backend (dynamic BACKEND_URL)
      console.log('Sending validation request to backend:', `${BACKEND_URL}/api/qrcode/validate`);
      // Use the roll_no from the authenticated user if available, otherwise fall back to studentId
      const studentIdToSend = currentUser?.rollNo || currentStudent?.studentId || currentUser?.id;
      
      console.log('Sending studentId to backend:', studentIdToSend);
      console.log('Current user data:', currentUser);
      
      const response = await fetch(`${BACKEND_URL}/api/qrcode/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: data, studentId: studentIdToSend }),
      });

      const resData = await response.json();
      console.log('Backend response:', response.status, resData);
      console.log('Current time (frontend 12hr):', new Date().toLocaleString('en-US', { 
        hour12: true, 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
      console.log('QR expires at (from backend):', resData.expiresAt || activeQRStatus?.expiresAt);
      console.log('QR expires at (12hr):', resData.expiresAtFormatted || (activeQRStatus?.expiresAt ? new Date(activeQRStatus.expiresAt).toLocaleString('en-US', { 
        hour12: true, 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }) : 'Not available'));

      if (response.ok) {
        setResult({ 
          success: true, 
          message: `✅ ${resData.message || 'Attendance marked successfully!'} 
          
📊 Your attendance has been recorded:
• Session: ${resData.qrSession || 'check-in'}
• Time: ${new Date().toLocaleString('en-US', { 
            hour12: true, 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })}
• Student ID: ${studentIdToSend}

You can view your attendance history in the History section.` 
        });
      } else {
        let errorMessage = `❌ ${resData.message || 'QR validation failed.'}`;
        
        if (resData.message === 'QR code has expired') {
          const expiryInfo = resData.expiresAtFormatted ? 
            `\n⏰ QR Code expired at: ${resData.expiresAtFormatted}` : 
            (resData.expiresAt ? `\n⏰ QR Code expired at: ${new Date(resData.expiresAt).toLocaleString('en-US', { 
              hour12: true, 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}` : '');
          errorMessage = `⏰ QR Code Expired!

The QR code you scanned has expired (30-minute limit).${expiryInfo}

💡 Solutions:
• Ask your teacher/admin to generate a new QR code
• Make sure you're scanning a fresh QR code
• QR codes expire after 30 minutes for security

Please contact your administrator for a new QR code.`;
        } else if (resData.message === 'No active QR found') {
          errorMessage = `🔍 No Active QR Code!

There is currently no active QR code available.

💡 Solutions:
• Ask your teacher/admin to generate a QR code
• Make sure the admin has created a session
• Check if the QR code generation is working

Please contact your administrator.`;
        } else if (resData.message === 'Invalid QR scanned') {
          errorMessage = `🚫 Invalid QR Code!

The QR code you scanned is not valid for this session.

💡 Solutions:
• Make sure you're scanning the correct QR code
• Check if the QR code is for the right session (check-in/check-out)
• Ask your teacher for the current QR code

Please try scanning the correct QR code.`;
        }
        
        setResult({ 
          success: false, 
          message: errorMessage
        });
      }
    } catch (err) {
      console.error('Network/backend error:', err);
      setResult({ success: false, message: 'Server connection failed. Check backend/CORS/IP.' });
    }

    setScanning(false);
  };

  // Handle file upload and decode QR code from image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log('File selected for upload:', file.name);
    
    // Show loading state
    setResult({ success: false, message: '🔄 Processing uploaded image...' });
    
    try {
      // Create a FileReader to read the image file
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const imageData = event.target?.result;
        if (!imageData) {
          console.error('Failed to read image file');
          setResult({ success: false, message: 'Failed to read image file.' });
          return;
        }

        try {
          // Use QrScanner to decode the QR code from the image
          const result = await QrScannerLib.scanImage(imageData as string, {
            returnDetailedScanResult: true
          });
          
          console.log('QR code decoded from image:', result.data);
          await handleQRScan(result.data);
        } catch (decodeError) {
          console.error('Failed to decode QR code from image:', decodeError);
          setResult({ 
            success: false, 
            message: `❌ QR Code Not Found!

The uploaded image doesn't contain a valid QR code.

💡 Tips:
• Make sure the image contains a clear QR code
• Try taking a new photo with better lighting
• Ensure the QR code is not blurry or damaged
• Check that the entire QR code is visible in the image` 
          });
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        setResult({ success: false, message: 'Error reading the uploaded file.' });
      };
      
      // Read the file as data URL
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      setResult({ success: false, message: 'Error processing the uploaded file.' });
    }
    
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  // Status helpers for UI
  const locationStatus = !location
    ? { icon: AlertTriangle, color: 'text-yellow-500', text: 'Getting location...' }
    : loadingCampusLocation
      ? { icon: AlertTriangle, color: 'text-yellow-500', text: 'Loading campus location...' }
      : !campusLocation
        ? { icon: XCircle, color: 'text-red-500', text: 'No active QR code found' }
        : locationValid
          ? { icon: MapPin, color: 'text-green-500', text: 'On/near campus' }
          : { icon: XCircle, color: 'text-red-500', text: 'Not on campus' };

  const wifiStatusInfo = wifiStatus === null
    ? { icon: AlertTriangle, color: 'text-yellow-500', text: 'Checking WiFi...' }
    : wifiStatus
      ? { icon: Wifi, color: 'text-green-500', text: 'Campus WiFi connected' }
      : { icon: XCircle, color: 'text-red-500', text: 'Not on campus WiFi' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">QR Code Scanner</h2>
        <div className="text-sm text-muted-foreground">Scan QR codes to mark attendance</div>
      </div>

      {/* User Status */}
      {currentUser && (
        <div className="glass p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <span className="text-sm font-medium text-foreground">Logged in as: {currentUser.name}</span>
                <div className="text-xs text-muted-foreground">
                  {currentUser.email} • Roll No: {currentUser.rollNo || 'Not set'}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Student ID: {currentStudent?.studentId}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Status */}
      {activeQRStatus && (
        <div className="glass p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {activeQRStatus.hasActiveQR ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <span className="text-sm font-medium text-foreground">
                  {activeQRStatus.hasActiveQR ? 'Active QR Code Available' : 'No Active QR Code'}
                </span>
                {activeQRStatus.hasActiveQR && activeQRStatus.expiresAt && (
                  <div className="text-xs text-muted-foreground">
                    <div>Expires: {new Date(activeQRStatus.expiresAt).toLocaleString('en-US', {
                      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}</div>
                    {timeRemaining && (
                      <div className={`text-xs font-medium ${timeRemaining === 'EXPIRED' ? 'text-red-500' : 'text-green-500'}`}>
                        Time left: {timeRemaining}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {!activeQRStatus.hasActiveQR && (
              <div className="text-xs text-red-500">
                Ask admin to generate QR code
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-4 rounded-xl flex items-center space-x-3">
          <locationStatus.icon className={`h-5 w-5 ${locationStatus.color}`} />
          <span className="text-sm font-medium text-foreground">{locationStatus.text}</span>
        </div>

        <div className="glass p-4 rounded-xl flex items-center space-x-3">
          <wifiStatusInfo.icon className={`h-5 w-5 ${wifiStatusInfo.color}`} />
          <span className="text-sm font-medium text-foreground">{wifiStatusInfo.text}</span>
        </div>
      </div>

      {/* Scanner area */}
      <div className="glass p-8 rounded-xl text-center">
        <Camera className="h-16 w-16 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-semibold text-foreground mt-4">Scan QR Code</h3>
        <p className="text-muted-foreground">Use camera to scan QR or upload an image</p>

        <div className="mt-4">
          <QrScanner
            onDecode={(result) => {
              handleQRScan(result);
            }}
            onError={(error) => {
              // don't spam console, but log once
              // console.error('QrScanner error:', error);
            }}
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%' }}
            videoStyle={{ borderRadius: 12 }}
          />
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            Upload Image
          </button>

          <button
            disabled={scanning || !location || !wifiStatus || !locationValid}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scanning ? 'Processing...' : `Scan Now`}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`glass p-4 rounded-xl border mt-4 ${result.success ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
          <div className="flex items-center space-x-3">
            {result.success ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />}
            <div>
              <p className="font-medium text-foreground">{result.success ? 'Success!' : 'Failed'}</p>
              <p className="text-sm text-muted-foreground">{result.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
