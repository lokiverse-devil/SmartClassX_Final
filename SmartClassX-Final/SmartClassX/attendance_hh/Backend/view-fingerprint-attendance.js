/**
 * View Fingerprint Attendance Script
 * This script displays fingerprint attendance records in a formatted way
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
}

async function viewTodayAttendance() {
  console.log('\n📅 TODAY\'S FINGERPRINT ATTENDANCE');
  console.log('='.repeat(100));

  const { data, error } = await supabase
    .from('today_fingerprint_attendance')
    .select('*')
    .order('roll_no', { ascending: true });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('📭 No attendance records found for today');
    return;
  }

  console.log(`\nTotal Students: ${data.length}`);
  
  const presentFull = data.filter(s => s.attendance_status === 'Present (Full Day)').length;
  const presentHalf = data.filter(s => s.attendance_status === 'Present (Half Day)').length;
  const absent = data.filter(s => s.attendance_status === 'Absent').length;
  
  console.log(`Present (Full Day): ${presentFull} | Present (Half Day): ${presentHalf} | Absent: ${absent}`);
  console.log('\n' + '-'.repeat(100));

  data.forEach((student, index) => {
    console.log(`${index + 1}. ${student.roll_no} - ${student.student_name}`);
    console.log(`   Department: ${student.department || 'N/A'} | Year: ${student.year || 'N/A'}`);
    console.log(`   Status: ${student.attendance_status}`);
    
    if (student.check_in_time) {
      console.log(`   ✅ Check-in:  ${formatTime(student.check_in_time)}`);
    }
    if (student.check_out_time) {
      console.log(`   ✅ Check-out: ${formatTime(student.check_out_time)}`);
    }
    console.log('-'.repeat(100));
  });
}

async function viewAllAttendance(limit = 50) {
  console.log('\n📊 ALL FINGERPRINT ATTENDANCE RECORDS');
  console.log('='.repeat(100));

  const { data, error, count } = await supabase
    .from('fingerprint_attendance_view')
    .select('*', { count: 'exact' })
    .order('marked_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('📭 No attendance records found');
    return;
  }

  console.log(`\nTotal Records in Database: ${count}`);
  console.log(`Showing: ${data.length} most recent records\n`);
  console.log('-'.repeat(100));

  data.forEach((record, index) => {
    console.log(`${index + 1}. [${record.id}] ${record.roll_no} - ${record.student_name}`);
    console.log(`   ${record.session_type.toUpperCase()} on ${record.attendance_date} at ${record.attendance_time}`);
    console.log(`   Department: ${record.department || 'N/A'} | Year: ${record.year || 'N/A'}`);
    console.log(`   Device: ${record.device_id} | Location: ${record.location}`);
    console.log(`   Verified: ${record.fingerprint_verified ? '✓' : '✗'}`);
    console.log('-'.repeat(100));
  });
}

async function viewStudentHistory(rollNo) {
  console.log(`\n👤 FINGERPRINT ATTENDANCE HISTORY FOR: ${rollNo}`);
  console.log('='.repeat(100));

  const { data, error } = await supabase
    .from('fingerprint_attendance_view')
    .select('*')
    .eq('roll_no', rollNo)
    .order('marked_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('📭 No attendance records found for this student');
    return;
  }

  console.log(`\nTotal Records: ${data.length}\n`);
  console.log('-'.repeat(100));

  // Group by date
  const groupedByDate = {};
  data.forEach(record => {
    if (!groupedByDate[record.attendance_date]) {
      groupedByDate[record.attendance_date] = [];
    }
    groupedByDate[record.attendance_date].push(record);
  });

  Object.keys(groupedByDate).sort().reverse().forEach((date, dateIndex) => {
    console.log(`\n📅 ${formatDate(date)}`);
    const records = groupedByDate[date];
    
    records.forEach((record, index) => {
      const icon = record.session_type === 'check-in' ? '➡️' : '⬅️';
      console.log(`   ${icon} ${record.session_type.toUpperCase()}: ${record.attendance_time}`);
      console.log(`      Device: ${record.device_id} | Location: ${record.location}`);
    });
  });
  console.log('\n' + '='.repeat(100));
}

async function viewStatistics() {
  console.log('\n📈 FINGERPRINT ATTENDANCE STATISTICS');
  console.log('='.repeat(100));

  const { data, error } = await supabase
    .from('fingerprint_attendance')
    .select('*');

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('📭 No attendance records found');
    return;
  }

  const stats = {
    total: data.length,
    checkIns: data.filter(r => r.session_type === 'check-in').length,
    checkOuts: data.filter(r => r.session_type === 'check-out').length,
    uniqueStudents: new Set(data.map(r => r.roll_no)).size,
    byDepartment: {},
    byYear: {},
    byDevice: {},
    byLocation: {}
  };

  data.forEach(record => {
    // By department
    if (record.department) {
      stats.byDepartment[record.department] = 
        (stats.byDepartment[record.department] || 0) + 1;
    }
    // By year
    if (record.year) {
      stats.byYear[record.year] = 
        (stats.byYear[record.year] || 0) + 1;
    }
    // By device
    if (record.device_id) {
      stats.byDevice[record.device_id] = 
        (stats.byDevice[record.device_id] || 0) + 1;
    }
    // By location
    if (record.location) {
      stats.byLocation[record.location] = 
        (stats.byLocation[record.location] || 0) + 1;
    }
  });

  console.log('\n📊 Overall Statistics:');
  console.log(`   Total Records: ${stats.total}`);
  console.log(`   Total Check-ins: ${stats.checkIns}`);
  console.log(`   Total Check-outs: ${stats.checkOuts}`);
  console.log(`   Unique Students: ${stats.uniqueStudents}`);

  console.log('\n🏢 By Department:');
  Object.entries(stats.byDepartment).sort((a, b) => b[1] - a[1]).forEach(([dept, count]) => {
    console.log(`   ${dept}: ${count} records`);
  });

  console.log('\n📚 By Year:');
  Object.entries(stats.byYear).sort().forEach(([year, count]) => {
    console.log(`   ${year}: ${count} records`);
  });

  console.log('\n📱 By Device:');
  Object.entries(stats.byDevice).sort((a, b) => b[1] - a[1]).forEach(([device, count]) => {
    console.log(`   ${device}: ${count} records`);
  });

  console.log('\n📍 By Location:');
  Object.entries(stats.byLocation).sort((a, b) => b[1] - a[1]).forEach(([location, count]) => {
    console.log(`   ${location}: ${count} records`);
  });

  console.log('\n' + '='.repeat(100));
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('\n🔍 Fingerprint Attendance Viewer');

  try {
    switch (command) {
      case 'today':
        await viewTodayAttendance();
        break;
      
      case 'all':
        const limit = args[1] ? parseInt(args[1]) : 50;
        await viewAllAttendance(limit);
        break;
      
      case 'student':
        if (!args[1]) {
          console.log('❌ Please provide a roll number');
          console.log('Usage: node view-fingerprint-attendance.js student <roll_no>');
          return;
        }
        await viewStudentHistory(args[1]);
        break;
      
      case 'stats':
        await viewStatistics();
        break;
      
      default:
        console.log('\n📖 Usage:');
        console.log('  node view-fingerprint-attendance.js today                 - View today\'s attendance');
        console.log('  node view-fingerprint-attendance.js all [limit]           - View all records (default limit: 50)');
        console.log('  node view-fingerprint-attendance.js student <roll_no>     - View specific student history');
        console.log('  node view-fingerprint-attendance.js stats                 - View statistics');
        console.log('\n📝 Examples:');
        console.log('  node view-fingerprint-attendance.js today');
        console.log('  node view-fingerprint-attendance.js all 100');
        console.log('  node view-fingerprint-attendance.js student TEST2025001');
        console.log('  node view-fingerprint-attendance.js stats\n');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

main().catch(console.error);

