import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import CourseStore from "./courseStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";

interface Store {
    courseStore: CourseStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
}

export const store: Store = {
    courseStore: new CourseStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}