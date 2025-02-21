import {  selector } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { User } from "../../types";

interface NewValue {
    user: User;
    edit: boolean
}

export const loginSelector = selector({
    key: "loginSelector",
    get: ({ get }) => get(userAtom).user,
    set: ({ set }, newValue) => {
        const typedValue = newValue as unknown as NewValue; // Cast newValue to NewValue
        if (typeof typedValue === "object" && typedValue !== null && "user" in typedValue) {
            if (typedValue?.user) {
                localStorage.setItem("user", JSON.stringify(typedValue.user));
                set(userAtom, typedValue); 
            }
        }
    },
});
 

export const logoutSelector = selector({
    key: "logoutSelector",
    get: ({get}) => get(userAtom).user,
    set: ({set}, newValue) => {
        const typedValue = newValue as unknown as NewValue;
        localStorage.removeItem('user');
        set(userAtom,typedValue)
    }
}) 







