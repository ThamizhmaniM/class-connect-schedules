
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStudentContext, AVAILABLE_SUBJECTS } from '@/contexts/StudentContext';
import { Plus, X } from 'lucide-react';

const StudentModule = () => {
  const { students, addStudent, updateStudent, deleteStudent, generateSubjectGroups } = useStudentContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    subjects: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.class && formData.subjects.length > 0) {
      addStudent(formData);
      setFormData({ name: '', class: '', subjects: [] });
      setIsDialogOpen(false);
      generateSubjectGroups();
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleDeleteStudent = (id: string) => {
    deleteStudent(id);
    generateSubjectGroups();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Student Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter student name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    placeholder="e.g., 11, 12"
                    required
                  />
                </div>
                
                <div>
                  <Label>Select Subjects</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {AVAILABLE_SUBJECTS.map(subject => (
                      <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                          className="rounded"
                        />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Add Student</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No students added yet. Click "Add Student" to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.subjects.map(subject => (
                          <span key={subject} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
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

export default StudentModule;
