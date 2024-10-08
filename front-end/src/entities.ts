
export type Userauthentication = {
    token: string
    userName: string
};

export type Userstatusprops = {
    isLogin: boolean
    loginUserName: string
    greetings?: string
    sessionId?: string
}

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

export type UsershortInforprops = {
    userName: string,
    name: string,
    image: string,
    displayImage: string
};

export type Userprops = {
    _id: string
    displayImage: string
    email: string
    userName: string
    name: string
    dateOfBirth: string
    country: string
    phoneNumber: number
    sex: string
    website: string
    bio: string
    timeline: string[]
    followers: string[]
    following: string[]
    interests: string[]
    notifications: Notificationsprops[]
    chatIds: string[]
};

export type Notificationsprops = {
    _id: string
    typeOfNotification: string
    msg: string
    url: string
    notifyFrom: string
    checked: boolean,
    pegs: Notificationsprops[] | []
}

export type Blogpostprops = {
    _id: string
    displayImage: string
    authorUserName: string
    title: string
    body: string
    _html: { title: string, body: string }
    catigory: string
    mentions: string
    slug: string
    url: string
    likes: string[]
    views: string[]
    shares: string[]
    status: string
    updatedAt: string
    createdAt: string
};

export type Commentprops = {
    _id: string
    authorUserName: string
    blogpostId: string
    parentId: string | null
    children: Commentprops[]
    parentUrl: string
    body: { _html: string, text: string }
    commentIsAReplyTo: string[]
    mentions: string
    likes: string[]
    shares: string[]
    updatedAt: string
    createdAt: string
};

export type Advaterprops = {
    _id: string
    fileName: string,
    size: number,
    uploader: string,
};
