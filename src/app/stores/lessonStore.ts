import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Lesson, LessonFormValues } from "../models/lesson";
import { Pagination, PagingParams } from "../models/pagination";

export default class LessonStore {
    lessonRegistry = new Map<string, Lesson>();
    selectedCourseId: string | undefined = undefined;
    selectedLesson: Lesson | undefined = undefined;
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
                this.lessonRegistry.clear();
                if (this.selectedCourseId) this.loadLessons(this.selectedCourseId);
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

    get lessonsByDate() {
        return Array.from(this.lessonRegistry.values());
    }

    loadLessons = async (courseId: string) => {
        this.loadingInitial = true;
        try {
            const result = await agent.Lessons.list(courseId, this.axiosParams);
            result.data.forEach(lesson => {
                this.setLesson(lesson);
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

    loadLesson = async (courseId: string, id: string) => {
        let lesson = this.getLesson(id);
        if (lesson) {
            this.selectedLesson = lesson;
            return lesson;
        } else {
            this.loadingInitial = true;
            try {
                lesson = await agent.Lessons.details(courseId, id);
                this.setLesson(lesson);
                runInAction(() => {
                    this.selectedLesson = lesson;
                })
                this.setLoadingInitial(false);
                return lesson;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }


    loadSelectedCourseId = async (courseId: string) => {
        this.selectedCourseId = courseId;
    }

    private setLesson = (lesson: Lesson) => {
        this.lessonRegistry.set(lesson.id, lesson);
    }

    private getLesson = (id: string) => {
        return this.lessonRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createLesson = async (courseId: string, lesson: LessonFormValues) => {
        try {
            const createdLesson = await agent.Lessons.create(courseId, lesson);
            const newLesson = new Lesson(createdLesson);
            this.setLesson(newLesson);
            runInAction(() => {
                this.selectedLesson = newLesson;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateLesson = async (lesson: LessonFormValues) => {
        try {
            await agent.Lessons.update(lesson);
            runInAction(() => {
                if (lesson.id) {
                    let updatedLesson = { ...this.getLesson(lesson.id), ...lesson }
                    this.lessonRegistry.set(lesson.id, updatedLesson as Lesson);
                    this.selectedLesson = updatedLesson as Lesson;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteLesson = async (id: string) => {
        this.loading = true;
        try {
            await agent.Lessons.delete(id);
            runInAction(() => {
                this.lessonRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    clearSelectedLesson = () => {
        this.selectedLesson = undefined;
    }
}