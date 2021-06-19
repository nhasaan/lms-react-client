import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Course, CourseFormValues } from "../models/course";
import { Pagination, PagingParams } from "../models/pagination";

export default class CourseStore {
    courseRegistry = new Map<string, Course>();
    selectedCourse: Course | undefined = undefined;
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
                this.courseRegistry.clear();
                this.loadCourses();
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

    get coursesByDate() {
        return Array.from(this.courseRegistry.values());
    }

    loadCourses = async () => {
        this.loadingInitial = true;
        try {
            const result = await agent.Courses.list(this.axiosParams);
            result.data.forEach(course => {
                this.setCourse(course);
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

    loadCourse = async (id: string) => {
        let course = this.getCourse(id);
        if (course) {
            this.selectedCourse = course;
            return course;
        } else {
            this.loadingInitial = true;
            try {
                course = await agent.Courses.details(id);
                this.setCourse(course);
                runInAction(() => {
                    this.selectedCourse = course;
                })
                this.setLoadingInitial(false);
                return course;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setCourse = (course: Course) => {
        this.courseRegistry.set(course.id, course);
    }

    private getCourse = (id: string) => {
        return this.courseRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createCourse = async (course: CourseFormValues) => {
        try {
            await agent.Courses.create(course);
            const newCourse = new Course(course);
            this.setCourse(newCourse);
            runInAction(() => {
                this.selectedCourse = newCourse;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateCourse = async (course: CourseFormValues) => {
        try {
            await agent.Courses.update(course);
            runInAction(() => {
                if (course.id) {
                    let updatedCourse = { ...this.getCourse(course.id), ...course }
                    this.courseRegistry.set(course.id, updatedCourse as Course);
                    this.selectedCourse = updatedCourse as Course;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteCourse = async (id: string) => {
        this.loading = true;
        try {
            await agent.Courses.delete(id);
            runInAction(() => {
                this.courseRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    clearSelectedCourse = () => {
        this.selectedCourse = undefined;
    }
}