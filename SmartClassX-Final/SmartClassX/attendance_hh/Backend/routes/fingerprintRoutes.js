import express from 'express';
import supabase from '../src/config/db.js';

const router = express.Router();

/**
 * POST /api/fingerprint/mark-attendance
 * Mark fingerprint attendance (check-in or check-out)
 * Body: { roll_no, session_type, device_id?, location? }
 */
router.post('/mark-attendance', async (req, res) => {
  try {
    const { roll_no, session_type, device_id, location } = req.body;

    // Validate required fields
    if (!roll_no || !session_type) {
      return res.status(400).json({ 
        error: 'Missing required fields: roll_no and session_type are required' 
      });
    }

    // Validate session_type
    if (!['check-in', 'check-out'].includes(session_type)) {
      return res.status(400).json({ 
        error: 'Invalid session_type. Must be either "check-in" or "check-out"' 
      });
    }

    // Get student details
    const { data: studentData, error: studentError } = await supabase
      .from('student_details')
      .select('roll_no, department, year, users(name)')
      .eq('roll_no', roll_no)
      .single();

    if (studentError || !studentData) {
      return res.status(404).json({ 
        error: 'Student not found with the provided roll number' 
      });
    }

    // Check if already marked for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingRecord } = await supabase
      .from('fingerprint_attendance')
      .select('*')
      .eq('roll_no', roll_no)
      .eq('session_type', session_type)
      .gte('marked_at', `${today}T00:00:00`)
      .lte('marked_at', `${today}T23:59:59`)
      .maybeSingle();

    if (existingRecord) {
      return res.status(409).json({ 
        error: `${session_type} already marked for today`,
        existing_record: existingRecord
      });
    }

    // Insert fingerprint attendance record
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('fingerprint_attendance')
      .insert([{
        roll_no,
        student_name: studentData.users?.name || 'Unknown',
        department: studentData.department,
        year: studentData.year,
        session_type,
        marked_at: new Date().toISOString(),
        fingerprint_verified: true,
        device_id: device_id || 'MAIN_DEVICE',
        location: location || 'Main Campus'
      }])
      .select()
      .single();

    if (attendanceError) {
      console.error('Error inserting attendance:', attendanceError);
      return res.status(500).json({ 
        error: 'Failed to mark attendance',
        details: attendanceError.message
      });
    }

    res.status(201).json({
      success: true,
      message: `${session_type} marked successfully`,
      data: attendanceData
    });
  } catch (error) {
    console.error('Error in mark-attendance:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/fingerprint/today
 * Get today's fingerprint attendance summary
 */
router.get('/today', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('today_fingerprint_attendance')
      .select('*')
      .order('roll_no', { ascending: true });

    if (error) {
      console.error('Error fetching today attendance:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch today\'s attendance',
        details: error.message
      });
    }

    res.json({
      success: true,
      date: new Date().toISOString().split('T')[0],
      total_students: data.length,
      present_full: data.filter(s => s.attendance_status === 'Present (Full Day)').length,
      present_half: data.filter(s => s.attendance_status === 'Present (Half Day)').length,
      absent: data.filter(s => s.attendance_status === 'Absent').length,
      data
    });
  } catch (error) {
    console.error('Error in today endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/fingerprint/history/:roll_no
 * Get attendance history for a specific student
 * Query params: ?start_date, ?end_date, ?limit
 */
router.get('/history/:roll_no', async (req, res) => {
  try {
    const { roll_no } = req.params;
    const { start_date, end_date, limit } = req.query;

    let query = supabase
      .from('fingerprint_attendance_view')
      .select('*')
      .eq('roll_no', roll_no)
      .order('marked_at', { ascending: false });

    if (start_date) {
      query = query.gte('attendance_date', start_date);
    }

    if (end_date) {
      query = query.lte('attendance_date', end_date);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch attendance history',
        details: error.message
      });
    }

    res.json({
      success: true,
      roll_no,
      total_records: data.length,
      data
    });
  } catch (error) {
    console.error('Error in history endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/fingerprint/all
 * Get all fingerprint attendance records
 * Query params: ?date, ?department, ?year, ?session_type, ?limit, ?offset
 */
router.get('/all', async (req, res) => {
  try {
    const { date, department, year, session_type, limit, offset } = req.query;

    let query = supabase
      .from('fingerprint_attendance_view')
      .select('*', { count: 'exact' })
      .order('marked_at', { ascending: false });

    if (date) {
      query = query.eq('attendance_date', date);
    }

    if (department) {
      query = query.eq('department', department);
    }

    if (year) {
      query = query.eq('year', year);
    }

    if (session_type) {
      query = query.eq('session_type', session_type);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (offset) {
      query = query.range(
        parseInt(offset), 
        parseInt(offset) + (parseInt(limit) || 50) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching all attendance:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch attendance records',
        details: error.message
      });
    }

    res.json({
      success: true,
      total_records: count,
      returned_records: data.length,
      data
    });
  } catch (error) {
    console.error('Error in all endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/fingerprint/student-status/:roll_no
 * Get current day status for a student
 */
router.get('/student-status/:roll_no', async (req, res) => {
  try {
    const { roll_no } = req.params;

    const { data, error } = await supabase
      .from('today_fingerprint_attendance')
      .select('*')
      .eq('roll_no', roll_no)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching student status:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch student status',
        details: error.message
      });
    }

    if (!data) {
      return res.status(404).json({ 
        error: 'Student not found or no attendance record for today' 
      });
    }

    res.json({
      success: true,
      roll_no,
      data
    });
  } catch (error) {
    console.error('Error in student-status endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/fingerprint/stats
 * Get overall statistics
 * Query params: ?start_date, ?end_date
 */
router.get('/stats', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let query = supabase
      .from('fingerprint_attendance')
      .select('*');

    if (start_date) {
      query = query.gte('marked_at', `${start_date}T00:00:00`);
    }

    if (end_date) {
      query = query.lte('marked_at', `${end_date}T23:59:59`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stats:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch statistics',
        details: error.message
      });
    }

    const stats = {
      total_records: data.length,
      check_ins: data.filter(r => r.session_type === 'check-in').length,
      check_outs: data.filter(r => r.session_type === 'check-out').length,
      unique_students: new Set(data.map(r => r.roll_no)).size,
      by_department: {},
      by_year: {},
      by_device: {}
    };

    // Group by department
    data.forEach(record => {
      if (record.department) {
        stats.by_department[record.department] = 
          (stats.by_department[record.department] || 0) + 1;
      }
      if (record.year) {
        stats.by_year[record.year] = 
          (stats.by_year[record.year] || 0) + 1;
      }
      if (record.device_id) {
        stats.by_device[record.device_id] = 
          (stats.by_device[record.device_id] || 0) + 1;
      }
    });

    res.json({
      success: true,
      date_range: {
        start: start_date || 'all',
        end: end_date || 'all'
      },
      stats
    });
  } catch (error) {
    console.error('Error in stats endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * DELETE /api/fingerprint/record/:id
 * Delete a specific attendance record (admin only)
 */
router.delete('/record/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('fingerprint_attendance')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting record:', error);
      return res.status(500).json({ 
        error: 'Failed to delete record',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'Record deleted successfully',
      deleted_record: data
    });
  } catch (error) {
    console.error('Error in delete endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

export { router as fingerprintRoutes };

