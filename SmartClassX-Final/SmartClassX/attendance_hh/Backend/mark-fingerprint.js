/**
 * Manual Fingerprint Attendance Marker
 * Usage: node mark-fingerprint.js <roll_no> <check-in|check-out> [device_id] [location]
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function markAttendance(rollNo, sessionType, deviceId = 'MANUAL_DEVICE', location = 'Manual Entry') {
  try {
    console.log('\n🔐 Marking Fingerprint Attendance...');
    console.log('='.repeat(60));
    console.log(`Roll No: ${rollNo}`);
    console.log(`Session Type: ${sessionType}`);
    console.log(`Device: ${deviceId}`);
    console.log(`Location: ${location}`);
    console.log('='.repeat(60));

    // Validate session type
    if (!['check-in', 'check-out'].includes(sessionType)) {
      console.error('❌ Invalid session type. Must be either "check-in" or "check-out"');
      process.exit(1);
    }

    // Get student details
    console.log('\n📋 Fetching student details...');
    const { data: studentData, error: studentError } = await supabase
      .from('student_details')
      .select('roll_no, department, year, users(name)')
      .eq('roll_no', rollNo)
      .single();

    if (studentError || !studentData) {
      console.error('❌ Student not found with roll number:', rollNo);
      console.log('💡 Make sure the student exists in the student_details table');
      process.exit(1);
    }

    console.log('✅ Student found:');
    console.log(`   Name: ${studentData.users?.name || 'Unknown'}`);
    console.log(`   Department: ${studentData.department}`);
    console.log(`   Year: ${studentData.year}`);

    // Check if already marked today
    const today = new Date().toISOString().split('T')[0];
    console.log(`\n📅 Checking for existing ${sessionType} record today (${today})...`);
    
    const { data: existingRecord } = await supabase
      .from('fingerprint_attendance')
      .select('*')
      .eq('roll_no', rollNo)
      .eq('session_type', sessionType)
      .gte('marked_at', `${today}T00:00:00`)
      .lte('marked_at', `${today}T23:59:59`)
      .maybeSingle();

    if (existingRecord) {
      console.log(`⚠️  ${sessionType.toUpperCase()} already marked today!`);
      console.log(`   Marked at: ${new Date(existingRecord.marked_at).toLocaleString()}`);
      console.log(`   Device: ${existingRecord.device_id}`);
      console.log(`   Location: ${existingRecord.location}`);
      console.log('\n💡 Students can only mark attendance once per session per day');
      process.exit(0);
    }

    console.log(`✅ No existing ${sessionType} record found for today`);

    // Insert attendance record
    console.log(`\n➡️  Marking ${sessionType}...`);
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('fingerprint_attendance')
      .insert([{
        roll_no: rollNo,
        student_name: studentData.users?.name || 'Unknown',
        department: studentData.department,
        year: studentData.year,
        session_type: sessionType,
        marked_at: new Date().toISOString(),
        fingerprint_verified: true,
        device_id: deviceId,
        location: location
      }])
      .select()
      .single();

    if (attendanceError) {
      console.error('❌ Error marking attendance:', attendanceError.message);
      console.error('Details:', attendanceError);
      process.exit(1);
    }

    console.log('\n✅ Attendance marked successfully!');
    console.log('='.repeat(60));
    console.log('Record Details:');
    console.log(`   ID: ${attendanceData.id}`);
    console.log(`   Roll No: ${attendanceData.roll_no}`);
    console.log(`   Student: ${attendanceData.student_name}`);
    console.log(`   Department: ${attendanceData.department}`);
    console.log(`   Year: ${attendanceData.year}`);
    console.log(`   Session: ${attendanceData.session_type}`);
    console.log(`   Marked At: ${new Date(attendanceData.marked_at).toLocaleString()}`);
    console.log(`   Device: ${attendanceData.device_id}`);
    console.log(`   Location: ${attendanceData.location}`);
    console.log(`   Verified: ${attendanceData.fingerprint_verified ? '✓' : '✗'}`);
    console.log('='.repeat(60));

    // Show today's status for this student
    console.log('\n📊 Today\'s Status for this Student:');
    const { data: todayStatus } = await supabase
      .from('today_fingerprint_attendance')
      .select('*')
      .eq('roll_no', rollNo)
      .single();

    if (todayStatus) {
      console.log(`   Status: ${todayStatus.attendance_status}`);
      if (todayStatus.check_in_time) {
        console.log(`   Check-in: ${new Date(todayStatus.check_in_time).toLocaleTimeString()}`);
      }
      if (todayStatus.check_out_time) {
        console.log(`   Check-out: ${new Date(todayStatus.check_out_time).toLocaleTimeString()}`);
      }
    }

    console.log('\n✨ Done!\n');

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('\n📖 Fingerprint Attendance Marker');
  console.log('='.repeat(60));
  console.log('\nUsage:');
  console.log('  node mark-fingerprint.js <roll_no> <session_type> [device_id] [location]');
  console.log('\nArguments:');
  console.log('  roll_no      : Student roll number (required)');
  console.log('  session_type : Either "check-in" or "check-out" (required)');
  console.log('  device_id    : Device identifier (optional, default: MANUAL_DEVICE)');
  console.log('  location     : Location name (optional, default: Manual Entry)');
  console.log('\nExamples:');
  console.log('  node mark-fingerprint.js TEST2025001 check-in');
  console.log('  node mark-fingerprint.js TEST2025001 check-out');
  console.log('  node mark-fingerprint.js TEST2025001 check-in DEVICE_001 "Main Campus"');
  console.log('  node mark-fingerprint.js TEST2025002 check-in DEVICE_002 "Building A"\n');
  process.exit(0);
}

const [rollNo, sessionType, deviceId, location] = args;

markAttendance(rollNo, sessionType, deviceId, location).catch(console.error);

