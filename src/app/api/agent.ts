import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Course, CourseFormValues } from '../models/course';
import { PaginatedResult } from '../models/pagination';
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
    create: (course: CourseFormValues) => requests.post<void>('/courses', course),
    update: (course: CourseFormValues) => requests.put<void>(`/courses/${course.id}`, course),
    delete: (id: string) => requests.del<void>(`/courses/${id}`)
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
    Account
}

export default agent;