export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    friends?: Friend[];
    views?: string[];
    verified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    profileUrl?: string;
    token?: string;
    profession?: string;
    location?: string;
  }

  export interface Friend {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    friends?: string[];
    views?: string[];
    verified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    profileUrl?: string;
    location?: string;
    profession?: string;
  }

  export interface Post {
    _id: string;
    userId: User;
    description: string;
    image?: string;
    likes?: string[]; // Array of user IDs who liked the post
    comments?: string[]; // Assuming comments are stored as an array of strings
    createdAt: string;
    updatedAt: string;
    __v?: number;
  }

  export interface PostComments {
    _id: string;
    userId: User;
    postId?: string;
    comment?: string;
    from?: string;
    likes?: string[];
    replies: Replay[];
    createdAt: string;
    updatedAt: string;
    __v?: number; 
  }

  export interface Replay {
    userId: User;
    from: string;
    replyAt: string;
    comment: string;
    created_At: string;
    updated_At: string;
    likes:[];
    _id: string;
  }

  export interface ErrMsg {
    message: string;
    status: string
}