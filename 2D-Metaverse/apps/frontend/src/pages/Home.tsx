import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"

export const Home = () => {
    const navigate = useNavigate()

    const clickHandler = () => {
        navigate("/avatars")
    }

    const content = () => {
        return(
            <div>
                <div className= " w-full  bg-my-image3 h-96">
                    <div className=" font-body text-white text-6xl pl-24 pt-24 pb-5" >
                        Virtual HQ
                    </div>
                    <div className=" font-body text-white text-xl px-24 py-5">
                        "Alone, we can do so little; together, we can do so much." – Helen Keller
                    </div>
                    <button onClick={clickHandler} className="bg-customOrange text-center font-body text-white px-8 py-4 rounded-full mx-24 w-44 hover:bg-orange-300 focus:bg-orange-500">
                        Get Started
                    </button>
                </div>
                <div className="text-orange-500 mx-20 text-3xl mt-20 space-y-4">
                    " Welcome to our 2D Metaverse! Step into a vibrant world where creativity meets interactivity.
                    Our platform offers an immersive experience with real-time communication, dynamic character animations, and endless possibilities for exploration. Whether you're here to socialize, create, or embark on exciting adventures, the 2D Metaverse provides a unique space to connect with others, discover new places, and express yourself like never before.
                    Join us and be part of a growing community that’s shaping the future of virtual worlds! "
                </div>
                <div className="h-52">

                </div>
            </div>
        )
    }
    return(
        <div>
            <NavBar content={content()} />
        </div>
    )
}