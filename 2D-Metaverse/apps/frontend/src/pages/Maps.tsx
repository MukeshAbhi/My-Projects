import NavBar from "../components/NavBar"

export const Maps = () => {


    const content = () => {

        const clickHandler = () => {
            alert("join")
        }
        return(
            <div className="ml-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <button className="hover:pt-2" onClick={clickHandler}>
                        <img src={"./public/images/map1thumbnail.png"} ></img>
                        <p className="text-lg text-orange-800 pt-1">Simple Map</p>
                    </button>
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