import { atom } from "recoil";

type userAtom = {
    user: any;
    edit: boolean;
}

const storedUser = localStorage.getItem("user");

export const userAtom = atom<userAtom>({
    key:'userAtom',
    default: {
        user: storedUser ? JSON.parse(storedUser) : null,
        edit: false,
    },
});


