import { useRecoilValue } from "recoil"
import { userAtom } from "../store/atoms/userAtom"
import { TopBar } from "../components/TopBar";
import { ProfileCard } from "../components/ProfileCard";
import { FriendsCard } from "../components/FriendsCard";
import { posts, requests, suggest } from "../assets/data";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { CustomButton } from "../components/CustomButton";
import { FileVideo, ImagePlay, ImagePlus, UserRoundPlus } from "lucide-react";
import { TextInput } from "../components/TextInput";
import { useForm } from "react-hook-form";
import { ErrMsg } from "../types";
import { Loading } from "../components/Loading";
import { PostCard } from "../components/PostCard";
import { EditProfile } from "../components/EditProfile";

export const Home = () => {
    
    const user = useRecoilValue(userAtom).user;
    const edit = useRecoilValue(userAtom).edit;
    const [friendRequest, setFriendRequest] = useState(requests);
    const [suggestedFriends, setSuggestedFriends] = useState(suggest);
    const {register, handleSubmit, formState:{ errors }} = useForm();
    const [errMsg, setErrMsg] = useState<ErrMsg>({
        message: "",
        status: ""
    });
    const [file, setFile] = useState<File | null>(null);
    const [posting, setPosting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmitii = () => {
        alert("Form submited")
    }

    

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]; // Use optional chaining

        if (!selectedFile) return; // Handle null case

        if (selectedFile.size > 5120 * 1024) {
            alert('File size exceeds 5MB!');
            return;
        }

        setFile(selectedFile); 
    };

    return (
        <>
        <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor  h-screen overflow-hidden">
            <TopBar />

            <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
                {/* LEFT */}
                <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
                    <ProfileCard user={user}/>
                    <FriendsCard friends={user?.friends} />
                </div>

                {/* CENTER */}
                <div className="flex-1 h-full  px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
                     {/* Description Input Box */}
                    <form 
                        className="bg-primary px-4 rounded-lg"
                        onSubmit={handleSubmit(handleSubmitii)}
                    >
                        <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                            <img 
                                src={user?.profileUrl ?? NoProfile} 
                                alt="User Image"
                                className="w-14 h-14 rounded-full object-cover"
                            /> 
                            <TextInput 
                                styles="w-full rounded-full py-5"
                                placeholder="What's on your mind"
                                register={register("description", {
                                    required: "Write something about post"
                                })}
                                error={errors.description ? String(errors.description.message) : ""}
                                name="description"       
                                type="text"                     
                            />
                            {errMsg?.message && (
                                <span 
                                    className={`text-sm ${
                                        errMsg.status == 'failed'
                                        ? "text-[#f64949fe]"
                                        : "text-[#2ba150fe]"
                                    } mt-0.5`}>
                                        {errMsg.message}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between py-4">
                            {/* Image */}
                            <label
                                htmlFor="imgUpload"
                                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                            >
                                <input 
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id='imgUpload'
                                    data-max-size = '5120'
                                    accept='.jpg, .png, .jpeg'
                                />
                                <ImagePlus />
                                <span>Image</span>
                            </label>
                            {/* Video */}
                            <label
                                htmlFor="videoUpload"
                                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                            >
                                <input 
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id='videoUpload'
                                    data-max-size = '5120'
                                    accept='.mp4, .wav'
                                />
                                <FileVideo />
                                <span>Video</span>
                            </label>
                            {/* GIF */}
                            <label
                                htmlFor="vgifUpload"
                                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                            >
                                <input 
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id='vgifUpload'
                                    data-max-size = '5120'
                                    accept='.gif'
                                />
                                <ImagePlay />
                                <span>GIF</span>
                            </label>
                            {/* Post Button */}
                            <div>
                                {posting ? (
                                    <Loading />
                                ) : (
                                    <CustomButton 
                                        type="submit"
                                        title="Post"
                                        containerStyles="hover:bg-blue bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                                    />
                                )}
                            </div>
                        </div>

                    </form>

                    {loading ? (<Loading />) : posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard key={post._id} post={post}
                                      user={user}
                                      deletePost={()=>{}}
                                      likePost={()=>{}}
                            />
                        ))
                    ) : (
                        <div className="flex w-full h-full items-center justify-center">
                            <p className="text-lg text-ascent-2"> No Post Available </p>
                        </div>

                    )}
                </div>

                {/* RIGHT */}
                <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto ">
                    {/* Friend Requests */}
                    <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
                        <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                             <span>Friend Request</span>
                             <span>{friendRequest.length}</span>
                        </div>
                        <div className="w-full flex flex-col gap-4 pt-4 ">
                            {
                                friendRequest.map(({_id, requestFrom: from}) => (
                                    <div 
                                        key={_id}
                                        className="flex items-center justify-between"
                                    >
                                        <Link 
                                            to={"/profile/"+ from._id}
                                            className="w-full flex gap-4 items-center cursor-pointer"
                                        >
                                            <img
                                                src={from.profileUrl ?? NoProfile} 
                                                alt={from.firstName} 
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="text-base font-medium text-ascent-1">
                                                    {from.firstName} {from.lastName}
                                                </p>
                                                <span className="text-sm text-ascent-2">
                                                    {from.profession ?? "No Profession"}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="flex gap-1">
                                            <CustomButton
                                                title="Add"
                                                containerStyles="bg-[#0444a4] text-xs text-white px-2 py-1 hover:bg-blue rounded-full"
                                            />
                                            <CustomButton
                                                title="Deny"
                                                containerStyles="border border-[#666] hover:bg-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                                            />
                                        </div>  
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* Friend Suggestion */}
                    <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
                        <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
                            <span>Friend Suggestion</span>
                        </div>
                        <div className="w-full flex flex-col gap-4 pt-4">
                            {
                                suggestedFriends.map((friend) => (
                                    <div
                                     key= {friend._id}
                                     className="flex items-center justify-between"
                                    >
                                        <Link 
                                            to={"/profile/" + friend._id}
                                            key={friend._id}
                                            className="w-full gap-4 flex items-center cursor-pointer"
                                        >
                                            <img 
                                                src={friend.profileUrl ?? NoProfile}
                                                alt={friend.firstName}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="text-base text-ascent-1 font-medium ">
                                                    {friend.firstName} {friend.lastName}
                                                </p>
                                                <span className="text-sm text-ascent-2">
                                                    {friend.profession ?? "No Profession"}
                                                </span>
                                            </div>
                                        </Link>
                                        <button className="bg-[#0444a430] text-sm text-white p-1 rounded " onClick={() => {}}>
                                            <UserRoundPlus size={20} className="text-[#0f52b6]" />
                                        </button>
                                    </div>
                                ) )
                            }

                        </div>

                    </div>
                </div>
            </div>
        </div>
        {edit && <EditProfile />}
        </>
    );
};