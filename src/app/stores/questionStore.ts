import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Question, QuestionFormValues } from "../models/question";
import { Pagination, PagingParams } from "../models/pagination";

export default class QuestionStore {
    questionRegistry = new Map<string, Question>();
    selectedLessonId: string | undefined = undefined;
    selectedQuestion: Question | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.questionRegistry.clear();
                if (this.selectedLessonId) this.loadQuestions(this.selectedLessonId);
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString())
            } else {
                params.append(key, value);
            }
        })
        return params;
    }

    get questionsByDate() {
        return Array.from(this.questionRegistry.values());
    }

    loadQuestions = async (lessonId: string) => {
        this.loadingInitial = true;
        try {
            const result = await agent.Questions.list(lessonId, this.axiosParams);
            result.data.forEach(question => {
                this.setQuestion(question);
            })
            this.setPagination(result.pagination);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    loadQuestion = async (lessonId: string, id: string) => {
        let question = this.getQuestion(id);
        if (question) {
            this.selectedQuestion = question;
            return question;
        } else {
            this.loadingInitial = true;
            try {
                question = await agent.Questions.details(lessonId, id);
                this.setQuestion(question);
                runInAction(() => {
                    this.selectedQuestion = question;
                })
                this.setLoadingInitial(false);
                return question;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }


    loadSelectedLessonId = async (lessonId: string) => {
        this.selectedLessonId = lessonId;
    }

    private setQuestion = (question: Question) => {
        this.questionRegistry.set(question.id, question);
    }

    private getQuestion = (id: string) => {
        return this.questionRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createQuestion = async (question: QuestionFormValues) => {
        try {
            const createdQuestion = await agent.Questions.create(question);
            const newQuestion = new Question(createdQuestion);
            this.setQuestion(newQuestion);
            runInAction(() => {
                this.selectedQuestion = newQuestion;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateQuestion = async (question: QuestionFormValues) => {
        try {
            await agent.Questions.update(question);
            runInAction(() => {
                if (question.id) {
                    let updatedQuestion = { ...this.getQuestion(question.id), ...question }
                    this.questionRegistry.set(question.id, updatedQuestion as Question);
                    this.selectedQuestion = updatedQuestion as Question;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteQuestion = async (id: string) => {
        this.loading = true;
        try {
            await agent.Questions.delete(id);
            runInAction(() => {
                this.questionRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    clearSelectedQuestion = () => {
        this.selectedQuestion = undefined;
    }
}