import { createContext, useContext } from "react";
import AnswerStore from "./answerStore";
import CommonStore from "./commonStore";
import CourseStore from "./courseStore";
import LessonStore from "./lessonStore";
import ModalStore from "./modalStore";
import QuestionStore from "./questionStore";
import UserStore from "./userStore";

interface Store {
    courseStore: CourseStore;
    lessonStore: LessonStore;
    questionStore: QuestionStore;
    answerStore: AnswerStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
}

export const store: Store = {
    courseStore: new CourseStore(),
    lessonStore: new LessonStore(),
    questionStore: new QuestionStore(),
    answerStore: new AnswerStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}