# 🚀 Quick Start Guide - Fingerprint Attendance System

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account with project setup
- Database credentials in `.env` file

## 1️⃣ Setup Database

### Create the fingerprint_attendance table in Supabase:

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy the entire contents of `database/fingerprint_attendance.sql`
3. Paste and run in SQL Editor

**OR** run this SQL manually:

```sql
-- Create fingerprint_attendance table
CREATE TABLE IF NOT EXISTS fingerprint_attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('check-in', 'check-out')),
    marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fingerprint_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fingerprint_student_id ON fingerprint_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_fingerprint_marked_at ON fingerprint_attendance(marked_at);
CREATE INDEX IF NOT EXISTS idx_fingerprint_session_type ON fingerprint_attendance(session_type);
CREATE INDEX IF NOT EXISTS idx_fingerprint_student_date ON fingerprint_attendance(student_id, marked_at DESC);

-- Enable RLS
ALTER TABLE fingerprint_attendance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read fingerprint_attendance"
    ON fingerprint_attendance FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert fingerprint_attendance"
    ON fingerprint_attendance FOR INSERT
    TO authenticated
    WITH CHECK (true);
```

## 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Start the server
node server.js
```

The backend should now be running on `http://localhost:5000`

## 3️⃣ Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend should now be running on `http://localhost:5173` (or the port shown in terminal)

## 4️⃣ See Dummy Data (Optional but Recommended)

The `fingerprint_attendance.sql` file automatically inserts sample data when you run it!

**What you'll see immediately:**
- **Today's Records**: 5 sample students (SAMPLE001-SAMPLE005)
  - 3 students with only check-in
  - 2 students with both check-in and check-out
- **Yesterday's Records**: 3 students for history view

**Admin Panel** will show:
- Total Records: 7
- Unique Students: 5
- Check-ins: 5
- Check-outs: 2

**To add MORE dummy data or use YOUR student roll numbers:**
```bash
# Go to database folder
cd database

# Edit insert_dummy_attendance.sql
# Replace SAMPLE001, SAMPLE002, etc. with your actual roll numbers
# OR just run as-is for more sample data

# Then run in Supabase SQL Editor
```

## 5️⃣ Test the System

### As Admin:
1. Login with admin credentials
2. Go to "Fingerprint History" (replaces old "Sessions")
3. **You should immediately see 5-7 sample records for today!** 📊
4. Check the statistics cards at the top
5. Try the refresh button

### As Student:
1. Login with student credentials
2. Go to "Attendance Status" (replaces old "Scan QR")
3. Click "Mark Check-in" button
4. Your attendance should be recorded!
5. Check "Previous Attendance" section to see history
6. Go back to admin panel and refresh - you should see your new record

**Note:** The sample data uses student IDs like SAMPLE001, SAMPLE002, etc. These will show as "Unknown Student" unless you add them to your student_details table. For testing with real students, use `insert_dummy_attendance.sql` and replace with actual roll numbers.

## ✅ Verification Checklist

- [ ] Database table created successfully
- [ ] Sample dummy data inserted (5 students, 7 records today)
- [ ] Backend server running without errors
- [ ] Frontend running without errors
- [ ] Can login as admin
- [ ] Can see "Fingerprint History" in admin panel
- [ ] **Can see dummy attendance records in admin panel** 📊
- [ ] Statistics show: 7 records, 5 unique students, 5 check-ins, 2 check-outs
- [ ] Can login as student
- [ ] Can see "Attendance Status" in student panel
- [ ] Can mark check-in as student
- [ ] Check-in appears in admin's Fingerprint History
- [ ] Can mark check-out as student (after check-in)
- [ ] Previous attendance records visible in student panel

## 🔧 Configuration

### Backend Environment Variables

Create/update `.env` in Backend folder:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Frontend Environment Variables

Create/update `.env` in Frontend folder:

```env
VITE_API_URL=http://localhost:5000
```

## 📱 Usage

### Admin Panel
- **Dashboard**: View analytics
- **Attendance**: View attendance reports
- **Students**: Manage students
- **Fingerprint History**: 📍 **NEW!** View today's attendance records
- **Leave Management**: Handle leave requests

### Student Panel
- **Dashboard**: View analytics
- **Attendance Status**: 📍 **NEW!** Mark attendance and view status
- **History**: View attendance history
- **Leave**: Apply for leave
- **Alerts**: View notifications

## 🐛 Common Issues

### Backend won't start
- Check if port 5000 is available
- Verify Supabase credentials in `.env`
- Run `npm install` again

### Frontend won't start
- Check if port 5173 is available
- Verify API URL in `.env`
- Clear node_modules and run `npm install` again

### Can't mark attendance
- Verify you're logged in
- Check browser console for errors
- Verify backend is running
- Check student_id is set correctly

### Records not showing
- Verify database table exists
- Check backend logs for errors
- Try manual refresh in UI
- Check browser console for API errors

## 🎉 Success!

If everything works, you should be able to:
- ✅ Mark attendance as a student
- ✅ View attendance records as admin
- ✅ See statistics and history
- ✅ Track check-in and check-out times

## 📚 Next Steps

- Read the full [FINGERPRINT_MIGRATION_GUIDE.md](./FINGERPRINT_MIGRATION_GUIDE.md)
- Customize the UI colors and branding
- Add more features (reports, exports, etc.)
- Integrate with actual fingerprint hardware (optional)

---

Need help? Check the troubleshooting section in FINGERPRINT_MIGRATION_GUIDE.md

