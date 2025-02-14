import { FC, useState } from "react";
import { Post, User } from "../types"
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import moment from "moment";
import { MessageSquare, ThumbsUp, Trash2 } from "lucide-react";

interface PostCardProps {
    post: Post;
    user?: User | null;
    deletePost : (event: string) => void;
    likePost : (event: React.MouseEvent<HTMLButtonElement>) => void;
}



export const PostCard : FC<PostCardProps> = ({ post, user, deletePost, likePost }) => {

    const [showAll, setShowAll] = useState("");
    const [showReplay, setShowReplay] = useState(0);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [replayComments, setReplayComments] = useState(0);
    const [showComments, setShowComments] = useState('');

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
                    >
                        {post.likes?.includes(user?._id) ? (
                            <ThumbsUp size={20} className="text-blue" />
                        ) : (
                            <ThumbsUp size={20} />
                        )}
                        {post.likes?.length} {post.likes?.length ?? 1 > 1 ? "Likes" : "Like"}
                    </p>

                    <p className="flex gap-2 items-center text-base cursor-pointer"
                       onClick={()=> {
                            setShowComments(showComments === post._id ? null : post._id)
                       }}
                    >
                        <MessageSquare size={20} />
                        {post.comments?.length} {post.comments?.length ?? 1 > 1 ? "Comments" : "Comment"} 
                    </p>

                    {user?._id === post.userId._id && 
                        <div className="flex items-center gap-1 cursor-pointer text-base text-ascent-2"
                             onClick={() => deletePost(post._id)}
                        >
                            <Trash2 size={20}/>
                            <span>Delete</span>
                        </div>
                    }
                </div>
            </div>
            
        </div>
    )
}