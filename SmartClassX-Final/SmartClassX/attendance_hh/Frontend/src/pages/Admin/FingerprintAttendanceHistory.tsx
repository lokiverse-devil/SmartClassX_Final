import React, { useState, useEffect } from 'react';
import { Fingerprint, RefreshCw, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AttendanceRecord {
  id: number;
  student_id: string;
  student_name: string;
  student_email: string;
  department: string;
  year: string;
  session_type: 'check-in' | 'check-out';
  marked_at: string;
  fingerprint_verified: boolean;
}

export const FingerprintAttendanceHistory: React.FC = () => {
  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPresent: 0,
    checkIns: 0,
    checkOuts: 0,
    uniqueStudents: 0,
  });

  const fetchTodayAttendance = async () => {
    setLoading(true);
    try {
      const apiBase = (import.meta as any)?.env?.VITE_API_URL || 'http://10.16.182.197:5000';
      const response = await fetch(`${apiBase}/api/fingerprint/today`);
      
      if (response.ok) {
        const data = await response.json();
        
        // The API returns data in the format with attendance status per student
        const records = data.data || [];
        
        // Convert the summary data to individual records for display
        const expandedRecords: AttendanceRecord[] = [];
        records.forEach((student: any) => {
          if (student.check_in_time) {
            expandedRecords.push({
              id: Math.random(), // temporary ID for display
              student_id: student.roll_no,
              student_name: student.student_name,
              student_email: '', // Not in our data
              department: student.department || 'N/A',
              year: student.year || 'N/A',
              session_type: 'check-in',
              marked_at: student.check_in_time,
              fingerprint_verified: true,
            });
          }
          if (student.check_out_time) {
            expandedRecords.push({
              id: Math.random(), // temporary ID for display
              student_id: student.roll_no,
              student_name: student.student_name,
              student_email: '', // Not in our data
              department: student.department || 'N/A',
              year: student.year || 'N/A',
              session_type: 'check-out',
              marked_at: student.check_out_time,
              fingerprint_verified: true,
            });
          }
        });
        
        setTodayRecords(expandedRecords);
        
        // Calculate stats from API data
        setStats({
          totalPresent: data.total_students || 0,
          checkIns: data.present_full + data.present_half || 0,
          checkOuts: data.present_full || 0,
          uniqueStudents: data.total_students || 0,
        });
      } else {
        console.error('Failed to fetch attendance records');
        setTodayRecords([]);
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      setTodayRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTodayAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Fingerprint className="h-8 w-8" />
            Fingerprint Attendance History
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time attendance tracking for {getTodayDate()}
          </p>
        </div>
        <button
          onClick={fetchTodayAttendance}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalPresent}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unique Students</p>
              <p className="text-2xl font-bold text-foreground">{stats.uniqueStudents}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Check-ins</p>
              <p className="text-2xl font-bold text-foreground">{stats.checkIns}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Check-outs</p>
              <p className="text-2xl font-bold text-foreground">{stats.checkOuts}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Attendance Records
          </h3>
          <Badge variant="outline" className="text-sm">
            {todayRecords.length} records
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading attendance records...</p>
          </div>
        ) : todayRecords.length === 0 ? (
          <div className="text-center py-12">
            <Fingerprint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No attendance records for today yet</p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Records will appear here when students mark their attendance
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Session Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.student_id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.student_name}</p>
                        <p className="text-xs text-muted-foreground">{record.student_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.year}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={record.session_type === 'check-in' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {record.session_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTime(record.marked_at)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

