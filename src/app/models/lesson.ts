export interface Lesson {
  id: string;
  title: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Lesson implements Lesson {
  constructor(init?: LessonFormValues) {
    Object.assign(this, init);
  }
}

export class LessonFormValues {
  id?: string = undefined;
  title: string = '';
  description: string = '';
  created_at?: Date;
  updated_at?: Date;

  constructor(lesson?: LessonFormValues) {
    if (lesson) {
      this.id = lesson.id;
      this.title = lesson.title;
      this.description = lesson.description;
      this.created_at = lesson.created_at;
      this.updated_at = lesson.updated_at;
    }
  }
}