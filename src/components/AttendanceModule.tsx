
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStudentContext } from '@/contexts/StudentContext';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const AttendanceModule = () => {
  const { 
    subjectGroups, 
    students, 
    attendance, 
    markAttendance, 
    getAttendanceByGroup,
    getAttendanceByStudent 
  } = useStudentContext();
  
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'mark' | 'report'>('mark');

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedGroup || !selectedSubject) return;

    markAttendance({
      studentId,
      subjectGroupId: selectedGroup,
      subject: selectedSubject,
      date: selectedDate,
      status,
    });
  };

  const getAttendanceStatus = (studentId: string) => {
    const existingRecord = attendance.find(
      record => 
        record.studentId === studentId && 
        record.subjectGroupId === selectedGroup &&
        record.subject === selectedSubject &&
        record.date === selectedDate
    );
    return existingRecord?.status || null;
  };

  const calculateAttendancePercentage = (studentId: string) => {
    const studentAttendance = getAttendanceByStudent(studentId);
    if (studentAttendance.length === 0) return 0;
    
    const presentCount = studentAttendance.filter(record => record.status === 'present').length;
    return Math.round((presentCount / studentAttendance.length) * 100);
  };

  const selectedGroupData = subjectGroups.find(group => group.id === selectedGroup);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Subject Group</label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject group" />
                </SelectTrigger>
                <SelectContent>
                  {subjectGroups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedGroupData && (
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedGroupData.subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'mark' ? 'default' : 'outline'}
                onClick={() => setViewMode('mark')}
              >
                Mark Attendance
              </Button>
              <Button 
                variant={viewMode === 'report' ? 'default' : 'outline'}
                onClick={() => setViewMode('report')}
              >
                View Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'mark' && selectedGroupData && selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle>
              Mark Attendance - {selectedGroupData.name} ({selectedSubject})
            </CardTitle>
            <p className="text-sm text-muted-foreground">Date: {selectedDate}</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedGroupData.students.map(student => {
                  const status = getAttendanceStatus(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        {status ? (
                          <Badge 
                            variant={
                              status === 'present' ? 'default' : 
                              status === 'late' ? 'secondary' : 'destructive'
                            }
                          >
                            {status === 'present' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {status === 'absent' && <XCircle className="h-3 w-3 mr-1" />}
                            {status === 'late' && <Clock className="h-3 w-3 mr-1" />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Not marked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={status === 'present' ? 'default' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'present')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'late' ? 'secondary' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'late')}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'absent')}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Absent
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {viewMode === 'report' && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No students added yet. Add students to view attendance reports.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Sessions</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(student => {
                    const studentAttendance = getAttendanceByStudent(student.id);
                    const presentCount = studentAttendance.filter(r => r.status === 'present').length;
                    const absentCount = studentAttendance.filter(r => r.status === 'absent').length;
                    const lateCount = studentAttendance.filter(r => r.status === 'late').length;
                    const percentage = calculateAttendancePercentage(student.id);
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{studentAttendance.length}</TableCell>
                        <TableCell>
                          <Badge variant="default">{presentCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{absentCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{lateCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={percentage >= 75 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'}
                          >
                            {percentage}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceModule;
