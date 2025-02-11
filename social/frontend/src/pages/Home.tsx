import { useRecoilValue } from "recoil"
import { userAtom } from "../store/atoms/userAtom"
import { TopBar } from "../components/TopBar";


export const Home = () => {
    const user = useRecoilValue(userAtom).user;
    return (
        <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
            <TopBar />
        </div>
    )
}