# Fingerprint Attendance System Setup Guide

This guide will help you set up and use the fingerprint-based attendance tracking system.

## 📋 Table of Contents
1. [Database Setup](#database-setup)
2. [Backend Integration](#backend-integration)
3. [API Endpoints](#api-endpoints)
4. [Testing](#testing)
5. [Usage Examples](#usage-examples)

---

## 🗄️ Database Setup

### Step 1: Run the SQL Script

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database/fingerprint_attendance.sql`
4. Click "Run" to execute the script

This will create:
- `fingerprint_attendance` table
- `fingerprint_attendance_view` view (with formatted date/time)
- `today_fingerprint_attendance` view (daily summary)
- Test data for 3 students
- All necessary indexes

### Database Schema

**fingerprint_attendance table:**
```sql
- id: BIGSERIAL (Primary Key)
- roll_no: VARCHAR(50) (Foreign Key to student_details)
- student_name: VARCHAR(100)
- department: VARCHAR(100)
- year: VARCHAR(20)
- session_type: VARCHAR(20) (check-in or check-out)
- marked_at: TIMESTAMPTZ
- fingerprint_verified: BOOLEAN
- device_id: VARCHAR(50)
- location: VARCHAR(100)
- created_at: TIMESTAMPTZ
```

---

## 🔧 Backend Integration

The fingerprint attendance routes are already integrated into your backend server!

### Files Added:
1. **`database/fingerprint_attendance.sql`** - Database schema
2. **`Backend/routes/fingerprintRoutes.js`** - API routes
3. **`Backend/test-fingerprint.js`** - Testing script
4. **`Backend/view-fingerprint-attendance.js`** - Viewing utility
5. **`Backend/server.js`** - Updated with fingerprint routes

The routes are available at: `http://localhost:5000/api/fingerprint/*`

---

## 🌐 API Endpoints

### 1. Mark Attendance (Check-in/Check-out)

**POST** `/api/fingerprint/mark-attendance`

Mark a student's fingerprint attendance.

**Request Body:**
```json
{
  "roll_no": "TEST2025001",
  "session_type": "check-in",
  "device_id": "DEVICE_001",
  "location": "Main Campus"
}
```

**Response:**
```json
{
  "success": true,
  "message": "check-in marked successfully",
  "data": {
    "id": 1,
    "roll_no": "TEST2025001",
    "student_name": "Test Student One",
    "session_type": "check-in",
    "marked_at": "2024-10-29T09:00:00Z",
    ...
  }
}
```

---

### 2. Get Today's Attendance Summary

**GET** `/api/fingerprint/today`

Get a summary of all students' attendance for today.

**Response:**
```json
{
  "success": true,
  "date": "2024-10-29",
  "total_students": 100,
  "present_full": 75,
  "present_half": 15,
  "absent": 10,
  "data": [
    {
      "roll_no": "TEST2025001",
      "student_name": "Test Student One",
      "department": "Computer Science",
      "year": "1st year",
      "check_in_time": "2024-10-29T09:00:00Z",
      "check_out_time": "2024-10-29T17:00:00Z",
      "attendance_status": "Present (Full Day)"
    }
  ]
}
```

---

### 3. Get Student Attendance History

**GET** `/api/fingerprint/history/:roll_no`

Get attendance history for a specific student.

**Query Parameters:**
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)
- `limit` (optional): Limit number of records

**Example:** `/api/fingerprint/history/TEST2025001?limit=30`

**Response:**
```json
{
  "success": true,
  "roll_no": "TEST2025001",
  "total_records": 45,
  "data": [...]
}
```

---

### 4. Get All Attendance Records

**GET** `/api/fingerprint/all`

Get all fingerprint attendance records with filtering options.

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `department` (optional): Filter by department
- `year` (optional): Filter by year
- `session_type` (optional): Filter by check-in or check-out
- `limit` (optional): Limit records (default: 50)
- `offset` (optional): Pagination offset

**Example:** `/api/fingerprint/all?department=Computer Science&limit=100`

**Response:**
```json
{
  "success": true,
  "total_records": 1500,
  "returned_records": 100,
  "data": [...]
}
```

---

### 5. Get Student Status for Today

**GET** `/api/fingerprint/student-status/:roll_no`

Get current day attendance status for a specific student.

**Response:**
```json
{
  "success": true,
  "roll_no": "TEST2025001",
  "data": {
    "roll_no": "TEST2025001",
    "student_name": "Test Student One",
    "attendance_status": "Present (Full Day)",
    "check_in_time": "2024-10-29T09:00:00Z",
    "check_out_time": "2024-10-29T17:00:00Z"
  }
}
```

---

### 6. Get Statistics

**GET** `/api/fingerprint/stats`

Get overall attendance statistics.

**Query Parameters:**
- `start_date` (optional): From date
- `end_date` (optional): To date

**Response:**
```json
{
  "success": true,
  "date_range": {
    "start": "2024-10-01",
    "end": "2024-10-29"
  },
  "stats": {
    "total_records": 3000,
    "check_ins": 1500,
    "check_outs": 1500,
    "unique_students": 100,
    "by_department": {
      "Computer Science": 1000,
      "Electronics": 800
    },
    "by_year": {...},
    "by_device": {...}
  }
}
```

---

### 7. Delete Attendance Record

**DELETE** `/api/fingerprint/record/:id`

Delete a specific attendance record (admin only).

**Response:**
```json
{
  "success": true,
  "message": "Record deleted successfully",
  "deleted_record": {...}
}
```

---

## 🧪 Testing

### Run the Test Script

```bash
cd Backend
node test-fingerprint.js
```

This will:
- ✅ Check if the table exists
- ✅ Verify existing records
- ✅ Test today's attendance view
- ✅ Test marking attendance
- ✅ Verify fingerprint_attendance_view
- ✅ Generate statistics

---

## 📊 Viewing Attendance

### Use the Viewing Utility

```bash
cd Backend

# View today's attendance
node view-fingerprint-attendance.js today

# View all records (default limit: 50)
node view-fingerprint-attendance.js all

# View all records with custom limit
node view-fingerprint-attendance.js all 100

# View specific student history
node view-fingerprint-attendance.js student TEST2025001

# View statistics
node view-fingerprint-attendance.js stats
```

---

## 💡 Usage Examples

### Example 1: Mark Check-in

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

### Example 2: Mark Check-out

```bash
curl -X POST http://localhost:5000/api/fingerprint/mark-attendance \
  -H "Content-Type: application/json" \
  -d '{
    "roll_no": "TEST2025001",
    "session_type": "check-out",
    "device_id": "DEVICE_001",
    "location": "Main Campus"
  }'
```

### Example 3: Get Today's Summary

```bash
curl http://localhost:5000/api/fingerprint/today
```

### Example 4: Get Student History

```bash
curl http://localhost:5000/api/fingerprint/history/TEST2025001?limit=30
```

---

## 🔐 Attendance Status Logic

The system automatically determines attendance status:

- **Present (Full Day)**: Both check-in AND check-out recorded
- **Present (Half Day)**: Only check-in recorded
- **Absent**: No check-in recorded

---

## 📝 Notes

1. **Duplicate Prevention**: The system prevents duplicate check-ins/check-outs on the same day
2. **Timezone**: All timestamps are stored in UTC (TIMESTAMPTZ)
3. **Student Verification**: The system verifies the student exists in `student_details` before marking attendance
4. **Cascading Deletes**: If a student is deleted, their fingerprint attendance records are also deleted
5. **Device Tracking**: Each attendance record tracks which device and location was used

---

## 🚀 Next Steps

1. Run the SQL script in Supabase
2. Test the endpoints using the test script or curl commands
3. Integrate the frontend with these API endpoints
4. Set up fingerprint device integration (if using physical devices)
5. Configure proper authentication/authorization for API endpoints

---

## 🛠️ Troubleshooting

### Issue: "Table does not exist"
**Solution:** Run the `database/fingerprint_attendance.sql` script in Supabase

### Issue: "Student not found"
**Solution:** Ensure the student exists in the `student_details` table with the correct roll_no

### Issue: "Already marked for today"
**Solution:** This is expected behavior - students can only check-in/check-out once per day

### Issue: Foreign key constraint error
**Solution:** Make sure the roll_no exists in the `student_details` table first

---

## 📞 Support

For issues or questions about the fingerprint attendance system, please refer to the main project documentation or contact the development team.

---

**Happy Tracking! 👍**

