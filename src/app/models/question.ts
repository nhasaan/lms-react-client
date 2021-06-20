export interface Question {
  id: string;
  title: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Question implements Question {
  constructor(init?: QuestionFormValues) {
    Object.assign(this, init);
  }
}

export class QuestionFormValues {
  id?: string = undefined;
  title: string = '';
  a: string = '';
  b: string = '';
  c: string = '';
  d: string = '';
  correct?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(question?: QuestionFormValues) {
    if (question) {
      this.id = question.id;
      this.title = question.title;
      this.a = question.a;
      this.b = question.b;
      this.c = question.c;
      this.d = question.d;
      this.correct = question.correct;
      this.created_at = question.created_at;
      this.updated_at = question.updated_at;
    }
  }
}