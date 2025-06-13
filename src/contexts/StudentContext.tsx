import React, { createContext, useContext, useState } from 'react';

export interface Student {
  id: string;
  name: string;
  class: string;
  subjects: string[];
}

export interface SubjectGroup {
  id: string;
  name: string;
  class: string;
  subjects: string[];
  students: Student[];
}

export interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  groupId: string;
}

export interface Test {
  id: string;
  subject: string;
  groupId: string;
  date: string;
  time: string;
  duration: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectGroupId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

interface StudentContextType {
  students: Student[];
  subjectGroups: SubjectGroup[];
  timetable: TimeSlot[];
  tests: Test[];
  attendance: AttendanceRecord[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  generateSubjectGroups: () => void;
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, timeSlot: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  addTest: (test: Omit<Test, 'id'>) => void;
  updateTest: (id: string, test: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  markAttendance: (attendance: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, attendance: Partial<AttendanceRecord>) => void;
  getAttendanceByGroup: (groupId: string) => AttendanceRecord[];
  getAttendanceByStudent: (studentId: string) => AttendanceRecord[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
  'Political Science'
];

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [timetable, setTimetable] = useState<TimeSlot[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
    };
    setStudents(prev => [...prev, newStudent]);
    console.log('Added student:', newStudent);
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const generateSubjectGroups = () => {
    const groupMap = new Map<string, Student[]>();
    
    students.forEach(student => {
      const sortedSubjects = [...student.subjects].sort();
      const groupKey = `${student.class}-${sortedSubjects.join(',')}`;
      
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(student);
    });

    const groups: SubjectGroup[] = Array.from(groupMap.entries()).map(([key, groupStudents]) => {
      const [className, subjectsStr] = key.split('-');
      const subjects = subjectsStr.split(',');
      
      // Generate a readable group name
      let groupName = `Class ${className} - `;
      if (subjects.includes('Physics') && subjects.includes('Chemistry') && subjects.includes('Mathematics')) {
        if (subjects.includes('Biology')) {
          groupName += 'PCMB';
        } else if (subjects.includes('Computer Science')) {
          groupName += 'PCMC';
        } else {
          groupName += 'PCM';
        }
      } else if (subjects.includes('Physics') && subjects.includes('Chemistry') && subjects.includes('Biology')) {
        groupName += 'PCB';
      } else {
        groupName += subjects.slice(0, 3).map(s => s.charAt(0)).join('');
      }

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: groupName,
        class: className,
        subjects,
        students: groupStudents,
      };
    });

    setSubjectGroups(groups);
    console.log('Generated subject groups:', groups);
  };

  const addTimeSlot = (timeSlot: Omit<TimeSlot, 'id'>) => {
    const newTimeSlot = {
      ...timeSlot,
      id: Date.now().toString(),
    };
    setTimetable(prev => [...prev, newTimeSlot]);
  };

  const updateTimeSlot = (id: string, updatedTimeSlot: Partial<TimeSlot>) => {
    setTimetable(prev => prev.map(slot => 
      slot.id === id ? { ...slot, ...updatedTimeSlot } : slot
    ));
  };

  const deleteTimeSlot = (id: string) => {
    setTimetable(prev => prev.filter(slot => slot.id !== id));
  };

  const addTest = (test: Omit<Test, 'id'>) => {
    const newTest = {
      ...test,
      id: Date.now().toString(),
    };
    setTests(prev => [...prev, newTest]);
  };

  const updateTest = (id: string, updatedTest: Partial<Test>) => {
    setTests(prev => prev.map(test => 
      test.id === id ? { ...test, ...updatedTest } : test
    ));
  };

  const deleteTest = (id: string) => {
    setTests(prev => prev.filter(test => test.id !== id));
  };

  const markAttendance = (attendance: Omit<AttendanceRecord, 'id'>) => {
    const newAttendance = {
      ...attendance,
      id: Date.now().toString(),
    };
    setAttendance(prev => [...prev, newAttendance]);
    console.log('Marked attendance:', newAttendance);
  };

  const updateAttendance = (id: string, updatedAttendance: Partial<AttendanceRecord>) => {
    setAttendance(prev => prev.map(record => 
      record.id === id ? { ...record, ...updatedAttendance } : record
    ));
  };

  const getAttendanceByGroup = (groupId: string) => {
    return attendance.filter(record => record.subjectGroupId === groupId);
  };

  const getAttendanceByStudent = (studentId: string) => {
    return attendance.filter(record => record.studentId === studentId);
  };

  return (
    <StudentContext.Provider value={{
      students,
      subjectGroups,
      timetable,
      tests,
      attendance,
      addStudent,
      updateStudent,
      deleteStudent,
      generateSubjectGroups,
      addTimeSlot,
      updateTimeSlot,
      deleteTimeSlot,
      addTest,
      updateTest,
      deleteTest,
      markAttendance,
      updateAttendance,
      getAttendanceByGroup,
      getAttendanceByStudent,
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export { AVAILABLE_SUBJECTS };
