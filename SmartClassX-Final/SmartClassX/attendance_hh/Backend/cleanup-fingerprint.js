/**
 * Cleanup Utility for Fingerprint Attendance
 * Provides various cleanup and maintenance operations
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function deleteOldRecords(daysOld) {
  console.log(`\n🗑️  Deleting records older than ${daysOld} days...`);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  const cutoffISO = cutoffDate.toISOString();

  const { data, error } = await supabase
    .from('fingerprint_attendance')
    .delete()
    .lt('marked_at', cutoffISO)
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Deleted ${data.length} records older than ${cutoffDate.toLocaleDateString()}`);
}

async function deleteTestRecords() {
  console.log('\n🧪 Deleting test records (roll numbers starting with TEST)...');

  const { data, error } = await supabase
    .from('fingerprint_attendance')
    .delete()
    .like('roll_no', 'TEST%')
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Deleted ${data.length} test records`);
}

async function deleteByRollNo(rollNo) {
  console.log(`\n🗑️  Deleting all records for roll number: ${rollNo}...`);

  const { data, error } = await supabase
    .from('fingerprint_attendance')
    .delete()
    .eq('roll_no', rollNo)
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Deleted ${data.length} records for ${rollNo}`);
}

async function deleteByDate(date) {
  console.log(`\n📅 Deleting all records for date: ${date}...`);

  const { data, error } = await supabase
    .from('fingerprint_attendance')
    .delete()
    .gte('marked_at', `${date}T00:00:00`)
    .lte('marked_at', `${date}T23:59:59`)
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Deleted ${data.length} records for ${date}`);
}

async function deleteAllRecords() {
  console.log('\n⚠️  WARNING: This will delete ALL fingerprint attendance records!');
  console.log('This action cannot be undone.');
  
  // Add a small delay to allow user to cancel
  console.log('Proceeding in 5 seconds... (Press Ctrl+C to cancel)');
  await new Promise(resolve => setTimeout(resolve, 5000));

  const { data, error } = await supabase
    .from('fingerprint_attendance')
    .delete()
    .neq('id', 0) // Delete all (id is never 0)
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Deleted ${data.length} records (ALL records)`);
}

async function fixDuplicates() {
  console.log('\n🔍 Checking for duplicate records (same roll_no, session_type, and date)...');

  const { data, error } = await supabase
    .from('fingerprint_attendance')
    .select('*')
    .order('marked_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  const seen = new Set();
  const duplicates = [];

  data.forEach(record => {
    const date = new Date(record.marked_at).toISOString().split('T')[0];
    const key = `${record.roll_no}-${record.session_type}-${date}`;
    
    if (seen.has(key)) {
      duplicates.push(record);
    } else {
      seen.add(key);
    }
  });

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found');
    return;
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate records`);
  console.log('Keeping the most recent record for each duplicate set...');

  for (const dup of duplicates) {
    const { error: deleteError } = await supabase
      .from('fingerprint_attendance')
      .delete()
      .eq('id', dup.id);

    if (deleteError) {
      console.error(`❌ Error deleting duplicate ${dup.id}:`, deleteError.message);
    }
  }

  console.log(`✅ Removed ${duplicates.length} duplicate records`);
}

async function showStats() {
  console.log('\n📊 Database Statistics:');
  console.log('='.repeat(60));

  const { data, error } = await supabase
    .from('fingerprint_attendance')
    .select('*');

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`Total Records: ${data.length}`);
  console.log(`Check-ins: ${data.filter(r => r.session_type === 'check-in').length}`);
  console.log(`Check-outs: ${data.filter(r => r.session_type === 'check-out').length}`);
  console.log(`Unique Students: ${new Set(data.map(r => r.roll_no)).size}`);
  console.log(`Unique Devices: ${new Set(data.map(r => r.device_id)).size}`);

  if (data.length > 0) {
    const dates = data.map(r => new Date(r.marked_at));
    const oldest = new Date(Math.min(...dates));
    const newest = new Date(Math.max(...dates));
    console.log(`Date Range: ${oldest.toLocaleDateString()} to ${newest.toLocaleDateString()}`);
  }

  console.log('='.repeat(60));
}

async function vacuumDatabase() {
  console.log('\n🧹 Running database maintenance...');
  console.log('Note: Supabase handles most maintenance automatically.');
  console.log('This will just show current stats and check for issues.');

  await showStats();
  await fixDuplicates();

  console.log('\n✅ Maintenance complete');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('\n🧰 Fingerprint Attendance Cleanup Utility');

  try {
    switch (command) {
      case 'old':
        const days = parseInt(args[1]) || 30;
        await deleteOldRecords(days);
        break;

      case 'test':
        await deleteTestRecords();
        break;

      case 'student':
        if (!args[1]) {
          console.log('❌ Please provide a roll number');
          return;
        }
        await deleteByRollNo(args[1]);
        break;

      case 'date':
        if (!args[1]) {
          console.log('❌ Please provide a date (YYYY-MM-DD)');
          return;
        }
        await deleteByDate(args[1]);
        break;

      case 'all':
        await deleteAllRecords();
        break;

      case 'duplicates':
        await fixDuplicates();
        break;

      case 'stats':
        await showStats();
        break;

      case 'vacuum':
        await vacuumDatabase();
        break;

      default:
        console.log('\n📖 Usage:');
        console.log('  node cleanup-fingerprint.js <command> [options]');
        console.log('\nCommands:');
        console.log('  old [days]          - Delete records older than N days (default: 30)');
        console.log('  test                - Delete all test records (roll numbers starting with TEST)');
        console.log('  student <roll_no>   - Delete all records for a specific student');
        console.log('  date <YYYY-MM-DD>   - Delete all records for a specific date');
        console.log('  all                 - Delete ALL records (use with caution!)');
        console.log('  duplicates          - Find and remove duplicate records');
        console.log('  stats               - Show database statistics');
        console.log('  vacuum              - Run maintenance and cleanup');
        console.log('\n📝 Examples:');
        console.log('  node cleanup-fingerprint.js old 90');
        console.log('  node cleanup-fingerprint.js test');
        console.log('  node cleanup-fingerprint.js student TEST2025001');
        console.log('  node cleanup-fingerprint.js date 2024-10-29');
        console.log('  node cleanup-fingerprint.js duplicates');
        console.log('  node cleanup-fingerprint.js stats');
        console.log('  node cleanup-fingerprint.js vacuum\n');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

main().catch(console.error);

