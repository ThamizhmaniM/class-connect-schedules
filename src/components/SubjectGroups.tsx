
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudentContext } from '@/contexts/StudentContext';

const SubjectGroups = () => {
  const { subjectGroups, generateSubjectGroups, students } = useStudentContext();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Smart Subject Groups</CardTitle>
          <Button onClick={generateSubjectGroups} disabled={students.length === 0}>
            Regenerate Groups
          </Button>
        </CardHeader>
        <CardContent>
          {subjectGroups.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No subject groups created yet. Add students and they will be automatically grouped by their subject combinations.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjectGroups.map(group => (
                <Card key={group.id} className="border-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {group.students.length} student{group.students.length !== 1 ? 's' : ''}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Subjects:</h4>
                      <div className="flex flex-wrap gap-1">
                        {group.subjects.map(subject => (
                          <span key={subject} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Students:</h4>
                      <div className="space-y-1">
                        {group.students.map(student => (
                          <div key={student.id} className="text-xs bg-muted px-2 py-1 rounded">
                            {student.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectGroups;
