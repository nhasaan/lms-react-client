import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Answer, AnswerFormValues } from "../models/answer";
import { Pagination, PagingParams } from "../models/pagination";

export default class AnswerStore {
    answerRegistry = new Map<string, Answer>();
    selectedLessonId: string | undefined = undefined;
    selectedAnswer: Answer | undefined = undefined;
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
                this.answerRegistry.clear();
                if (this.selectedLessonId) this.loadAnswers(this.selectedLessonId);
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

    get answersByDate() {
        return Array.from(this.answerRegistry.values());
    }

    loadAnswers = async (lessonId: string) => {
        this.loadingInitial = true;
        try {
            const result = await agent.Answers.list(lessonId, this.axiosParams);
            result.data.forEach(answer => {
                this.setAnswer(answer);
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

    loadAnswer = async (lessonId: string, id: string) => {
        let answer = this.getAnswer(id);
        if (answer) {
            this.selectedAnswer = answer;
            return answer;
        } else {
            this.loadingInitial = true;
            try {
                answer = await agent.Answers.details(lessonId, id);
                this.setAnswer(answer);
                runInAction(() => {
                    this.selectedAnswer = answer;
                })
                this.setLoadingInitial(false);
                return answer;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }


    loadSelectedLessonId = async (lessonId: string) => {
        this.selectedLessonId = lessonId;
    }

    private setAnswer = (answer: Answer) => {
        this.answerRegistry.set(answer.id, answer);
    }

    private getAnswer = (id: string) => {
        return this.answerRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createAnswers = async (data: any) => {
        try {
            const createdAnswers = await agent.Answers.submitAnswers(data);
            console.log(createdAnswers)
            // const newAnswer = new Answer(createdAnswer);
            // this.setAnswer(newAnswer);
            // runInAction(() => {
            //     this.selectedAnswer = newAnswer;
            // })
        } catch (error) {
            console.log(error);
        }
    }

    updateAnswers = async (answer: AnswerFormValues) => {
        try {
            await agent.Answers.update(answer);
            runInAction(() => {
                if (answer.id) {
                    let updatedAnswer = { ...this.getAnswer(answer.id), ...answer }
                    this.answerRegistry.set(answer.id, updatedAnswer as Answer);
                    this.selectedAnswer = updatedAnswer as Answer;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteAnswer = async (id: string) => {
        this.loading = true;
        try {
            await agent.Answers.delete(id);
            runInAction(() => {
                this.answerRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    clearSelectedAnswer = () => {
        this.selectedAnswer = undefined;
    }
}