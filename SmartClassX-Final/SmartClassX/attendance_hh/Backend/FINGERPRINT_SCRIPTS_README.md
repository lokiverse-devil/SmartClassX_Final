# Fingerprint Attendance Backend Scripts

This directory contains utility scripts for managing and testing the fingerprint attendance system.

## 📁 Available Scripts

### 1. **test-fingerprint.js** - System Testing
Comprehensive test suite for the fingerprint attendance system.

**Usage:**
```bash
node test-fingerprint.js
```

**What it does:**
- ✅ Verifies table and view existence
- ✅ Checks existing records
- ✅ Tests today's attendance view
- ✅ Attempts to mark test attendance
- ✅ Verifies fingerprint_attendance_view
- ✅ Generates statistics

**When to use:** After initial setup or when troubleshooting issues

---

### 2. **view-fingerprint-attendance.js** - View Records
Display fingerprint attendance records in a formatted, human-readable way.

**Usage:**
```bash
# View today's attendance summary
node view-fingerprint-attendance.js today

# View all records (default: last 50)
node view-fingerprint-attendance.js all

# View all records with custom limit
node view-fingerprint-attendance.js all 100

# View specific student's history
node view-fingerprint-attendance.js student TEST2025001

# View statistics
node view-fingerprint-attendance.js stats
```

**Examples:**
```bash
# Today's attendance with status for each student
node view-fingerprint-attendance.js today

# Last 200 attendance records
node view-fingerprint-attendance.js all 200

# Complete history for a student
node view-fingerprint-attendance.js student 2025CS001

# Overall statistics and breakdowns
node view-fingerprint-attendance.js stats
```

**When to use:** To quickly check attendance without using the API or frontend

---

### 3. **mark-fingerprint.js** - Manual Attendance Marking
Manually mark check-in or check-out for testing or manual entry.

**Usage:**
```bash
node mark-fingerprint.js <roll_no> <check-in|check-out> [device_id] [location]
```

**Examples:**
```bash
# Simple check-in
node mark-fingerprint.js TEST2025001 check-in

# Check-out
node mark-fingerprint.js TEST2025001 check-out

# With device and location
node mark-fingerprint.js TEST2025001 check-in DEVICE_001 "Main Campus"

# Another example
node mark-fingerprint.js 2025CS001 check-in DEVICE_002 "Building A Entrance"
```

**Features:**
- ✅ Validates student exists
- ✅ Prevents duplicate entries for same session/day
- ✅ Shows student details before marking
- ✅ Displays today's status after marking
- ✅ Full error handling and validation

**When to use:** 
- Testing the system
- Manual attendance entry
- Fixing missed scans
- Development and debugging

---

### 4. **cleanup-fingerprint.js** - Database Maintenance
Cleanup and maintenance utility for the fingerprint attendance database.

**Usage:**
```bash
node cleanup-fingerprint.js <command> [options]
```

**Commands:**

#### Delete old records
```bash
# Delete records older than 30 days (default)
node cleanup-fingerprint.js old

# Delete records older than 90 days
node cleanup-fingerprint.js old 90

# Delete records older than 1 year
node cleanup-fingerprint.js old 365
```

#### Delete test records
```bash
# Remove all records with roll numbers starting with "TEST"
node cleanup-fingerprint.js test
```

#### Delete by student
```bash
# Remove all records for a specific student
node cleanup-fingerprint.js student TEST2025001
node cleanup-fingerprint.js student 2025CS001
```

#### Delete by date
```bash
# Remove all records for a specific date
node cleanup-fingerprint.js date 2024-10-29
node cleanup-fingerprint.js date 2024-01-15
```

#### Remove duplicates
```bash
# Find and remove duplicate entries
node cleanup-fingerprint.js duplicates
```

#### View statistics
```bash
# Show database statistics
node cleanup-fingerprint.js stats
```

#### Full maintenance
```bash
# Run complete maintenance (stats + duplicate check)
node cleanup-fingerprint.js vacuum
```

#### ⚠️ Delete ALL records (DANGEROUS!)
```bash
# Delete everything (gives 5-second warning)
node cleanup-fingerprint.js all
```

