import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Answer, AnswerFormValues } from '../models/answer';
import { Course, CourseFormValues } from '../models/course';
import { Lesson, LessonFormValues } from '../models/lesson';
import { PaginatedResult } from '../models/pagination';
import { Question, QuestionFormValues } from '../models/question';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development') await sleep(1000);
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }
    return response;
}, (error: AxiosError) => {
    const { data, status, config, headers } = error.response!;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            if (status === 401 && headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')) {
                store.userStore.logout();
                toast.error('Session expired - please login again');
            }
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Courses = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Course[]>>('/courses', { params })
        .then(responseBody),
    details: (id: string) => requests.get<Course>(`/courses/${id}`),
    create: (course: CourseFormValues) => requests.post<Course>('/courses', course),
    update: (course: CourseFormValues) => requests.put<void>(`/courses/${course.id}`, course),
    delete: (id: string) => requests.del<void>(`/courses/${id}`)
}

const Lessons = {
    list: (courseId: string, params: URLSearchParams) =>
        axios.get<PaginatedResult<Lesson[]>>(`/courses/${courseId}/lessons`, { params })
            .then(responseBody),
    details: (courseId: string, id: string) => requests.get<Lesson>(`/courses/${courseId}/lessons/${id}`),
    create: (courseId: string, lesson: LessonFormValues) => requests.post<Lesson>(`/courses/${courseId}/lessons`, lesson),
    update: (lesson: LessonFormValues) => requests.put<void>(`/lessons/${lesson.id}`, lesson),
    delete: (id: string) => requests.del<void>(`/lessons/${id}`)
}

const Questions = {
    list: (lessonId: string, params: URLSearchParams) =>
        axios.get<PaginatedResult<Question[]>>(`/lessons/${lessonId}/questions`, { params })
            .then(responseBody),
    details: (lessonId: string, id: string) => requests.get<Question>(`/lessons/${lessonId}/questions/${id}`),
    create: (lessonId: string, question: QuestionFormValues) => requests.post<Question>(`/lessons/${lessonId}/questions`, question),
    update: (question: QuestionFormValues) => requests.put<void>(`/questions/${question.id}`, question),
    delete: (id: string) => requests.del<void>(`/questions/${id}`)
}

const Answers = {
    list: (questioId: string, params: URLSearchParams) =>
        axios.get<PaginatedResult<Answer[]>>(`/questions/${questioId}/answers`, { params })
            .then(responseBody),
    details: (questioId: string, id: string) => requests.get<Answer>(`/questions/${questioId}/answers/${id}`),
    create: (questionId: string, answer: AnswerFormValues) => requests.post<Answer>(`/questions/${questionId}/answers`, answer),
    submitAnswers: (data: any) => requests.post<Answer>(`/answers/submit_answers`, data),
    update: (answer: AnswerFormValues) => requests.put<void>(`/answers/${answer.id}`, answer),
    delete: (id: string) => requests.del<void>(`/answers/${id}`)
}

const Account = {
    current: () => requests.post<User>('/auth/me', {}),
    login: (user: UserFormValues) => requests.post<User>('/auth/login', user),
    register: (user: UserFormValues) => requests.post<User>('/signup', user),
    refreshToken: () => requests.post<User>('/account/refreshToken', {}),
    verifyEmail: (token: string, email: string) =>
        requests.post<void>(`/account/verifyEmail?token=${token}&email=${email}`, {}),
    resendEmailConfirm: (email: string) =>
        requests.get(`/account/resendEmailConfirmationLink?email=${email}`)
}

const agent = {
    Courses,
    Lessons,
    Questions,
    Answers,
    Account
}

export default agent;