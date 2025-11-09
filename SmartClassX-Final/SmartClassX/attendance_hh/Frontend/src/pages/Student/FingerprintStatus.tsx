import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle, XCircle, Clock, Calendar, TrendingUp, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AttendanceRecord {
  id: number;
  session_type: 'check-in' | 'check-out';
  marked_at: string;
  date: string;
}

interface AttendanceStatus {
  todayStatus: {
    checkedIn: boolean;
    checkedOut: boolean;
    checkInTime: string | null;
    checkOutTime: string | null;
  };
  weeklyStats: {
    present: number;
    absent: number;
    total: number;
    percentage: number;
  };
  monthlyStats: {
    present: number;
    absent: number;
    total: number;
    percentage: number;
  };
}

export const FingerprintStatus: React.FC = () => {
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [previousRecords, setPreviousRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Get the authenticated user from localStorage
  const getAuthenticatedUser = () => {
    try {
      const storedUser = localStorage.getItem('attendo_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getAuthenticatedUser();
  const studentId = currentUser?.rollNo || currentUser?.studentId || currentUser?.id;

  const fetchAttendanceStatus = async () => {
    if (!studentId) {
      console.error('No student ID found');
      return;
    }

    setLoading(true);
    try {
      const apiBase = (import.meta as any)?.env?.VITE_API_URL || 'http://10.16.182.1972.197:5000';
      
      // Fetch current status using student-status endpoint
      const statusResponse = await fetch(`${apiBase}/api/fingerprint/student-status/${studentId}`);
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        
        // Transform API response to match component's expected format
        const todayData = statusData.data;
        const transformedStatus: AttendanceStatus = {
          todayStatus: {
            checkedIn: !!todayData?.check_in_time,
            checkedOut: !!todayData?.check_out_time,
            checkInTime: todayData?.check_in_time || null,
            checkOutTime: todayData?.check_out_time || null,
          },
          weeklyStats: {
            present: 0,
            absent: 0,
            total: 5,
            percentage: 0,
          },
          monthlyStats: {
            present: 0,
            absent: 0,
            total: 20,
            percentage: 0,
          },
        };
        setStatus(transformedStatus);
      }

      // Fetch previous records using history endpoint
      const recordsResponse = await fetch(`${apiBase}/api/fingerprint/history/${studentId}?limit=30`);
      if (recordsResponse.ok) {
        const recordsData = await recordsResponse.json();
        const records = recordsData.data || [];
        
        // Transform records to match component format
        const transformedRecords: AttendanceRecord[] = records.map((record: any) => ({
          id: record.id,
          session_type: record.session_type,
          marked_at: record.marked_at,
          date: record.attendance_date,
        }));
        
        setPreviousRecords(transformedRecords);
        
        // Calculate weekly and monthly stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const weeklyDates = new Set(
          records
            .filter((r: any) => new Date(r.marked_at) >= oneWeekAgo && r.session_type === 'check-in')
            .map((r: any) => new Date(r.marked_at).toDateString())
        );
        
        const monthlyDates = new Set(
          records
            .filter((r: any) => new Date(r.marked_at) >= oneMonthAgo && r.session_type === 'check-in')
            .map((r: any) => new Date(r.marked_at).toDateString())
        );
        
        setStatus(prev => prev ? {
          ...prev,
          weeklyStats: {
            present: weeklyDates.size,
            absent: Math.max(0, 5 - weeklyDates.size),
            total: 5,
            percentage: (weeklyDates.size / 5) * 100,
          },
          monthlyStats: {
            present: monthlyDates.size,
            absent: Math.max(0, 20 - monthlyDates.size),
            total: 20,
            percentage: (monthlyDates.size / 20) * 100,
          },
        } : prev);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
    // Refresh every minute
    const interval = setInterval(fetchAttendanceStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAttendance = async (sessionType: 'check-in' | 'check-out') => {
    if (!studentId) {
      setMessage({ type: 'error', text: 'Please log in to mark attendance' });
      return;
    }

    setMarking(true);
    setMessage(null);

    try {
      const apiBase = (import.meta as any)?.env?.VITE_API_URL || 'http://10.16.182.197:5000';
      const response = await fetch(`${apiBase}/api/fingerprint/mark-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roll_no: studentId,
          session_type: sessionType,
          device_id: 'WEB_APP',
          location: 'Online Portal',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `✅ ${sessionType === 'check-in' ? 'Check-in' : 'Check-out'} successful! Attendance marked at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}` 
        });
        // Refresh status after marking
        setTimeout(() => {
          fetchAttendanceStatus();
        }, 1000);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || data.message || `Failed to mark ${sessionType}` 
        });
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage({ 
        type: 'error', 
        text: 'Server connection failed. Please try again.' 
      });
    } finally {
      setMarking(false);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
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
            Attendance Status
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{getTodayDate()}</p>
        </div>
        <button
          onClick={fetchAttendanceStatus}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* User Info */}
      {currentUser && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{currentUser.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Roll No:</span>
                <p className="font-medium">{studentId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Department:</span>
                <p className="font-medium">{currentUser.department || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Year:</span>
                <p className="font-medium">{currentUser.year || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Attendance
          </CardTitle>
          <CardDescription>Mark your attendance using fingerprint verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in Status */}
            <div className="glass rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {status?.todayStatus.checkedIn ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">Check-in</span>
                </div>
                <Badge variant={status?.todayStatus.checkedIn ? 'default' : 'secondary'}>
                  {status?.todayStatus.checkedIn ? 'Completed' : 'Pending'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {status?.todayStatus.checkedIn 
                  ? `Checked in at ${formatTime(status.todayStatus.checkInTime)}`
                  : 'Not checked in yet'}
              </p>
              <button
                onClick={() => handleMarkAttendance('check-in')}
                disabled={marking || status?.todayStatus.checkedIn}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Fingerprint className="h-4 w-4" />
                {status?.todayStatus.checkedIn ? 'Already Checked In' : 'Mark Check-in'}
              </button>
            </div>

            {/* Check-out Status */}
            <div className="glass rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {status?.todayStatus.checkedOut ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">Check-out</span>
                </div>
                <Badge variant={status?.todayStatus.checkedOut ? 'default' : 'secondary'}>
                  {status?.todayStatus.checkedOut ? 'Completed' : 'Pending'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {status?.todayStatus.checkedOut 
                  ? `Checked out at ${formatTime(status.todayStatus.checkOutTime)}`
                  : 'Not checked out yet'}
              </p>
              <button
                onClick={() => handleMarkAttendance('check-out')}
                disabled={marking || status?.todayStatus.checkedOut || !status?.todayStatus.checkedIn}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Fingerprint className="h-4 w-4" />
                {status?.todayStatus.checkedOut ? 'Already Checked Out' : 'Mark Check-out'}
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'border-green-500/20 bg-green-500/5 text-green-600' 
                : 'border-red-500/20 bg-red-500/5 text-red-600'
            }`}>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Present:</span>
                <span className="font-medium">{status?.weeklyStats.present || 0} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Absent:</span>
                <span className="font-medium">{status?.weeklyStats.absent || 0} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Percentage:</span>
                <span className="font-medium text-primary">
                  {status?.weeklyStats.percentage?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Present:</span>
                <span className="font-medium">{status?.monthlyStats.present || 0} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Absent:</span>
                <span className="font-medium">{status?.monthlyStats.absent || 0} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Percentage:</span>
                <span className="font-medium text-primary">
                  {status?.monthlyStats.percentage?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previous Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Previous Attendance Records
          </CardTitle>
          <CardDescription>Your attendance history for the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Loading records...</p>
            </div>
          ) : previousRecords.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No previous attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Session Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{formatDate(record.marked_at)}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

