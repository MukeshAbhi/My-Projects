import { atom } from "recoil";
import { User } from "../../types";
import { user } from "../../assets/data";

type userAtom = {
    user: User | null;
    edit: boolean;
}

const defaultUser : User = user;
const storedUser = localStorage.getItem("user");

export const userAtom = atom<userAtom>({
    key:'userAtom',
    default: {
        user: storedUser ? JSON.parse(storedUser) : null,
        edit: false,
    },
});


