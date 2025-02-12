import { useRecoilValue } from "recoil"
import { userAtom } from "../store/atoms/userAtom"
import { TopBar } from "../components/TopBar";
import { ProfileCard } from "../components/ProfileCard";


export const Home = () => {
    const user = useRecoilValue(userAtom).user;
    return (
        <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor  h-screen overflow-hidden">
            <TopBar />

            <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
                {/* LEFT */}
                <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
                    <ProfileCard user={user}/>
                    
                </div>
                {/* CENTER */}
                <div>
                    
                </div>
                {/* RIGHT */}
                <div>
                    
                </div>

            </div>
        </div>
    )
}