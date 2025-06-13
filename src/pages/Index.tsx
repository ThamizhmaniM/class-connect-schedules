
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentModule from '@/components/StudentModule';
import SubjectGroups from '@/components/SubjectGroups';
import TimetableGenerator from '@/components/TimetableGenerator';
import TestScheduler from '@/components/TestScheduler';
import { StudentProvider } from '@/contexts/StudentContext';

const Index = () => {
  return (
    <StudentProvider>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">School Management System</h1>
            <p className="text-muted-foreground">Manage students, subjects, and generate intelligent timetables</p>
          </div>

          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="groups">Subject Groups</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="tests">Test Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="students" className="mt-6">
              <StudentModule />
            </TabsContent>
            
            <TabsContent value="groups" className="mt-6">
              <SubjectGroups />
            </TabsContent>
            
            <TabsContent value="timetable" className="mt-6">
              <TimetableGenerator />
            </TabsContent>
            
            <TabsContent value="tests" className="mt-6">
              <TestScheduler />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StudentProvider>
  );
};

export default Index;
