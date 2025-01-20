import NavBar from "../components/NavBar"

export const Space  = () => {
    
    const content = () => {
        return(
            <div>
                
            </div>
        )
    }
    return(
        <div>
            <NavBar content={content()} />
        </div>
    )
}