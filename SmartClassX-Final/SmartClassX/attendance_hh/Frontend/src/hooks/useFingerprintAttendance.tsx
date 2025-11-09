import { useState, useCallback } from 'react';

const API_BASE = (import.meta as any)?.env?.VITE_API_URL || 'http://10.16.182.197:5000';

interface FingerprintAttendanceRecord {
  id: number;
  roll_no: string;
  student_name: string;
  department: string;
  year: string;
  session_type: 'check-in' | 'check-out';
  marked_at: string;
  fingerprint_verified: boolean;
  device_id: string;
  location: string;
  attendance_date?: string;
  attendance_time?: string;
}

interface TodaySummary {
  success: boolean;
  date: string;
  total_students: number;
  present_full: number;
  present_half: number;
  absent: number;
  data: Array<{
    roll_no: string;
    student_name: string;
    department: string;
    year: string;
    phone: string;
    check_in_time: string | null;
    check_out_time: string | null;
    attendance_status: string;
  }>;
}

interface StudentStatus {
  success: boolean;
  roll_no: string;
  data: {
    roll_no: string;
    student_name: string;
    department: string;
    year: string;
    phone: string;
    check_in_time: string | null;
    check_out_time: string | null;
    attendance_status: string;
  };
}

interface AttendanceHistory {
  success: boolean;
  roll_no: string;
  total_records: number;
  data: FingerprintAttendanceRecord[];
}

interface MarkAttendanceResponse {
  success: boolean;
  message: string;
  data?: FingerprintAttendanceRecord;
  error?: string;
}

export const useFingerprintAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mark attendance (check-in or check-out)
   */
  const markAttendance = useCallback(
    async (
      rollNo: string,
      sessionType: 'check-in' | 'check-out',
      deviceId: string = 'WEB_APP',
      location: string = 'Online Portal'
    ): Promise<MarkAttendanceResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/fingerprint/mark-attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roll_no: rollNo,
            session_type: sessionType,
            device_id: deviceId,
            location: location,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to mark attendance');
        }

        return data;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to mark attendance';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get today's attendance summary for all students
   */
  const getTodaySummary = useCallback(async (): Promise<TodaySummary> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/fingerprint/today`);

      if (!response.ok) {
        throw new Error('Failed to fetch today\'s attendance');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch today\'s attendance';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get attendance history for a specific student
   */
  const getStudentHistory = useCallback(
    async (
      rollNo: string,
      startDate?: string,
      endDate?: string,
      limit?: number
    ): Promise<AttendanceHistory> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (limit) params.append('limit', limit.toString());

        const queryString = params.toString();
        const url = `${API_BASE}/api/fingerprint/history/${rollNo}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch student history');
        }

        const data = await response.json();
        return data;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch student history';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get current day status for a specific student
   */
  const getStudentStatus = useCallback(async (rollNo: string): Promise<StudentStatus> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/fingerprint/student-status/${rollNo}`);

      if (!response.ok) {
        throw new Error('Failed to fetch student status');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch student status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all attendance records with filters
   */
  const getAllRecords = useCallback(
    async (filters?: {
      date?: string;
      department?: string;
      year?: string;
      session_type?: 'check-in' | 'check-out';
      limit?: number;
      offset?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters?.date) params.append('date', filters.date);
        if (filters?.department) params.append('department', filters.department);
        if (filters?.year) params.append('year', filters.year);
        if (filters?.session_type) params.append('session_type', filters.session_type);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const queryString = params.toString();
        const url = `${API_BASE}/api/fingerprint/all${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch attendance records');
        }

        const data = await response.json();
        return data;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch attendance records';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get statistics
   */
  const getStatistics = useCallback(async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const queryString = params.toString();
      const url = `${API_BASE}/api/fingerprint/stats${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a specific attendance record
   */
  const deleteRecord = useCallback(async (recordId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/fingerprint/record/${recordId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete record';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    markAttendance,
    getTodaySummary,
    getStudentHistory,
    getStudentStatus,
    getAllRecords,
    getStatistics,
    deleteRecord,
  };
};

