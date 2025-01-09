import { useState } from "react"
import { Link } from "react-router-dom"

export const Login = () => {
    
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>('');
    
    const [error, setError] = useState<string[]>([]);

    const submitHandler = (e : React.FormEvent) => {
        const newErrors : string[] = [];
        e.preventDefault();

            if (!email || email.trim() === '') {
                newErrors.push("Email is required");
            }
            if (!password || password.trim() === '') {
                newErrors.push("Password is required");
            }
            if (password.length !== 0 && password?.length < 7) {
                newErrors.push("Minimum 7 character required");
            }
          
            console.log(newErrors)
        setError(newErrors);

        if (newErrors.length === 0){
            alert("Form Submitted")
        }

        
};

    return (
        <div className="sm:flex h-screen flex-col sm:flex-row">
            {/* left Section */}
            <div className=" hidden sm:block bg-my-image bg-cover bg-center sm:bg-left overflow-hidden bg-white h-full w-full sm:w-1/2">
                <div className="flex items-center justify-center h-screen p-4">
                    <div className="font-body text-center font-semibold text-lg sm:text-2xl">
                        "Alone, we can do so little; together, we can do so much." – Helen Keller
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="bg-white h-full w-full sm:w-1/2 flex items-center justify-center p-4">
                <div className="w-full sm:w-3/4 lg:w-1/2 border border-customOrange border-opacity-20 p-4">
                    <div className="flex justify-center font-body text-4xl font-bold py-4 text-customOrange">
                        <h1>Login</h1>
                    </div>
                <div className="flex justify-center">
                    <form onSubmit={(e) => submitHandler(e)}>
                        {/* Error message */}
                        {error.length === 0 && <div></div>}
                        {error.length > 0 && <div className="text-red-600 font-body text-xs">{error.join(', ')}</div>}
                   

                    {/* Email */}
                    <div className="flex items-center group py-4">
                        <label
                        htmlFor="email"
                        className="bg-customOrange group-focus-within:bg-orange-600 transition-colors h-8 w-8 flex items-center justify-center rounded-l-md"
                        >
                        <span className="text-white font-body w-6 flex justify-center">@</span>
                        </label>
                        <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-1 rounded-r-md border h-8 focus:px-1 focus:rounded-r-md focus:outline-none hover:rounded-r-md hover:border hover:border-customOrange hover:border-opacity-90 w-full"
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center group py-4">
                        <label
                        htmlFor="password"
                        className="bg-customOrange group-focus-within:bg-orange-600 transition-colors h-8 w-8 flex items-center justify-center rounded-l-md"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="23px"
                            viewBox="0 -960 960 960"
                            width="23px"
                            fill="#e8eaed"
                        >
                            <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                        </svg>
                        </label>
                        <input
                        
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        className="px-1 rounded-r-md border h-8 focus:px-1 focus:rounded-r-md focus:outline-none hover:rounded-r-md hover:border hover:border-customOrange hover:border-opacity-90 w-full"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        />
                    </div>

                  

                    {/* Login Button */}
                    <div className="flex items-center justify-center py-4">
                        <button type="submit" className="bg-customOrange text-yellow-200 font-semibold py-2 px-6 rounded-3xl focus:bg-orange-600 hover:bg-orange-500">
                        Login
                        </button>
                    </div>

                    {/* Signup Redirect */}
                    <div className="flex items-center gap-2 py-4 ">
                        <div className="text-customOrange">Don't have an Account?</div>
                        <div className="underline text-orange-900 hover:text-red-500">
                        <Link to="/signup">Signup</Link>
                        </div>
                    </div>
                    </form>
                </div>
                </div>
            </div>


        </div>

    )
} 