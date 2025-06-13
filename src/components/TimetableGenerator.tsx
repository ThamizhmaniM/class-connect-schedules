
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStudentContext } from '@/contexts/StudentContext';
import { Plus, X } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '08:00-08:45', '08:45-09:30', '09:30-10:15', '10:15-11:00',
  '11:15-12:00', '12:00-12:45', '12:45-13:30', '14:30-15:15', '15:15-16:00'
];

const TimetableGenerator = () => {
  const { subjectGroups, timetable, addTimeSlot, deleteTimeSlot } = useStudentContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    subject: '',
    groupId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.day && formData.time && formData.subject && formData.groupId) {
      addTimeSlot(formData);
      setFormData({ day: '', time: '', subject: '', groupId: '' });
      setIsDialogOpen(false);
    }
  };

  const generateAutoTimetable = () => {
    // Simple AI-suggested scheduling logic
    subjectGroups.forEach(group => {
      group.subjects.forEach((subject, index) => {
        const dayIndex = index % DAYS.length;
        const timeIndex = index % TIME_SLOTS.length;
        
        addTimeSlot({
          day: DAYS[dayIndex],
          time: TIME_SLOTS[timeIndex],
          subject,
          groupId: group.id,
        });
      });
    });
  };

  const getGroupName = (groupId: string) => {
    return subjectGroups.find(g => g.id === groupId)?.name || 'Unknown Group';
  };

  const getScheduleForDayAndTime = (day: string, time: string) => {
    return timetable.filter(slot => slot.day === day && slot.time === time);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Timetable Generator</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateAutoTimetable}>
              AI Generate
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Time Slot</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="group">Subject Group</Label>
                    <select
                      id="group"
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
                    <Label htmlFor="subject">Subject</Label>
                    <select
                      id="subject"
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
                    <Label htmlFor="day">Day</Label>
                    <select
                      id="day"
                      value={formData.day}
                      onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select a day</option>
                      {DAYS.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Time Slot</Label>
                    <select
                      id="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select time slot</option>
                      {TIME_SLOTS.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button type="submit" className="w-full">Add Time Slot</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {timetable.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No timetable created yet. Use "AI Generate" for automatic scheduling or add slots manually.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    {DAYS.map(day => (
                      <TableHead key={day}>{day}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TIME_SLOTS.map(time => (
                    <TableRow key={time}>
                      <TableCell className="font-medium">{time}</TableCell>
                      {DAYS.map(day => (
                        <TableCell key={`${day}-${time}`} className="min-w-32">
                          {getScheduleForDayAndTime(day, time).map(slot => (
                            <div key={slot.id} className="mb-2 p-2 bg-primary/10 rounded text-xs">
                              <div className="font-medium">{slot.subject}</div>
                              <div className="text-muted-foreground">{getGroupName(slot.groupId)}</div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteTimeSlot(slot.id)}
                                className="mt-1 h-4 w-4 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </TableCell>
                      ))}
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

export default TimetableGenerator;
