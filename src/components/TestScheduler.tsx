
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStudentContext } from '@/contexts/StudentContext';
import { Plus, X, Calendar } from 'lucide-react';

const TestScheduler = () => {
  const { subjectGroups, tests, addTest, deleteTest, timetable } = useStudentContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    groupId: '',
    date: '',
    time: '',
    duration: 60,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subject && formData.groupId && formData.date && formData.time) {
      addTest(formData);
      setFormData({ subject: '', groupId: '', date: '', time: '', duration: 60 });
      setIsDialogOpen(false);
    }
  };

  const getGroupName = (groupId: string) => {
    return subjectGroups.find(g => g.id === groupId)?.name || 'Unknown Group';
  };

  const checkForConflicts = (date: string, time: string, groupId: string) => {
    // Check for conflicts with regular timetable
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const conflicts = timetable.filter(slot => 
      slot.day === dayOfWeek && 
      slot.time.includes(time.substring(0, 5)) &&
      slot.groupId === groupId
    );
    return conflicts.length > 0;
  };

  const generateWeekendTests = () => {
    // AI-suggested weekend test scheduling
    subjectGroups.forEach((group, groupIndex) => {
      group.subjects.forEach((subject, subjectIndex) => {
        const weekendsAhead = Math.floor((groupIndex * group.subjects.length + subjectIndex) / 2) + 1;
        const testDate = new Date();
        testDate.setDate(testDate.getDate() + (weekendsAhead * 7) - testDate.getDay() + 6); // Next Saturday
        
        addTest({
          subject,
          groupId: group.id,
          date: testDate.toISOString().split('T')[0],
          time: subjectIndex % 2 === 0 ? '09:00' : '14:00',
          duration: 90,
        });
      });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Weekend Test Scheduler</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateWeekendTests}>
              <Calendar className="mr-2 h-4 w-4" />
              Auto Schedule
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Test
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Test</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="testGroup">Subject Group</Label>
                    <select
                      id="testGroup"
                      value={formData.groupId}
                      onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select a group</option>
                      {subjectGroups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="testSubject">Subject</Label>
                    <select
                      id="testSubject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select a subject</option>
                      {formData.groupId && subjectGroups.find(g => g.id === formData.groupId)?.subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="testDate">Test Date</Label>
                    <Input
                      id="testDate"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="testTime">Start Time</Label>
                    <Input
                      id="testTime"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min="30"
                      max="180"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Schedule Test</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No tests scheduled yet. Use "Auto Schedule" for weekend tests or add manually.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map(test => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.subject}</TableCell>
                    <TableCell>{getGroupName(test.groupId)}</TableCell>
                    <TableCell>{new Date(test.date).toLocaleDateString()}</TableCell>
                    <TableCell>{test.time}</TableCell>
                    <TableCell>{test.duration} min</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTest(test.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestScheduler;
