import { useRecoilState } from "recoil"
import { userAtom } from "../store/atoms/userAtom"
import { User } from "../types";



export const useAuth = () => {
    const [ profile, setProfile ] = useRecoilState(userAtom);

    const login = (data: any ) => {
        setProfile({ ...profile, user: data });
        localStorage.setItem("user", JSON.stringify(data));
    };

    const logout = () => {
        setProfile({ user: null, edit: false });
        localStorage.removeItem("user");
    }

    const updateUser = (data: User) => {
        setProfile({ ...profile, user: data})
    }

    return { user: profile.user, login, logout, updateUser };
} 