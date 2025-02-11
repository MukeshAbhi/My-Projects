import { atom } from "recoil";
import { User } from "../../types";

type userAtom = {
    user: User;
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


