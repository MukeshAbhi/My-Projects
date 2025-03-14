import { FC, useState } from "react";
import { ErrMsg, Post,  PostComments,  User } from "../types"
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import moment from "moment";
import { MessageSquare, ThumbsUp, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { TextInput } from "./TextInput";
import { Loading } from "./Loading";
import { CustomButton } from "./CustomButton";
import { postComments } from "../assets/data";

interface PostCardProps {
    post: Post ,
    user?: User | null;
    deletePost : (id: string) => void;
    likePost : (uri : string) => void;
}

interface CommentFormProps {
    user?: User | null;
    id: string;
    replayAt: string;
    getComments: (event: string) => void;
}
const CommentForm :FC<CommentFormProps>= ({user, id, replayAt, getComments}) => {
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<ErrMsg>({
        status: "",
        message: ""
    });
    const {register, handleSubmit, reset, formState:{ errors }} = useForm({
        mode: "onChange"
    });

    const onSubmit = () => {
        alert("done")
    }

    return(
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full border-b border-[#66666645]"
        >
            <div className="w-full flex items-center gap-2 py-4">
                <img
                    src={user?.profileUrl ?? NoProfile}
                    alt="User Image"
                    className="w-10 h-10 rounded-full object-cover"
                />

                <TextInput 
                    name="comment"
                    styles="w-full rounded-full py-3"
                    placeholder={replayAt ? `Replay @${replayAt}` : "Comment this post"}
                    register={register("comment", {
                        required:"Comment can not be empty"
                    })}
                    error={errors.comment ? String(errors.comment.message) : ""}
                />
            </div>
            {errMsg.message && (
                    <span 
                        role="alert"
                        className={`text-sm ${
                            errMsg.status === "failed"
                                ? "text-[#f64949fe]"
                                : "text-[#2ba150fe]"
                        } mt-0.5` }
                    >
                        {errMsg.message}
                    </span>
                )}

                <div className="flex items-end justify-end pb-2">
                    {loading ? (
                        <Loading />
                    ) : (
                        <CustomButton
                            title="Submit"
                            type="submit"
                            containerStyles="bg-[#0444a4] text-white py-2 px-3 rounded-full font-semibold text-sm"
                        />
                    )}
                </div>

        </form>
    )
}

export const PostCard : FC<PostCardProps> = ({ post, user, deletePost, likePost }) => {

    const [showAll, setShowAll] = useState("");
    const [showReplay, setShowReplay] = useState("");
    const [comments, setComments] = useState<PostComments[]>([]);
    const [loading, setLoading] = useState(false);
    const [replayComments, setReplayComments] = useState("");
    const [showComments, setShowComments] = useState<string | null>('') ;

    const getComments  = async (id : string) => {
        setReplayComments("");
        setComments(postComments as PostComments[]);
        setLoading(false)
    }

    const handleLike = async (uri : string) => {
        likePost(uri);
        await getComments(post._id);
    }

    const handleDelete = async (id : string) => {
        deletePost(id)
        
    } 
    return(
        <div className="mb-2 bg-primary p-4 rounded-xl">
            <div className="flex gap-3 items-center mb-2">
                <Link to={`/profile/${post.userId._id}`}>
                    <img 
                        src={post.userId.profileUrl ?? NoProfile}
                        alt={post.userId.firstName}
                        className="w-14 h-14 object-cover rounded-full"
                    />
                </Link>
                <div className="w-full flex justify-between">
                    <div>
                        <Link to={`/profile/${post.userId._id}`}>
                            <p className="font-medium text-lg text-ascent-1">
                                {post.userId.firstName} {post.userId.lastName}
                            </p>
                        </Link>
                        <span className="text-sm text-ascent-2">{post.userId.location}</span>
                    </div>
                    <span className="text-ascent-2">
                        {moment(post.createdAt ?? "2024-05-25").fromNow()}
                    </span>
                </div>
            </div>

            <div>
                {/* Text */}
                <p className="text-ascent-2">
                    {
                        showAll === post._id  ? post.description : post.description.slice(0,300)
                    }
                    {
                        post.description.length > 301 && ( 
                            showAll === post._id 
                            ? <span 
                                className="text-blue ml-2 font-medium cursor-pointer"
                                onClick={() => setShowAll("z")}
                              >
                                Show Less
                              </span> 
                            : <span 
                                className="text-blue ml-2 font-medium cursor-pointer"
                                onClick={() => setShowAll(post._id)}
                              >
                                Show More
                              </span>
                        )
                    }
                </p>
                {/*Image */}
                {   post.image && (
                        <img 
                            src={post.image}
                            alt='post image'
                            className="w-full mt-2 rounded-lg"
                        />
                    )
                }
                {/*Like Comment Delete box */}
                <div className="mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]">
                    <p
                        className="flex gap-2 items-center text-base cursor-pointer"
                        onClick={() => handleLike("post/like/" + post._id)}
                    >
                        {post.likes?.includes(user?._id as string) ? (
                            <ThumbsUp size={20} className="text-blue" />
                        ) : (
                            <ThumbsUp size={20} />
                        )}
                        {post.likes?.length} { post.likes?.length && post.likes?.length  > 1 ? "Likes" : "Like"}
                    </p>

                    <p className="flex gap-2 items-center text-base cursor-pointer"
                       onClick={()=> {
                            setShowComments(showComments === post._id ? null : post._id);
                            getComments(post._id)
                       }}
                    >
                        <MessageSquare size={20} />
                        {post.comments?.length ?? 0} { (post.comments?.length ?? 0) > 1 ? "Comments" : "Comment"}

                    </p>

                    {user?._id === post.userId._id && 
                        <div className="flex items-center gap-1 cursor-pointer text-base text-ascent-2"
                             onClick={() =>handleDelete(post._id)}
                        >
                            <Trash2 size={20}/>
                            <span>Delete</span>
                        </div>
                    }
                </div>
                {/* Display Comments */}
                {showComments === post._id && 
                <div className="w-full mt-4 bordeer-t border-[#66666645] pt-4">
                    <CommentForm
                            user={user}
                            id={post._id}
                            getComments={() => getComments(post._id)} replayAt={""}                     
                    />
                    {loading ? (<Loading />) : 
                        comments.length > 0 ? (
                            comments.map((comment) => (
                                <div className="w-full py-2" key={comment._id}> 
                                    <div className="flex gap-3 items-center mb-1">
                                        <Link to={`/profile/${comment.userId._id}`}>
                                            <img 
                                                src={comment.userId.profileUrl ?? NoProfile}
                                                alt={comment.userId.firstName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </Link>
                                        <div>
                                            <Link to={`/profile/${comment.userId._id}`}>
                                                <p className="font-medium text-base text-ascent-1">
                                                    {comment.userId.firstName} {comment.userId.lastName}
                                                </p>
                                            </Link>
                                            <span className="text-ascent-2 text-sm">
                                                {moment(comment.createdAt ?? "2024-05-30").fromNow()}
                                            </span>
                                        </div>    
                                           
                                    </div>

                                    <div className="ml-12">
                                        <p className="text-ascent-2">
                                            {comment.comment}
                                        </p>
                                        {/*Like, replay */}
                                        <div className="mt-2 flex gap-6">
                                            <p className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer">
                                                {" "}
                                                {comment.likes?.includes(user?._id as string) ? (
                                                    <ThumbsUp size={20} color="blue" />
                                                ) : (
                                                    <ThumbsUp size={20} />
                                                )}
                                                {comment.likes?.length} {comment.likes?.length && comment.likes?.length > 1 ? "Likes" : "Like"}
                                            </p>
                                           
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span className="flex text-sm py-4 text-ascent-2 text-center">
                                No Comments, be the First to comment
                            </span>
                        )
                    }
                </div>}
            </div>
            
        </div>
    )
}