**When to use:**
- Regular database maintenance
- Removing test data
- Fixing duplicate entries
- Archiving old records
- Troubleshooting data issues

---

## 🔗 API Integration

All these scripts work with the API routes defined in `routes/fingerprintRoutes.js`.

The API endpoints are available at: `http://localhost:5000/api/fingerprint/*`

See `FINGERPRINT_SETUP.md` in the root directory for full API documentation.

---

## 🚀 Quick Start Workflow

### Initial Setup
```bash
# 1. Run SQL script in Supabase (from database/fingerprint_attendance.sql)
# 2. Test the system
node test-fingerprint.js

# 3. View initial data
node view-fingerprint-attendance.js today
```

### Daily Testing
```bash
# Mark check-in for a student
node mark-fingerprint.js TEST2025001 check-in

# View today's attendance
node view-fingerprint-attendance.js today

# Mark check-out
node mark-fingerprint.js TEST2025001 check-out

# View updated status
node view-fingerprint-attendance.js today
```

### Weekly Maintenance
```bash
# Check statistics
node cleanup-fingerprint.js stats

# Remove test data
node cleanup-fingerprint.js test

# Check for duplicates
node cleanup-fingerprint.js duplicates
```

### Monthly Cleanup
```bash
# Full maintenance check
node cleanup-fingerprint.js vacuum

# Archive/delete old records (optional)
node cleanup-fingerprint.js old 90
```

---

## 📊 Output Examples

### Today's Attendance
```
📅 TODAY'S FINGERPRINT ATTENDANCE
====================================================================================================

Total Students: 100
Present (Full Day): 75 | Present (Half Day): 15 | Absent: 10

----------------------------------------------------------------------------------------------------
1. TEST2025001 - Test Student One
   Department: Computer Science | Year: 1st year
   Status: Present (Full Day)
   ✅ Check-in:  09:00:15 AM
   ✅ Check-out: 05:30:22 PM
----------------------------------------------------------------------------------------------------
```

### Statistics
```
📈 FINGERPRINT ATTENDANCE STATISTICS
====================================================================================================

📊 Overall Statistics:
   Total Records: 3000
   Total Check-ins: 1500
   Total Check-outs: 1500
   Unique Students: 100

🏢 By Department:
   Computer Science: 1000 records
   Electronics: 800 records
   Mechanical: 600 records

📚 By Year:
   1st year: 900 records
   2nd year: 1100 records
   3rd year: 1000 records
```

---

## 🔧 Environment Setup

All scripts require a `.env` file in the Backend directory with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_ANON_KEY=your_anon_key
PORT=5000
```

---

## ⚙️ Troubleshooting

### Script won't run
```bash
# Make sure you're in the Backend directory
cd Backend

# Check if .env file exists and has correct values
cat .env

# Install dependencies if needed
npm install
```

### "Table does not exist" error
```bash
# Run the SQL script in Supabase first
# File: database/fingerprint_attendance.sql
```

### "Student not found" error
```bash
# The student must exist in student_details table
# Check with:
node view-fingerprint-attendance.js stats
```

### Permission errors
```bash
# Ensure you're using SUPABASE_SERVICE_KEY (not ANON_KEY)
# Service key has full database access
```

---

## 📝 Best Practices

1. **Test with TEST roll numbers first** before using real student data
2. **Run stats regularly** to monitor database health
3. **Clean up test data** before production deployment
4. **Backup data** before running cleanup commands
5. **Use specific commands** rather than 'all' for deletions
6. **Monitor duplicates** weekly to prevent data issues
7. **Archive old records** monthly to maintain performance

---

## 🔐 Security Notes

- These scripts use `SUPABASE_SERVICE_KEY` which has full database access
- Never commit `.env` file to version control
- Use these scripts only in development/admin context
- For production, use proper API authentication
- Regular users should NOT have direct script access

---

## 📞 Support

For issues or questions:
1. Check the main `FINGERPRINT_SETUP.md` documentation
2. Run `node test-fingerprint.js` to diagnose issues
3. Check Supabase logs for database errors
4. Review the API routes in `routes/fingerprintRoutes.js`

---

**Happy Managing! 🎯**

