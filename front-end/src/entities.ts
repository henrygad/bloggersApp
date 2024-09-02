

export type User = {
    id: number
    name: string
    isAdmin?: boolean
};

export type Userauthentication = {
    token: string
    userName: string
};

export type Login = {
    userName: string
    email: string
    password: string
};

export type Signup = {
    userName: string
    email: string
    password: string
};

export type Userprops = {
    _id: string
    displayImage: string
    email: string
    userName: string
    name: string
    dateOfBirth: string
    country: string
    phoneNumber: number,
    sex: string
    website: string
    bio: string
    timeline: string[]
    followers: string[]
    following: string[]
    interests: string[]
    notifications: string[]
    chatIds: string[]
    media: {
        avatersImages: string[]
        blogpostImages: string[]
    }
};

export type Blogpostprops = {
    _id: string
    displayImage: string,
    authorUserName: string,
    title: string,
    body: string,
    _html: { title: string, body: string },
    catigory: string,
    tags: string,
    mentions: string,
    slug: string,
    url: string,
    likes: Number,
    views: Number,
    status: string,
    updatedAt: string
    createdAt: string
};

export type Commentprops = {
    _id: string;
    parentBlogpostId: string
    parentCommentId: string
    authorUserName: string
    contentBody: { _html: string, wholeText: string }
    mentions: string[]
};

export type Quickuserinforprops = {
    userName: string,
    name: string,
    image: string,
    displayImage: string
};