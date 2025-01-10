import NavBar from "../components/NavBar"


export const Avatars = () => {

    const content = ()=> {
        return (
           
                <div className=" flex justify-center ">
                    <div className="group">
                        <button className="w-60 py-10 px-10 hover:w-64">
                            <img className="w-full" src={"./public/images/adam.png"} alt="Adam" />
                        </button>
                        <div className="px-24">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="group-focus-within:fill-green-500"
                                height="40px"
                                viewBox="0 -960 960 960"
                                width="40px"
                                fill="#F19E39"
                            >
                                <path d="M422-297.33 704.67-580l-49.34-48.67L422-395.33l-118-118-48.67 48.66L422-297.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z" />
                            </svg>
                        </div>
                    </div>

                    
                    <div className="group">
                        <button className="w-64 py-10 px-10 hover:w-72">
                            <img className="w-full" src={"./public/images/alex.png"} alt="Alex" />
                        </button>
                        <div className="px-28 mt-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="group-focus-within:fill-green-500"
                                height="40px"
                                viewBox="0 -960 960 960"
                                width="40px"
                                fill="#F19E39"
                            >
                                <path d="M422-297.33 704.67-580l-49.34-48.67L422-395.33l-118-118-48.67 48.66L422-297.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z" />
                            </svg>
                        </div>
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