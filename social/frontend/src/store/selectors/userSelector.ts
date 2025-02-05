import {  selector } from "recoil";
import { userAtom } from "../atoms/userAtom";


export const loginSelector = selector({
    key: "loginSelector",
    get: ({get}) => get(userAtom).user,
    set: ({set}, newValue) => {
        if ( typeof newValue === "object" && newValue !== null && "user" in newValue)
            if (newValue?.user) {
                localStorage.setItem('user', JSON.stringify(newValue.user))
                set(userAtom, newValue)
            }
    }
}) 

export const logoutSelector = selector({
    key: "logoutSelector",
    get: ({get}) => get(userAtom).user,
    set: ({set}, newValue) => {
        localStorage.removeItem('user');
        set(userAtom,newValue)
    }
}) 

export const editUserSelector = selector<boolean>({
    key: "editUserSelector",
    get: ({get}) => get(userAtom).edit,
    set: ({set, get}, newValue) => {
        const currentUserState = get(userAtom);
        set(userAtom, {...currentUserState, edit: newValue as boolean} )
    }
})



