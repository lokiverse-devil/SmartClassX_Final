import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { createClient } from '@supabase/supabase-js';
import { qrRoutes } from './routes/qrRoutes.js';
import { attendanceRoutes } from './routes/attendanceRoutes.js';
import { fingerprintRoutes } from './routes/fingerprintRoutes.js';


dotenv.config();

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});

// ---------------- SIGN-UP ----------------
app.post("/register", async (req, res) => {
  const { name, email, password, role, rollNo, department, year, phone } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Check if email exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    if (userError) return res.status(500).json({ message: userError.message });
    if (existingUser && existingUser.length > 0) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const { data: userInsert, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role }])
      .select();
    if (insertError) return res.status(500).json({ message: insertError.message });
    const userId = userInsert[0].id;

    // If role is student, insert into student_details
    if (role === "student") {
      if (!rollNo || !department || !year || !phone) {
        return res.status(400).json({ message: "Student fields missing" });
      }
      const { error: studentError } = await supabase
        .from('student_details')
        .insert([{ user_id: userId, roll_no: rollNo, department, year, phone }]);
      if (studentError) return res.status(500).json({ message: studentError.message });

      const newUser = {
        id: userId,
        name,
        email,
        role,
        rollNo,
        department,
        year,
        phone,
        createdAt: new Date(),
      };
      return res.status(201).json({ user: newUser });
// Endpoint for admin to fetch all students with user details
app.get("/students", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_details')
      .select(`
        roll_no,
        department,
        year,
        phone,
        user_id,
        created_at,
        users (
          name,
          email,
          role,
          created_at
        )
      `);
    
    if (error) return res.status(500).json({ message: error.message });
    
    // Flatten the response to include user fields directly
    const students = (data || []).map(student => ({
      roll_no: student.roll_no,
      department: student.department,
      year: student.year,
      phone: student.phone,
      user_id: student.user_id,
      created_at: student.created_at,
      name: student.users?.name || 'N/A',
      email: student.users?.email || 'N/A',
      role: student.users?.role || 'student',
    }));
    
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
    } else {
      // Admin user
      const newUser = {
        id: userId,
        name,
        email,
        role,
        createdAt: new Date(),
      };
      return res.status(201).json({ user: newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- SIGN-IN ----------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "All fields required" });

  try {
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    if (userError) return res.status(500).json({ message: userError.message });
    if (!users || users.length === 0) return res.status(400).json({ message: "Invalid email or password" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    if (user.role === "student") {
      // Fetch student details
      const { data: studentResult, error: studentError } = await supabase
        .from('student_details')
        .select('roll_no, department, year')
        .eq('user_id', user.id);
      if (studentError) return res.status(500).json({ message: studentError.message });
      const studentData = studentResult && studentResult[0];
      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: studentData?.roll_no,
        department: studentData?.department,
        year: studentData?.year,
        createdAt: user.created_at,
      };
      res.json({ user: loggedInUser });
    } else {
      // Admin login
      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      };
      res.json({ user: loggedInUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Use QR routes
app.use('/api/qrcode', qrRoutes);

// Use Attendance routes
app.use('/api/attendance', attendanceRoutes);

// Use Fingerprint routes
app.use('/api/fingerprint', fingerprintRoutes);

app.get('/', (req, res) => {
  res.send('QR backend running');
});


// Test Supabase connection route
app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Supabase Connected!", userIdSample: data && data[0]?.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
``




