import { Link } from "react-router-dom"

export const Signup = () => {
    return (
        <div className=" flex h-screen ">
            <div className="  bg-white h-full w-1/2  flex items-center justify-center ">
                <div className=" w-1/2 border border-customOrange border-opacity-20">
                    <div className="flex justify-center font-body text-4xl font-bold py-4 text-customOrange ">
                        <h1>Signup</h1>
                    </div>
                    <div className="flex justify-center">
                        <form>
                            <div className="flex items-center  py-4 ">
                                <label htmlFor="avatar-name" className="bg-customOrange h-8 flex items-center rounded-l-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>
                                </label>
                                <input required className="px-1 rounded-r-md border h-8 border-customOrange focus:px-1 focus:rounded-r-md  focus:outline-none " type="text" id="avatar-name" name="avatar-name" placeholder="Avatarname"  />
                            </div>

                            <div className="flex items-center py-4">
                                <label htmlFor=" email" className="bg-customOrange h-8 rounded-l-md">
                                    <span className="text-white font-body w-6 flex justify-center" >@</span>
                                </label>
                                <input required className="px-1 rounded-r-md border h-8 border-customOrange focus:px-1 focus:rounded-r-md  focus:outline-none " type="text" id="email" name="email" placeholder="Email" /> 
                            </div>

                            <div className="flex items-center py-4  h-8 " >
                                <label htmlFor="password" className="bg-customOrange  h-8 flex items-center rounded-l-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="23px" viewBox="0 -960 960 960" width="23px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
                                </label>
                                <input required className="px-1 rounded-r-md border h-8 border-customOrange focus:px-1 focus:rounded-r-md  focus:outline-none " type="password" id="password" name="password" placeholder="Password" />
                            </div>

                            <div className="flex items-center  py-4" >
                                <label htmlFor="repeat-password" className="bg-customOrange h-8 flex items-center rounded-l-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="23px" viewBox="0 -960 960 960" width="23px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
                                </label>
                                <input required className="px-1 rounded-r-md border h-8 border-customOrange focus:px-1 focus:rounded-r-md  focus:outline-none " type="password" id="repeat-password" name="repeat-password" placeholder="Repeat Password"  />
                            </div>

                            <div className="flex items-center justify-center py-4" >
                                <button className="bg-customOrange text-yellow-200 py-2 px-4 rounded">Submit</button>
                            </div>

                            <div className="flex items-center gap-2 py-4">
                                <div className="text-customOrange">Already have an Account? </div> <div className="underline text-orange-900"> <Link to="/signin" >Login </Link></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className=" bg-my-image bg-cover bg-right overflow-hidden bg-white h-full w-1/2  ">
                <div className="flex items-center justify-center h-screen">
                    <div className="font-body text-center font-semibold text-2xl">"Alone, we can do so little; together, we can do so much." – Helen Keller</div>
                </div>
            </div>
        </div>
    )
} 