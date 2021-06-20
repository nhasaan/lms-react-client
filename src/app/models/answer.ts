export interface Answer {
  id: string;
  selected: string;
  is_correct?: boolean;
  answered_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Answer implements Answer {
  constructor(init?: AnswerFormValues) {
    Object.assign(this, init);
  }
}

export class AnswerFormValues {
  id?: string = undefined;
  selected: string = '';
  answered_by?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(answer?: AnswerFormValues) {
    if (answer) {
      this.id = answer.id;
      this.selected = answer.selected;
      this.created_at = answer.created_at;
      this.updated_at = answer.updated_at;
    }
  }
}