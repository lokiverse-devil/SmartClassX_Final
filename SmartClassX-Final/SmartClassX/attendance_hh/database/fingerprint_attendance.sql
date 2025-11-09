-- Fingerprint Attendance System Schema
-- This file sets up tables, indexes, and views for fingerprint-based attendance tracking

-- 0) Ensure student_details table exists (it already exists in your schema); this is a no-op if present.

-- 1) Create table if not exists (no destructive changes)
CREATE TABLE IF NOT EXISTS public.fingerprint_attendance (
  id BIGSERIAL PRIMARY KEY,
  roll_no VARCHAR(50) NOT NULL,
  student_name VARCHAR(100),
  department VARCHAR(100),
  year VARCHAR(20),
  session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('check-in', 'check-out')),
  marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fingerprint_verified BOOLEAN DEFAULT true,
  device_id VARCHAR(50) DEFAULT 'MAIN_DEVICE',
  location VARCHAR(100) DEFAULT 'Main Campus',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_fingerprint_student FOREIGN KEY (roll_no)
    REFERENCES public.student_details(roll_no) ON DELETE CASCADE
);

-- 2) Indexes (safe to run repeatedly)
CREATE INDEX IF NOT EXISTS idx_fingerprint_roll_no ON public.fingerprint_attendance(roll_no);
CREATE INDEX IF NOT EXISTS idx_fingerprint_marked_at ON public.fingerprint_attendance(marked_at);
CREATE INDEX IF NOT EXISTS idx_fingerprint_session_type ON public.fingerprint_attendance(session_type);
CREATE INDEX IF NOT EXISTS idx_fingerprint_roll_date ON public.fingerprint_attendance(roll_no, marked_at DESC);

-- 3) Replace views safely by dropping and recreating them
DROP VIEW IF EXISTS public.today_fingerprint_attendance;
DROP VIEW IF EXISTS public.fingerprint_attendance_view;

CREATE VIEW public.fingerprint_attendance_view AS
SELECT 
  fa.id,
  fa.roll_no,
  fa.student_name,
  fa.department,
  fa.year,
  fa.session_type,
  fa.marked_at,
  fa.fingerprint_verified,
  fa.device_id,
  fa.location,
  fa.created_at,
  TO_CHAR(fa.marked_at, 'YYYY-MM-DD') AS attendance_date,
  TO_CHAR(fa.marked_at, 'HH24:MI:SS') AS attendance_time
FROM public.fingerprint_attendance fa
ORDER BY fa.marked_at DESC;

CREATE VIEW public.today_fingerprint_attendance AS
SELECT 
  sd.roll_no,
  u.name AS student_name,
  sd.department,
  sd.year,
  sd.phone,
  MAX(CASE WHEN fa.session_type = 'check-in' THEN fa.marked_at END) AS check_in_time,
  MAX(CASE WHEN fa.session_type = 'check-out' THEN fa.marked_at END) AS check_out_time,
  CASE 
    WHEN MAX(CASE WHEN fa.session_type = 'check-in' THEN fa.marked_at END) IS NOT NULL 
         AND MAX(CASE WHEN fa.session_type = 'check-out' THEN fa.marked_at END) IS NOT NULL 
    THEN 'Present (Full Day)'
    WHEN MAX(CASE WHEN fa.session_type = 'check-in' THEN fa.marked_at END) IS NOT NULL 
    THEN 'Present (Half Day)'
    ELSE 'Absent'
  END AS attendance_status
FROM public.student_details sd
JOIN public.users u ON sd.user_id = u.id
LEFT JOIN public.fingerprint_attendance fa ON sd.roll_no = fa.roll_no AND DATE(fa.marked_at) = CURRENT_DATE
GROUP BY sd.roll_no, u.name, sd.department, sd.year, sd.phone
ORDER BY sd.roll_no;

-- 4) Insert parent rows into student_details for the test roll numbers (only if they don't already exist).
-- We use INSERT ... ON CONFLICT DO NOTHING so this is safe to run multiple times.
INSERT INTO public.student_details (user_id, roll_no, department, year, created_at, phone)
VALUES
  ( (SELECT id FROM public.users WHERE email IS NOT NULL LIMIT 1), 'TEST2025001', 'Computer Science', '1st year', CURRENT_TIMESTAMP, '0000000001' ),
  ( (SELECT id FROM public.users WHERE email IS NOT NULL LIMIT 1 OFFSET 1), 'TEST2025002', 'Electronics', '2nd year', CURRENT_TIMESTAMP, '0000000002' ),
  ( (SELECT id FROM public.users WHERE email IS NOT NULL LIMIT 1 OFFSET 2), 'TEST2025003', 'Mechanical', '3rd year', CURRENT_TIMESTAMP, '0000000003' )
ON CONFLICT (roll_no) DO NOTHING;

-- Note: The above assigns user_id values by picking existing users from public.users.
-- If you want specific user_id values or to create new users, replace the user_id expressions accordingly.
-- If no users exist, the SELECT subqueries will return NULL and insert will set user_id = NULL (allowed),
-- but the foreign key from student_details.user_id -> users.id must be satisfied if defined. In your schema,
-- student_details.user_id references users.id; ensure those users exist or adjust accordingly.

-- 5) Insert sample fingerprint_attendance rows (will succeed because parent rows now exist)
INSERT INTO public.fingerprint_attendance (
  roll_no, student_name, department, year, session_type, marked_at, fingerprint_verified, device_id, location
) VALUES
  ('TEST2025001', 'Test Student One', 'Computer Science', '1st year', 'check-in', (CURRENT_DATE::timestamp + TIME '09:00'), true, 'DEVICE_001', 'Main Campus'),
  ('TEST2025002', 'Test Student Two', 'Electronics', '2nd year', 'check-in', (CURRENT_DATE::timestamp + TIME '09:05'), true, 'DEVICE_001', 'Main Campus'),
  ('TEST2025003', 'Test Student Three', 'Mechanical', '3rd year', 'check-in', (CURRENT_DATE::timestamp + TIME '09:10'), true, 'DEVICE_001', 'Main Campus');

-- 6) Quick verification (readonly)
SELECT COUNT(*) AS total_records FROM public.fingerprint_attendance;
SELECT * FROM public.fingerprint_attendance_view LIMIT 10;
SELECT * FROM public.today_fingerprint_attendance LIMIT 50;

