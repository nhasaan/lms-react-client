export interface Course {
  id: string;
  title: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Course implements Course {
  constructor(init?: CourseFormValues) {
    Object.assign(this, init);
  }
}

export class CourseFormValues {
  id?: string = undefined;
  title: string = '';
  description: string = '';
  created_at?: Date;
  updated_at?: Date;

  constructor(course?: CourseFormValues) {
    if (course) {
      this.id = course.id;
      this.title = course.title;
      this.description = course.description;
      this.created_at = course.created_at;
      this.updated_at = course.updated_at;
    }
  }
}