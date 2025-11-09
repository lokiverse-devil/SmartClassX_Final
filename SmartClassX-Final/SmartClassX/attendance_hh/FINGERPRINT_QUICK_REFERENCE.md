# Fingerprint Attendance - Quick Reference

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run SQL Script
```sql
-- Copy and paste this file in Supabase SQL Editor
database/fingerprint_attendance.sql
```

### Step 2: Test the System
```bash
cd Backend
node test-fingerprint.js
```

### Step 3: Start Using!
```bash
# View today's attendance
node view-fingerprint-attendance.js today

# Mark attendance
node mark-fingerprint.js TEST2025001 check-in
```

---

## 📂 Files Created

### Database
- `database/fingerprint_attendance.sql` - Complete schema, views, and test data

### Backend Routes
- `Backend/routes/fingerprintRoutes.js` - All API endpoints
- `Backend/server.js` - Updated with fingerprint routes

### Utility Scripts
- `Backend/test-fingerprint.js` - Test the system
- `Backend/view-fingerprint-attendance.js` - View records
- `Backend/mark-fingerprint.js` - Manual attendance marking
- `Backend/cleanup-fingerprint.js` - Database maintenance

### Documentation
- `FINGERPRINT_SETUP.md` - Complete setup and API documentation
- `Backend/FINGERPRINT_SCRIPTS_README.md` - Script usage guide
- `FINGERPRINT_QUICK_REFERENCE.md` - This file

---

## 🌐 API Endpoints Cheat Sheet

Base URL: `http://localhost:5000/api/fingerprint`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/mark-attendance` | Mark check-in or check-out |
| GET | `/today` | Today's attendance summary |
| GET | `/history/:roll_no` | Student attendance history |
| GET | `/all` | All attendance records |
| GET | `/student-status/:roll_no` | Current day status |
| GET | `/stats` | Overall statistics |
| DELETE | `/record/:id` | Delete specific record |

---

## 💻 Common Commands

### Viewing Attendance
```bash
# Today's summary
node view-fingerprint-attendance.js today

# All records (last 50)
node view-fingerprint-attendance.js all

# Last 200 records
node view-fingerprint-attendance.js all 200

# Specific student
node view-fingerprint-attendance.js student TEST2025001

# Statistics
node view-fingerprint-attendance.js stats
```

### Marking Attendance
```bash
# Check-in
node mark-fingerprint.js <roll_no> check-in

# Check-out
node mark-fingerprint.js <roll_no> check-out

# With device and location
node mark-fingerprint.js <roll_no> check-in DEVICE_001 "Main Campus"
```

### Maintenance
```bash
# Show stats
node cleanup-fingerprint.js stats

# Remove test data
node cleanup-fingerprint.js test

# Remove duplicates
node cleanup-fingerprint.js duplicates

# Delete old records (90+ days)
node cleanup-fingerprint.js old 90

# Full maintenance
node cleanup-fingerprint.js vacuum
```

---

## 📋 Database Tables & Views

### Tables
- `fingerprint_attendance` - Main attendance records

### Views
- `fingerprint_attendance_view` - Records with formatted date/time
- `today_fingerprint_attendance` - Today's summary with status

---

## 🔍 Quick Testing Scenarios

### Scenario 1: Single Student Full Day
```bash
# Morning check-in
node mark-fingerprint.js TEST2025001 check-in

# View status (should show "Half Day")
node view-fingerprint-attendance.js today

# Evening check-out
node mark-fingerprint.js TEST2025001 check-out

# View status (should show "Full Day")
node view-fingerprint-attendance.js today
```

### Scenario 2: Multiple Students
```bash
# Check-in 3 students
node mark-fingerprint.js TEST2025001 check-in
node mark-fingerprint.js TEST2025002 check-in
node mark-fingerprint.js TEST2025003 check-in

# View today's attendance
node view-fingerprint-attendance.js today

# Check-out 2 students
node mark-fingerprint.js TEST2025001 check-out
node mark-fingerprint.js TEST2025002 check-out

# View updated status
node view-fingerprint-attendance.js today
```

### Scenario 3: Historical Data
```bash
# View all attendance for a student
node view-fingerprint-attendance.js student TEST2025001

# View overall statistics
node cleanup-fingerprint.js stats
```

---

## 🔧 API Usage Examples

### Mark Attendance
```bash
curl -X POST http://localhost:5000/api/fingerprint/mark-attendance \
  -H "Content-Type: application/json" \
  -d '{
    "roll_no": "TEST2025001",
    "session_type": "check-in",
    "device_id": "DEVICE_001",
    "location": "Main Campus"
  }'
```

### Get Today's Attendance
```bash
curl http://localhost:5000/api/fingerprint/today
```

### Get Student History
```bash
curl http://localhost:5000/api/fingerprint/history/TEST2025001?limit=30
```

### Get Statistics
```bash
curl http://localhost:5000/api/fingerprint/stats
```

---

## 📊 Attendance Status Logic

| Check-in | Check-out | Status |
|----------|-----------|--------|
| ✅ Yes | ✅ Yes | Present (Full Day) |
| ✅ Yes | ❌ No | Present (Half Day) |
| ❌ No | ❌ No | Absent |

---

## ⚠️ Important Notes

1. **Duplicate Prevention**: Students can only check-in/check-out once per day per session
2. **Student Must Exist**: Roll number must exist in `student_details` table
3. **Timezone**: All timestamps stored in UTC (TIMESTAMPTZ)
4. **Cascade Delete**: Deleting a student deletes their attendance records
5. **Test Data**: Roll numbers starting with "TEST" are for testing only

---

## 🎯 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Table doesn't exist | Run `database/fingerprint_attendance.sql` in Supabase |
| Student not found | Add student to `student_details` table first |
| Already marked today | This is expected - duplicate prevention working |
| Permission denied | Use `SUPABASE_SERVICE_KEY` in `.env` |
| Script won't run | Check you're in `Backend` directory and `.env` exists |

---

## 📞 Where to Find More Info

- **Complete Setup**: See `FINGERPRINT_SETUP.md`
- **Script Details**: See `Backend/FINGERPRINT_SCRIPTS_README.md`
- **API Documentation**: See `FINGERPRINT_SETUP.md` (API section)
- **Database Schema**: See `database/fingerprint_attendance.sql`

---

## 🔗 Related Files

```
Student-working-xxx/
├── database/
│   └── fingerprint_attendance.sql          ← Run this in Supabase
├── Backend/
│   ├── routes/
│   │   └── fingerprintRoutes.js           ← API routes
│   ├── test-fingerprint.js                ← Test system
│   ├── view-fingerprint-attendance.js     ← View records
│   ├── mark-fingerprint.js                ← Mark attendance
│   ├── cleanup-fingerprint.js             ← Maintenance
│   ├── server.js                          ← Updated with routes
│   └── FINGERPRINT_SCRIPTS_README.md      ← Script docs
├── FINGERPRINT_SETUP.md                   ← Full documentation
└── FINGERPRINT_QUICK_REFERENCE.md         ← This file
```

---

**Need Help?** Run `node test-fingerprint.js` to diagnose issues!

**Ready to Start?** Follow the 5-minute setup at the top of this file! 🚀

