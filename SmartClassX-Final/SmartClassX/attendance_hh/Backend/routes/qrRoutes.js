import express from 'express';
import supabase from "../src/config/db.js";

const router = express.Router();

// Generate new QR
router.post('/generate', async (req, res) => {
  const { sessionType, location } = req.body;

  // Step 1: Deactivate ALL previous QR codes
  const { error: deactivateError } = await supabase
    .from('qr_codes_admin')
    .update({ is_active: false })
    .neq('id', 0); // Update all records
  
  if (deactivateError) {
    console.error("Error deactivating previous QR codes:", deactivateError);
    return res.status(500).json({ error: 'Failed to deactivate previous QR codes' });
  }

  // Step 2: Generate new QR code with proper time handling
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 60 * 1000);

  // Store as local time strings (remove 'Z' suffix) to match database parsing
  const generatedAt = now.toISOString().replace('Z', '');
  const expiresAt = expires.toISOString().replace('Z', '');

  const code = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(sessionType);
  
  const latitude = location?.latitude || null;
  const longitude = location?.longitude || null;
  const radius = location?.radius || null;

  const { data, error } = await supabase
    .from('qr_codes_admin')
    .insert([{ session_type: sessionType, code, generated_at: generatedAt, expires_at: expiresAt, latitude, longitude, radius, is_active: true }])
    .select();
    
  if (error) {
    console.error("Supabase INSERT ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
  
  res.json({
    id: data[0].id,
    code,
    sessionType,
    generatedAt,
    expiresAt,
    location: location || null,
  });
});

// Get active QR
router.get('/active', async (req, res) => {
  // First, clean up expired QR codes
  const now = new Date();
  const { error: cleanupError } = await supabase
    .from('qr_codes_admin')
    .update({ is_active: false })
    .lt('expires_at', now.toISOString())
    .eq('is_active', true);
  
  if (cleanupError) {
    console.error("Supabase CLEANUP ERROR:", cleanupError);
  } else {
    console.log('Cleaned up expired QR codes');
  }

  // Then get the latest active QR
  const { data, error } = await supabase
    .from('qr_codes_admin')
    .select('*')
    .eq('is_active', true)
    .order('generated_at', { ascending: false })
    .limit(1);
  if (error) {
    console.error("Supabase SELECT ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data[0] || null);
});

export { router as qrRoutes };





// Validate scanned QR by student
router.post('/validate', async (req, res) => {
  const { qrData, studentId } = req.body;

  if (!qrData || !studentId) {
    return res.status(400).json({ message: 'QR data or student ID missing' });
  }

  // First, clean up expired QR codes
  const now = new Date();
  const { error: cleanupError } = await supabase
    .from('qr_codes_admin')
    .update({ is_active: false })
    .lt('expires_at', now.toISOString())
    .eq('is_active', true);
  
  if (cleanupError) {
    console.error("Supabase CLEANUP ERROR:", cleanupError);
  }

  // Check if QR exists and active
  const { data: qrDataResult, error: qrError } = await supabase
    .from('qr_codes_admin')
    .select('*')
    .eq('is_active', true)
    .order('generated_at', { ascending: false })
    .limit(1);
  if (qrError) {
    console.error("Supabase SELECT ERROR:", qrError);
    return res.status(500).json({ message: 'Database error' });
  }
  if (!qrDataResult || qrDataResult.length === 0) {
    return res.status(404).json({ message: 'No active QR found' });
  }
  const activeQR = qrDataResult[0];
  // Fix timezone issue: treat database time as local time (since it's stored without timezone)
  let expiresAt;
  if (activeQR.expires_at.includes('Z') || activeQR.expires_at.includes('+') || activeQR.expires_at.includes('-')) {
    // Already has timezone info
    expiresAt = new Date(activeQR.expires_at);
  } else {
    // No timezone info, treat as local time (database stores local time)
    // Create a new Date object treating the string as local time
    const [datePart, timePart] = activeQR.expires_at.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');
    const [sec, ms] = second.split('.');
    expiresAt = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(sec), parseInt(ms || '0'));
  }

  // Debug logging
  console.log('QR Validation Debug:');
  console.log('Current time (UTC):', now.toISOString());
  console.log('Current time (12hr):', now.toLocaleString('en-US', { 
    hour12: true, 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }));
  console.log('QR expires at (raw from DB):', activeQR.expires_at);
  console.log('QR expires at (parsed as local time):', expiresAt.toISOString());
  console.log('QR expires at (12hr):', expiresAt.toLocaleString('en-US', { 
    hour12: true, 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }));
  console.log('Time difference (minutes):', (expiresAt - now) / (1000 * 60));
  console.log('Is expired?', now > expiresAt);
  console.log('QR is active:', activeQR.is_active);
  console.log('QR session type:', activeQR.session_type);

  // Expiry check with proper timezone handling
  if (now > expiresAt) {
    console.log('QR code has expired');
    return res.status(400).json({ 
      message: 'QR code has expired',
      expiresAt: activeQR.expires_at,
      expiresAtFormatted: expiresAt.toLocaleString('en-US', { 
        hour12: true, 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      currentTime: now.toISOString(),
      currentTimeFormatted: now.toLocaleString('en-US', { 
        hour12: true, 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    });
  }

  // Match data - handle both encrypted and simple QR formats
  let isValidQR = false;
  if (qrData.includes(activeQR.session_type)) {
    isValidQR = true;
  } else {
    try {
      const decoded = Buffer.from(qrData, 'base64').toString('utf8');
      const [data, timestamp] = decoded.split('|');
      const qrObject = JSON.parse(data);
      if (qrObject.sessionType === activeQR.session_type) {
        isValidQR = true;
      }
    } catch (decryptError) {
      console.log('QR decryption failed, treating as simple format');
    }
  }
  if (!isValidQR) {
    return res.status(400).json({ message: 'Invalid QR scanned' });
  }

  // If all good — mark attendance
  const { error: attendanceError } = await supabase
    .from('attendance')
    .insert([{ student_id: studentId, session_type: activeQR.session_type, qr_id: activeQR.id, marked_at: now.toISOString() }]);
  if (attendanceError) {
    console.error("Supabase INSERT ERROR:", attendanceError);
    return res.status(500).json({ message: 'Failed to mark attendance' });
  }

  return res.json({
    message: `Successfully ${activeQR.session_type === 'check-in' ? 'checked in' : 'checked out'}!`,
    qrSession: activeQR.session_type,
  });
});
