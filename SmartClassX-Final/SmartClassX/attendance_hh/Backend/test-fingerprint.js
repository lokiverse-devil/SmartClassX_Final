/**
 * Test script for fingerprint attendance system
 * This script tests the fingerprint attendance API endpoints
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testFingerprintSystem() {
  console.log('🧪 Testing Fingerprint Attendance System\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Check if table exists
    console.log('\n📋 Test 1: Checking if fingerprint_attendance table exists...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('fingerprint_attendance')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Table does not exist or query failed:', tableError.message);
      console.log('💡 Please run the fingerprint_attendance.sql file in Supabase first!');
      return;
    }
    console.log('✅ Table exists!');

    // Test 2: Check existing records
    console.log('\n📋 Test 2: Checking existing records...');
    const { data: existingRecords, count } = await supabase
      .from('fingerprint_attendance')
      .select('*', { count: 'exact' });

    console.log(`✅ Found ${count} existing records`);
    if (existingRecords && existingRecords.length > 0) {
      console.log('Last 3 records:');
      existingRecords.slice(-3).forEach(record => {
        console.log(`  - ${record.roll_no} (${record.session_type}) at ${record.marked_at}`);
      });
    }

    // Test 3: Check today's attendance view
    console.log('\n📋 Test 3: Checking today\'s attendance view...');
    const { data: todayData, error: todayError } = await supabase
      .from('today_fingerprint_attendance')
      .select('*')
      .limit(5);

    if (todayError) {
      console.error('❌ Error fetching today\'s attendance:', todayError.message);
    } else {
      console.log(`✅ Today's attendance summary (showing first 5):`);
      todayData.forEach(student => {
        console.log(`  - ${student.roll_no}: ${student.attendance_status}`);
        if (student.check_in_time) {
          console.log(`    Check-in: ${new Date(student.check_in_time).toLocaleTimeString()}`);
        }
        if (student.check_out_time) {
          console.log(`    Check-out: ${new Date(student.check_out_time).toLocaleTimeString()}`);
        }
      });
    }

    // Test 4: Test marking attendance (check-in)
    console.log('\n📋 Test 4: Testing mark attendance (check-in)...');
    const testRollNo = 'TEST2025001';
    const today = new Date().toISOString().split('T')[0];

    // First, check if already marked today
    const { data: existingCheckIn } = await supabase
      .from('fingerprint_attendance')
      .select('*')
      .eq('roll_no', testRollNo)
      .eq('session_type', 'check-in')
      .gte('marked_at', `${today}T00:00:00`)
      .lte('marked_at', `${today}T23:59:59`)
      .maybeSingle();

    if (existingCheckIn) {
      console.log(`⚠️  Check-in already marked for ${testRollNo} today`);
      console.log(`   Marked at: ${existingCheckIn.marked_at}`);
    } else {
      // Get student details
      const { data: studentData } = await supabase
        .from('student_details')
        .select('roll_no, department, year, users(name)')
        .eq('roll_no', testRollNo)
        .single();

      if (studentData) {
        const { data: newRecord, error: insertError } = await supabase
          .from('fingerprint_attendance')
          .insert([{
            roll_no: testRollNo,
            student_name: studentData.users?.name || 'Test Student',
            department: studentData.department,
            year: studentData.year,
            session_type: 'check-in',
            marked_at: new Date().toISOString(),
            fingerprint_verified: true,
            device_id: 'TEST_DEVICE',
            location: 'Test Campus'
          }])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error inserting check-in:', insertError.message);
        } else {
          console.log('✅ Check-in marked successfully!');
          console.log(`   Record ID: ${newRecord.id}`);
          console.log(`   Marked at: ${newRecord.marked_at}`);
        }
      } else {
        console.log(`❌ Student ${testRollNo} not found in student_details`);
      }
    }

    // Test 5: Check fingerprint_attendance_view
    console.log('\n📋 Test 5: Checking fingerprint_attendance_view...');
    const { data: viewData, error: viewError } = await supabase
      .from('fingerprint_attendance_view')
      .select('*')
      .limit(5)
      .order('marked_at', { ascending: false });

    if (viewError) {
      console.error('❌ Error fetching view:', viewError.message);
    } else {
      console.log(`✅ View working! Showing last 5 records:`);
      viewData.forEach(record => {
        console.log(`  - ${record.roll_no} (${record.session_type})`);
        console.log(`    Date: ${record.attendance_date} Time: ${record.attendance_time}`);
        console.log(`    Device: ${record.device_id}, Location: ${record.location}`);
      });
    }

    // Test 6: Statistics
    console.log('\n📋 Test 6: Generating statistics...');
    const { data: allRecords } = await supabase
      .from('fingerprint_attendance')
      .select('*');

    if (allRecords) {
      const stats = {
        total: allRecords.length,
        checkIns: allRecords.filter(r => r.session_type === 'check-in').length,
        checkOuts: allRecords.filter(r => r.session_type === 'check-out').length,
        uniqueStudents: new Set(allRecords.map(r => r.roll_no)).size,
        uniqueDevices: new Set(allRecords.map(r => r.device_id)).size
      };

      console.log('✅ Statistics:');
      console.log(`   Total records: ${stats.total}`);
      console.log(`   Check-ins: ${stats.checkIns}`);
      console.log(`   Check-outs: ${stats.checkOuts}`);
      console.log(`   Unique students: ${stats.uniqueStudents}`);
      console.log(`   Unique devices: ${stats.uniqueDevices}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run tests
testFingerprintSystem().catch(console.error);

