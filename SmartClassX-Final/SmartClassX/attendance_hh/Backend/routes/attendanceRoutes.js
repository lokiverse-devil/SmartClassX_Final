import express from 'express';
import supabase from "../src/config/db.js";

const router = express.Router();

// Get all attendance records
router.get('/records', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('attendance_with_details')
      .select('*')
      .order('marked_at', { ascending: false });
    if (error) {
      console.error("❌ Error fetching attendance records:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance records for a specific student
router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const { data, error } = await supabase
      .from('attendance_with_details')
      .select('*')
      .eq('student_id', studentId)
      .order('marked_at', { ascending: false });
    if (error) {
      console.error("❌ Error fetching student attendance:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance statistics
router.get('/stats', async (req, res) => {
  try {
    // Supabase does not support complex SQL aggregation in the client, so use RPC or fetch all and aggregate in JS
    const { data, error } = await supabase
      .from('attendance')
      .select('student_id, session_type, marked_at');
    if (error) {
      console.error("❌ Error fetching attendance stats:", error);
      return res.status(500).json({ error: error.message });
    }
    // Aggregate stats in JS
    const stats = {};
    data.forEach(row => {
      const date = row.marked_at ? row.marked_at.split('T')[0] : null;
      if (!date) return;
      if (!stats[date]) {
        stats[date] = {
          date,
          total_records: 0,
          unique_students: new Set(),
          check_ins: 0,
          check_outs: 0,
          daily_count: 0
        };
      }
      stats[date].total_records++;
      stats[date].unique_students.add(row.student_id);
      if (row.session_type === 'check-in') stats[date].check_ins++;
      if (row.session_type === 'check-out') stats[date].check_outs++;
      stats[date].daily_count++;
    });
    // Format result
    const result = Object.values(stats).map(s => ({
      ...s,
      unique_students: s.unique_students.size
    })).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router as attendanceRoutes };
