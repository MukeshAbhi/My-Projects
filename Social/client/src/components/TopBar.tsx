import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { themeAtom } from "../store/atoms/themeAtom"
import { userAtom } from "../store/atoms/userAtom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextInput } from "./TextInput";
import { CustomButton } from "./CustomButton";
import { Bell, Moon, Sun } from 'lucide-react';
import { themeSelector } from "../store/selectors/themeSelector";
import { useAuth } from "../customHooks/useAuth";
import { fetchPosts } from "../utils";
import { postAtom } from "../store/atoms/postAtom";


export const TopBar = () => {
    const theme = useRecoilValue(themeAtom);
    const setTheme = useSetRecoilState(themeSelector);
    const { user, login, logout } = useAuth();
    const [object, setObject] = useRecoilState(userAtom);
    const setPosts = useSetRecoilState(postAtom);

    const {register, handleSubmit, formState: {errors}} = useForm();

    const handleSearch = async ( data: any) => {
        await fetchPosts({
            token: user?.token as string,
            setPosts: setPosts,
            data: data,
        })
    };

    const clickHandler = () => {
        const themeValue = theme === "light" ? "dark" : "light";
        setTheme(themeValue);
    ;}

    return(
        <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
            <Link to='/' className="flex gap-2 items-center">
                <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white ">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
                        <path d="M350-63q-46 0-82.5-24T211-153q-16 21-40.5 32.5T120-109q-51 0-85.5-35T0-229q0-43 28-77.5T99-346q-14-20-21.5-42.5T70-436q0-40 20.5-75t57.5-57q5 18 13.5 38.5T181-494q-14 11-22 26.5t-8 32.5q0 56 46 69t87 21l19 32q-11 32-19 54.5t-8 40.5q0 30 21.5 52.5T350-143q38 0 63-34t41-80q16-46 24.5-93t13.5-72l78 21q-9 45-22 103t-36.5 110.5Q488-135 449.5-99T350-63ZM120-189q17 0 28.5-11.5T160-229q0-17-11.5-28.5T120-269q-17 0-28.5 11.5T80-229q0 17 11.5 28.5T120-189Zm284-158q-46-41-83.5-76.5t-64.5-69q-27-33.5-41.5-67T200-629q0-65 44.5-109.5T354-783q4 0 7 .5t7 .5q-4-10-6-20t-2-21q0-50 35-85t85-35q50 0 85 35t35 85q0 11-2 20.5t-6 19.5h14q60 0 102 38.5t50 95.5q-18-3-40.5-3t-41.5 2q-7-23-25.5-38T606-703q-35 0-54.5 20.5T498-623h-37q-35-41-54.5-60.5T354-703q-32 0-53 21t-21 53q0 23 13 47.5t36.5 52q23.5 27.5 57 58.5t74.5 67l-57 57Zm76-436q17 0 28.5-11.5T520-823q0-17-11.5-28.5T480-863q-17 0-28.5 11.5T440-823q0 17 11.5 28.5T480-783ZM609-63q-22 0-43.5-6T524-88q11-14 22-33t20-35q11 7 22 10t22 3q32 0 53.5-22.5T685-219q0-19-8-41t-19-54l19-32q42-8 87.5-21t45.5-69q0-40-29.5-58T716-512q-42 0-98 16t-131 41l-21-78q78-25 139-42t112-17q69 0 121 41t52 115q0 25-7.5 47.5T861-346q43 5 71 39.5t28 77.5q0 50-34.5 85T840-109q-26 0-50.5-11.5T749-153q-20 42-56.5 66T609-63Zm232-126q17 0 28-11.5t11-28.5q0-17-11.5-29T840-270q-17 0-28.5 11.5T800-230q0 17 12 29t29 12Zm-721-40Zm360-594Zm360 593Z"/>
                    </svg>
                </div>
                <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
                    Connect
                </span>
            </Link>

            <form
                className="hidden md:flex items-center justify-center"
                onSubmit={handleSubmit(handleSearch)}
                onChange={handleSubmit(handleSearch)}
            >
                <TextInput 
                    type="text"
                    placeholder="Search..."
                    styles={`w-[18rem] lg:w-[38rem] rounded-l-full py-3`}
                    register={register('search')} name={""}                />
                <CustomButton 
                    title="Search"
                    type="submit"
                    containerStyles={`bg-[#0444a4] text-white px-6 py-3 mt-2 rounded-r-full`}
                />
            </form>

            {/* ICONS */}
            <div className="pl-10 md:pl-0 lg:pl-0  flex gap-4 items-center text-ascent-1 text-md md:text-xl">
                <button onClick={clickHandler}>
                    {theme === "light" ? <Moon /> : <Sun />}
                </button>
                <div className="hidden lg:flex">
                    <Bell />
                </div>
            </div>
            <div>
                <CustomButton 
                    onClick={() => logout() }
                    title="Log Out"
                    containerStyles={`text-sm text-ascent-1 px-2 md:px-6 py-1 md:py-2 border border-[#666] rounded-full`}
                />
            </div>
        </div>
    )
}