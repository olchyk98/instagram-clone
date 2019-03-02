const fs = require('fs');
const https = require('https');

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const {
    AuthenticationError,
    GraphQLUpload,
    PubSub,
    withFilter
} = require('apollo-server');

const pubsub = new PubSub();

const {
    User,
    Post,
    Comment,
    Media,
    Hashtag,
    Conversation,
    Message,
    Notification
} = require('./models');

// 
// const ffmpeg = require('fluent-ffmpeg');
// const mobilenet = require('@tensorflow-models/mobilenet');
//
// const IClassifier = require('./mobilenet');
// let ICLModel = null;
// (async () => {
//     ICLModel = await mobilenet.load();
//     console.log("MobileNet model was successfully loaded.");
// })();
//
// async function mobilenet_classify(url) {
//     if(ICLModel) {
//         return await IClassifier(ICLModel, url);
//     } else {
//         console.log("An image was didn't classified because mobilenet model wasn't loaded yet");
//         return "";
//     }
// }
//

// Stuff
function generateNoise(l = 256) {
    let a = "",
        b = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'; // lib

    for(let ma = 0; ma < l; ma++) {
        a += b[Math.floor(Math.random() * b.length)];
    }

    return a;
}

const str = a => a.toString();

const getExtension = a => a.match(/[^\\]*\.(\w+)$/)[1];

// Schema Types
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        login: { type: GraphQLString },
        name: { type: GraphQLString },
        bio: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        getName: {
            type: GraphQLString,
            resolve: ({ name, login }) => name || login
        },
        password: { type: GraphQLString },
        savedPostsID: { type: new GraphQLList(GraphQLID) },
        registeredByExternal: { type: GraphQLBoolean },
        savedPosts: {
            type: new GraphQLList(PostType),
            args: {
                limit: { type: GraphQLInt },
                cursorID: { type: GraphQLID }
            },
            resolve({ savedPosts }, { limit, cursorID }) {
                const query = {
                    _id: {
                        $in: savedPosts
                    }
                }

                if(cursorID) {
                    query._id = {
                        $gt: cursorID
                    }
                }

                return Post.find(query).limit(limit || 0);
            }
        },
        taggedPosts: {
            type: new GraphQLList(PostType),
            args: {
                limit: { type: GraphQLInt },
                cursorID: { type: GraphQLID }
            },
            resolve({ id }, { limit, cursorID }) {
                const query = {
                    people: {
                        $in: [str(id)]
                    }
                }

                if(cursorID) {
                    query._id = {
                        $gt: cursorID
                    }
                }

                return Post.find(query).limit(limit || 0);
            }
        },
        avatar: { type: GraphQLString },
        authTokens: { type: new GraphQLList(GraphQLString) },
        lastAuthToken: {
            type: GraphQLString,
            resolve: ({ authTokens }) => authTokens.slice(-1)[0] || null
        },
        isVerified: { type: GraphQLBoolean },
        subscribedTo: { type: new GraphQLList(GraphQLID) },
        followingInt: {
            type: GraphQLInt,
            resolve: ({ subscribedTo }) => subscribedTo.length
        },
        isFollowing: {
            type: GraphQLBoolean,
            async resolve({ id }, _, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                if(req.session.id === id) return null;

                const a = await User.findById(req.session.id).select("subscribedTo");

                return a.subscribedTo.includes(id);
            }
        },
        feed: {
            type: new GraphQLList(PostType),
            args: {
                limit: { type: GraphQLInt },
                cursorID: { type: GraphQLID }
            },
            async resolve({ id, subscribedTo }, { limit, cursorID }) {
                // DONE: Include followed tags
                // Get followed tags
                let tags = await Hashtag.find({
                    subscribers: {
                        $in: [str(id)]
                    }
                }).select("name");

                // Take just their name
                tags = tags.map(io => io.name);

                // Search for the posts
                const query = {
                    $or: [
                        {
                            creatorID: {
                                $in: subscribedTo
                            }
                        },
                        {
                            creatorID: str(id)
                        },
                        {
                            hashtags: {
                                $in: tags
                            }
                        }
                    ]
                }

                if(cursorID) query._id = {
                    $lt: cursorID
                }

                return Post.find(query).sort({ time: -1 }).limit(limit || 0);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            args: {
                limit: { type: GraphQLInt },
                cursorID: { type: GraphQLID }
            },
            resolve({ id }, { limit, cursorID }) {
                const query = {
                    creatorID: str(id)
                }

                if(cursorID) {
                    query._id = {
                        $gt: cursorID
                    }
                }

                return Post.find(query).limit(limit || 0);
            }
        },
        postsInt: {
            type: GraphQLInt,
            resolve: ({ id }) => Post.countDocuments({
                creatorID: str(id)
            })
        },
        followersInt: {
            type: GraphQLInt,
            resolve: ({ id }) => User.countDocuments({
                subscribedTo: {
                    $in: [str(id)]
                }
            })
        },
        conversations: {
            type: new GraphQLList(ConversationType),
            resolve: ({ id }) => Conversation.find({
                conversors: {
                    $in: [str(id)]
                }
            })
        }
    })
});

const MediaType = new GraphQLObjectType({
    name: "Media",
    fields: () => ({
        id: { type: GraphQLID },
        altDescription: { type: GraphQLString },
        url: { type: GraphQLString },
        type: { type: GraphQLString },
        postID: { type: GraphQLString }
    })
});

const CommentType = new GraphQLObjectType({
    name: "Comment",
    fields: () => ({
        id: { type: GraphQLID },
        postID: { type: GraphQLID },
        creatorID: { type: GraphQLID },
        content: { type: GraphQLString },
        likes: { type: new GraphQLList(GraphQLID) },
        isLiked: {
            type: GraphQLBoolean,
            resolve: ({ likes }, _, { req: { session: { id } } }) => (id) ? likes.includes(id) : false
        },
        time: { type: GraphQLString },
        creator: {
            type: UserType,
            resolve: ({ creatorID }) => User.findById(creatorID)
        },
        post: {
            type: PostType,
            resolve: ({ postID }) => Post.findById(postID)
        }
    })
})

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLID },
        creatorID: { type: GraphQLID },
        creator: {
            type: UserType,
            resolve: ({ creatorID }) => User.findById(creatorID)
        },
        likes: { type: new GraphQLList(GraphQLID) },
        likesInt: {
            type: GraphQLInt,
            resolve: ({ likes }) => likes.length
        },
        isLiked: {
            type: GraphQLBoolean,
            resolve: ({ likes }, _, { req: { session: { id } } }) => (id) ? likes.includes(id) : false
        },
        hashtags: { type: new GraphQLList(GraphQLString) },
        inBookmarks: {
            type: GraphQLBoolean,
            resolve: async ({ id }, _, { req: { session: { id: clientID } } }) => {
                const a = await User.findById(clientID).select("savedPosts");
                return a.savedPosts.includes(str(id))
            }
        },
        time: { type: GraphQLString },
        peopleID: { type: new GraphQLList(GraphQLID) },
        people: {
            type: new GraphQLList(UserType),
            resolve: ({ people }) => User.find({
                _id: {
                    $in: people
                }
            })
        },
        preview: {
            type: MediaType,
            async resolve({ id }) {
                const a = await Media.findOne({
                    postID: str(id)
                });

                return a;
            }
        },
        places: { type: new GraphQLList(GraphQLString) },
        media: {
            type: new GraphQLList(MediaType),
            resolve: ({ id }) => Media.find({
                postID: str(id)
            })
        },
        comments: {
            type: new GraphQLList(CommentType),
            args: {
                limit: { type: GraphQLInt },
                cursorID: { type: GraphQLID }
            },
            async  resolve({ id }, { limit, cursorID }) {
                const query = {
                    postID: str(id)
                }

                if(cursorID) {
                    query._id = {
                        $lt: cursorID
                    }
                }

                const a = await Comment.find(query).sort({ time: -1 }).limit(limit || 0);

                return a.reverse();
            }
        },
        commentsInt: {
            type: GraphQLInt,
            resolve: ({ id }) =>  Comment.countDocuments({
                postID: str(id)
            })
        },
        text: { type: GraphQLString },
        isMultimedia: {
            type: GraphQLBoolean,
            async resolve({ id }) {
                const a = await Media.countDocuments({
                    postID: str(id)
                });

                return a > 1;
            }
        }
    })
});

const HashtagType = new GraphQLObjectType({
    name: "Hashtag",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        subscribers: { type: new GraphQLList(GraphQLID) },
        isFollowing: {
            type: GraphQLBoolean,
            resolve: ({ subscribers }, _, { req }) => (req.session.id) ? subscribers.includes(req.session.id) : false
        },
        postsInt: {
            type: GraphQLInt,
            resolve: ({ name }) => Post.countDocuments({
                hashtags: {
                    $in: [name]
                }
            }).sort({ time: -1 })
        },
        posts: {
            type: new GraphQLList(PostType),
            args: {
                cursorID: { type: GraphQLID },
                limit: { type: GraphQLInt }
            },
            resolve({ name }, { cursorID, limit }) {
                const query = {
                    hashtags: {
                        $in: [name]
                    }
                }

                if(cursorID) {
                    query._id = {
                        $lt: cursorID
                    }
                }

                return Post.find(query).sort({ time: -1 }).limit(limit || 0);
            }
        }
    })
});

const ConversationType = new GraphQLObjectType({
    name: "Conversation",
    fields: () => ({
        id: { type: GraphQLID },
        conversorsID: {
            type: new GraphQLList(GraphQLID),
            resolve: ({ conversors }) => conversors
        },
        conversors: {
            type: new GraphQLList(UserType),
            resolve: ({ conversors }) => User.find({
                _id: {
                    $in: conversors
                }
            })
        },
        conv: {
            type: UserType,
            resolve: ({ conversors }, _, { req }) => User.findById(conversors.find(io => io !== req.session.id))
        },
        lastMessage: {
            type: MessageType,
            resolve({ id }) {
                return Message.findOne({
                    conversationID: str(id)
                }).sort({ time: -1 });
            }
        },
        messagesInt: {
            type: GraphQLInt,
            async resolve({ id }) {
                const a = Message.countDocuments({
                    conversationID: id
                });

                return a || 0;
            }
        },
        messages: {
            type: new GraphQLList(MessageType),
            args: {
                cursorID: { type: GraphQLID },
                limit: { type: GraphQLInt }
            },
            resolve({ id }, { cursorID, limit }) {
                const query = {
                    conversationID: id
                }

                if(cursorID) {
                    query._id = {
                        $lt: cursorID
                    }
                }

                return Message.find(query).limit(limit || 0).sort({ time: -1 });
            }
        }
    })
});

const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        id: { type: GraphQLID },
        content: { type: GraphQLString },
        creatorID: { type: GraphQLID },
        creator: {
            type: UserType,
            resolve: ({ creatorID }) => User.findById(creatorID)
        },
        type: { type: GraphQLString }, // DEFAULT, LIKE, IMAGE
        conversationID: { type: GraphQLID },
        conversation: {
            type: ConversationType,
            resolve: ({ conversationID }) => Conversation.findById(conversationID)
        },
        time: { type: GraphQLString },
        seen: { type: GraphQLBoolean }
    })
});

const NotificationType = new GraphQLObjectType({
    name: "Notification",
    fields: {
        id: { type: GraphQLID },
        action: { type: GraphQLString },
        initID: { type: GraphQLID },
        init: {
            type: UserType,
            resolve: ({ initID }) => User.findById(initID)
        },
        time: { type: GraphQLString },
        influencedID: { type: new GraphQLList(GraphQLID) },
        influenced: {
            type: new GraphQLList(UserType),
            resolve: ({ influenced }) => User.find({
                _id: {
                    $in: influenced
                }
            })
        },
        subContent: { type: GraphQLString },
        composeID: { type: GraphQLID } // POST/USER
    }
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        // --- DEVELOPMENT ---
        users: {
            type: new GraphQLList(UserType),
            resolve: () => User.find({})
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: () => Post.find({})
        },
        // --- DEVELOPMENT ---
        user: {
            type: UserType,
            args: {
                targetID: { type: GraphQLID },
                url: { type: GraphQLString }
            },
            resolve(_, { targetID, url }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                if(!url) {
                    return User.findById(targetID || req.session.id);
                } else {
                    return User.findOne({
                        login: url
                    });
                }
            }
        },
        validateUser: { // Validate if user with this email | login exists
            type: new GraphQLList(GraphQLBoolean),
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                login: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { email, login }) {
                if(!email && !login) return [null, null];

                let a = [];

                if(email) {
                    if(await User.findOne({ email })) a[0] = false;
                    else a[0] = true;
                } else {
                    a[0] = null;
                }
                if(login) {
                    if(await User.findOne({ login })) a[1] = false;
                    else a[1] = true;
                } else {
                    a[1] = null;
                }

                return a;
            }
        },
        searchPeople: {
            type: new GraphQLList(UserType),
            args: {
                query: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(_, { query }, { req }) {
                const a = new RegExp(query, "i");

                return User.find({
                    $or: [
                        { name: a },
                        { login: a }
                    ],
                    _id: {
                        $ne: req.session.id
                    }
                }).limit(20);
            }
        },
        post: {
            type: PostType,
            args: {
                targetID: { type: new GraphQLNonNull(GraphQLID) } 
            },
            resolve: (_, { targetID }) => Post.findById(targetID)
        },
        getHashtag: {
            type: HashtagType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, { name }) => Hashtag.findOne({ name })
        },
        searchPeople: {
            type: new GraphQLList(UserType),
            args: {
                query: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(_, { query }) {
                const a_query = new RegExp(query, "i");

                return User.find({
                    $or: [
                        { login: a_query },
                        { email: a_query },
                        { name: a_query }
                    ]
                });
            }
        },
        searchHashtags: {
            type: new GraphQLList(HashtagType),
            args: {
                query: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, { query }) => Hashtag.find({
                $or: [
                    { name: new RegExp(query, "i") },
                    { name: new RegExp("#" + query, "i") }
                ]
            })
        },
        explorePosts: {
            type: new GraphQLList(PostType),
            async resolve(_, __, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await Post.aggregate([
                    { $match: {
                        _id: {
                            $ne: req.session.id
                        }
                    }},
                ]).sample(15).exec();

                return new Promise((resolve, reject) => {
                    const b = [];

                    a.forEach(io => b.push(new Post(io)));

                    resolve(b);
                });
            }
        },
        conversation: {
            type: ConversationType,
            args: {
                targetID: { type: new GraphQLNonNull(GraphQLID) },
                seeMessages: { type: GraphQLBoolean }
            },
            async resolve(_, { targetID, seeMessages }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await Conversation.findOne({
                    _id: targetID,
                    conversors: {
                        $in: [req.session.id]
                    }
                });

                if(!a) return null;

                if(seeMessages) {
                    await Message.updateMany({
                        conversationID: str(a._id),
                        creatorID: {
                            $ne: req.session.id
                        }
                    }, {
                        seen: true
                    });
                }

                return a;
            }
        },
        myNotifications: {
            type: new GraphQLList(NotificationType),
            args: {
                deleteOnFetch: { type: GraphQLBoolean }
            },
            async resolve(_, { deleteOnFetch }, { req }) {
                 if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await Notification.find({
                    influencedID: {
                        $in: [req.session.id]
                    }
                });

                if(deleteOnFetch) {
                    await Notification.bulkWrite([
                        {
                            updateMany: {
                                $pull: {
                                    influencedID: req.session.id
                                }
                            }  
                        },
                        {
                            deleteMany: {
                                influencedID: []
                            }
                        }
                    ], {
                        ordered: true
                    });

//                     await Notification.updateMany({
//                         $pull: {
//                             influencedID: req.session.id
//                         }
//                     });
// 
//                     await Notification.deleteMany({
//                         influencedID: []
//                     });
                }

                return a;
            }
        }
    }
});

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        registerUser: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                login: { type: GraphQLString },
                pictureURL: { type: GraphQLString },
                password: { type: new GraphQLNonNull(GraphQLString) },
                byExternal: { type: GraphQLBoolean }
            },
            async resolve(_, { email, name, login, password, pictureURL, byExternal }, { req }) {
                if(!byExternal) {
                    const a = await User.findOne({
                        $or: [
                            { email },
                            { login }
                        ]
                    });
                    if(a) return new Error("User with that email or login already exists!");
                }

                const _a = false;

                if(byExternal) {
                    const b = await User.findOne({
                        email,
                        registeredByExternal: true
                    });

                    if(b) {
                        const token = generateNoise();

                        await b.updateOne({
                            $push: {
                                authTokens: token
                            }
                        });

                        req.session.id = str(b._id);
                        req.session.authToken = token;

                        return b;
                    }
                }

                if(!_a) {
                    const token = generateNoise();
                    let avatar = "/files/default/avatar.jpg";

                    if(!login) { // If login wasn't passed -> generate a new one
                        async function genLogin() {
                            const a = generateNoise(12);

                            const b = await User.findOne({
                                login: a
                            });

                            if(!b) return a;
                            else return genLogin();
                        }

                        login = await genLogin();
                    }

                    if(pictureURL) {
                        const stream = await (new Promise((resolve) => {
                            https.get(pictureURL, response => {
                                resolve(response);
                            });
                        }));

                        // ORIGINAL: .jpg (.jpeg), MODIFIED: .png
                        avatar = `/files/avatars/${ generateNoise(128) }.png`;
                        stream.pipe(fs.createWriteStream('.' + avatar));
                    }

                    const b = await (
                        new User({
                            login,
                            name,
                            bio: "",
                            email,
                            gender: "",
                            password,
                            savedPosts: [],
                            avatar,
                            isVerified: false,
                            subscribedTo: [],
                            authTokens: [token],
                            registeredByExternal: !!byExternal
                        })
                    ).save();

                    req.session.id = str(b._id);
                    req.session.authToken = token;

                    return b;
                }
            }
        },
        loginUser: { // LOCAL LOGIN
            type: UserType,
            args: {
                login: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { login, password }, { req }) {
                const a = await User.findOne({
                    $or: [
                        { login },
                        { email: login }
                    ],
                    password,
                    registeredByExternal: false
                });

                if(a) {
                    const token = generateNoise();

                    await a.updateOne({
                        $push: {
                            authTokens: token
                        }
                    });

                    req.session.authToken = token;
                    req.session.id = str(a._id);
                }

                return a;
            }
        },
        createPost: {
            type: PostType,
            args: {
                text: { type: new GraphQLNonNull(GraphQLString) },
                places: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
                people: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
                media: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLUpload))) }
            },
            async resolve(_, { text, places, people, media }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                let hashtags = [];

                if(text) { // Text and create not existing hashtags
                    // That's better than if I would create a new variable. (CREATE._ARRAY.TIME.EXCHANGE)
                    hashtags = text.match(/#[A-z|-]+/g) || [];
                    hashtags = hashtags.map(io => io.replace("#", ""));

                    if(hashtags.length) {
                        for(let io of hashtags) {
                            const a = await Hashtag.findOne({
                                name: io
                            });

                            if(!a) {
                                await (
                                    new Hashtag({
                                        name: io,
                                        subscribers: []
                                    })
                                ).save();
                            }
                        }
                    }
                }

                // Create post
                const a = await (
                    new Post({
                        creatorID: str(req.session.id),
                        likes: [],
                        time: str(+new Date),
                        people: people || [],
                        places: places || [],
                        hashtags, 
                        text
                    })
                ).save();

                // Create media that is linked to this post
                for(let io of media) {
                    const { filename, createReadStream, mimetype } = await io;
                    const stream = createReadStream();

                    const url = `/files/media/${ a._id }_${ generateNoise(16) }.${ getExtension(filename) }`;
                    stream.pipe(fs.createWriteStream('.' + url));

                    let type;

                    /*
                        I cannot use classifier here.
                        stream.on('finish', callback) doesn't work,
                        so I cannot use full-writed fire.
                        Package crashes with 'SOI not found' error.
                        SOI - Start Of File.

                        Maybe... in the future... I will realize that.
                    */

                    if(mimetype.includes("image")) {
                        type = "image";
                    } else if(mimetype.includes("video")) {
                        type = "video";
                    } else {
                        return new Error("Invalid file type.");
                    }

                    await (
                        new Media({
                            altDescription: "",
                            url,
                            type,
                            postID: str(a._id)
                        })
                    ).save();
                }


                // Subscriptions fork
                pubsub.publish('NEW_POST_SUBMIT', {
                    post: a
                });

                // Return
                return a;
            }
        },
        likePost: {
            type: PostType,
            args: {
                postID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { postID }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await Post.findById(postID);
                if(!a) return null;

                if(!a.likes.includes(req.session.id)) {
                    await a.updateOne({
                        $addToSet: {
                            likes: req.session.id
                        }
                    });

                    a.likes.push(str(req.session.id));

                    if(req.session.id !== a.creatorID) {
                        await (
                            new Notification({
                                action: "LIKE_POST",
                                initID: req.session.id,
                                time: new Date,
                                influencedID: [a.creatorID],
                                subContent: a.text.slice(0, 50),
                                composeID: postID
                            })
                        ).save();
                    }
                } else {
                    await a.updateOne({
                        $pull: {
                            likes: req.session.id
                        }
                    });

                    a.likes.splice(a.likes.findIndex(io => io === req.session.id), 1);
                }

                return a;
            }
        },
        pushBookmark: {
            type: GraphQLBoolean,
            args: {
                postID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { postID }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await User.findById(req.session.id).select("savedPosts");
                if(!a.savedPosts.includes(postID)) {
                    await a.updateOne({
                        $addToSet: {
                            savedPosts: postID
                        }
                    });

                    return true;
                } else {
                    await a.updateOne({
                        $pull: {
                            savedPosts: postID
                        }
                    });

                    return false;
                }
            }
        },
        likeComment: {
            type: GraphQLBoolean,
            args: {
                commentID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { commentID }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await Comment.findById(commentID);
                if(!a) return null;

                if(!a.likes.includes(req.session.id)) {
                    await a.updateOne({
                        $addToSet: {
                            likes: req.session.id
                        }
                    });

                    if(req.session.id !== a.creatorID) {
                        await (
                            new Notification({
                                action: "LIKE_COMMENT",
                                initID: req.session.id,
                                time: new Date,
                                influencedID: [a.creatorID],
                                subContent: a.content.slice(0, 50),
                                composeID: str(a._id)
                            })
                        ).save();
                    }

                    return true;
                } else {
                    await a.updateOne({
                        $pull: {
                            likes: req.session.id
                        }
                    });

                    return false;
                }
            }
        },
        commentPost: {
            type: CommentType,
            args: {
                postID: { type: new GraphQLNonNull(GraphQLID) },
                content: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { postID, content }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const _post = await Post.findById(postID).select("creatorID");
                if(!_post) return null;

                const a = await (
                    new Comment({
                        postID,
                        creatorID: req.session.id,
                        content,
                        likes: [],
                        time: str(+new Date)
                    })
                ).save();

                if(req.session.id !== _post.creatorID) {
                    await (
                        new Notification({
                            action: "COMMENT_POST",
                            initID: req.session.id,
                            time: new Date,
                            influencedID: [_post.creatorID],
                            subContent: content.slice(0, 50),
                            composeID: postID
                        })
                    ).save();
                }

                return a;
            }
        },
        subscribeToUser: {
            type: UserType,
            args: {
                targetID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { targetID }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                if(targetID === req.session.id) return null;

                const a = await User.findById(req.session.id).select("subscribedTo");

                if(!a.subscribedTo.includes(targetID)) {
                    await a.updateOne({
                        $addToSet: {
                            subscribedTo: targetID
                        }
                    });

                    await (
                        new Notification({
                            action: "SUBSCRIBE_USER",
                            initID: req.session.id,
                            time: new Date,
                            influencedID: [targetID],
                            subContent: "",
                            composeID: targetID
                        })
                    ).save();
                } else {
                    await a.updateOne({
                        $pull: {
                            subscribedTo: targetID
                        }
                    });
                }

                return User.findById(targetID);
            }
        },
        settingAccountData: {
            type: UserType,
            args: {
                login: { type: GraphQLString },
                name: { type: GraphQLString },
                bio: { type: GraphQLString },
                email: { type: GraphQLString },
                gender: { type: GraphQLString },
                avatar: { type: GraphQLUpload }
            },
            async resolve(_, { login, name, bio, email, gender, avatar }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = {}

                // Required
                if(login) a.login = login;
                if(email) a.email = email;

                // Validate
                const b = await User.findOne({
                    $or: [
                        { login },
                        { email }
                    ]
                });

                if(b) return null;

                // ...
                a.bio = bio;
                a.name = name;
                a.gender = gender;

                if(avatar) {
                    const { filename, createReadStream } = await avatar;
                    const stream = createReadStream();

                    const url = `/files/avatars/${ generateNoise(128) }.${ getExtension(filename) }`;

                    stream.pipe(fs.createWriteStream('.' + url));

                    a.avatar = url;
                }

                return User.findByIdAndUpdate(req.session.id, a, (_, a) => a);
            }
        },
        settingAccountPassword: {
            type: UserType,
            args: {
                oldPassword: { type: new GraphQLNonNull(GraphQLString) },
                newPassword: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { oldPassword, newPassword }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await User.findById(req.session.id);
                if(!a || a.password !== oldPassword) return null;

                await a.updateOne({
                    password: newPassword
                });

                a.password = newPassword;

                return a;
            }
        },
        followTag: {
            type: GraphQLBoolean,
            args: {
                tagID: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(_, { tagID }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await Hashtag.findOne({
                    _id: tagID,
                    subscribers: {
                        $in: [req.session.id]
                    }
                });

                if(!a) { // subscribe
                    await Hashtag.findByIdAndUpdate(tagID, {
                        $push: {
                            subscribers: req.session.id
                        }
                    });

                    return true;
                } else { // unsubscribe
                    await a.updateOne({
                        $pull: {
                            subscribers: req.session.id
                        }
                    });

                    return false;
                }
            }
        },
        createConversation: {
            type: ConversationType,
            args: {
                targetID: { type: new GraphQLNonNull(GraphQLID) }  
            },
            async resolve(_, { targetID }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const conversors = [
                    targetID,
                    req.session.id
                ];

                const a = await Conversation.findOne({
                    $or: [
                        { conversors: conversors },
                        { conversors: conversors.reverse() }
                    ]
                });

                if(a) { // Conversation exists
                    return a;
                } else { // Create a new conversation
                    const b = await (
                        new Conversation({
                            conversors: conversors
                        })
                    ).save();

                    return b;
                }
            }
        },
        sendMessage: {
            type: MessageType,
            args: {
                conversationID: { type: new GraphQLNonNull(GraphQLID) },
                content: { type: new GraphQLNonNull(GraphQLUpload) },
                type: { type: new GraphQLNonNull(GraphQLString) },
                isFile: { type: GraphQLBoolean }
            },
            async resolve(_, { conversationID, content, type, isFile }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await Conversation.findOne({
                    _id: conversationID,
                    conversors: {
                        $in: [req.session.id]
                    }
                });

                if(!a) return null;

                if(isFile) { // receive file
                    const { filename, createReadStream } = await content;
                    const stream = createReadStream();

                    var contentURL = `/files/messages_image/${ conversationID }_${ generateNoise(90) }.${ getExtension(filename) }`;
                    stream.pipe(fs.createWriteStream('.' + contentURL));
                }

                const b = await (
                    new Message({
                        content: (!isFile) ? content : contentURL,
                        type,
                        creatorID: req.session.id,
                        conversationID,
                        time: new Date,
                        seen: false
                    })
                ).save();

                // Subscriptions fork
                pubsub.publish("MESSENGER_MESSAGE_SENT", {
                    message: b,
                    conversation: a
                });

                // Return
                return b;
            }
        }
    }
});

const RootSubscription = new GraphQLObjectType({
    name: "RootSubscription",
    fields: {
        listenForFeed: {
            type: PostType,
            subscribe: withFilter(
                () => pubsub.asyncIterator('NEW_POST_SUBMIT'),
                async ({ post }, _, { req }) => {
                    if(!req.session.id || !req.session.authToken) return false;
                    if(post.creatorID === req.session.id) return true;

                    // Tags: Name
                    let subscribedTags = await Hashtag.find({
                        subscribers: {
                            $in: [str(req.session.id)]
                        }
                    }).select("name");

                    subscribedTags = subscribedTags.map(io => io.name);

                    // People: ID
                    let subscribedPeople = await User.findById(req.session.id).select("subscribedTo");
                    if(!subscribedPeople) return;

                    subscribedPeople = subscribedPeople.subscribedTo;

                    // Validate
                    // Tags
                    let valid = false;

                    for(io of post.hashtags) {
                        if(subscribedTags.includes(io)) {
                            valid = true;
                            break;
                        }
                    }
                    if(valid) return true;

                    // People
                    return subscribedPeople.includes(post.creatorID);
                }
            ),
            resolve: ({ post }) => post
        },
        listenConversations: {
            type: ConversationType,
            subscribe: withFilter(
                () => pubsub.asyncIterator("MESSENGER_MESSAGE_SENT"),
                ({ message, conversation }, _, { req }) => (
                    req.session.id && req.session.authToken &&
                    // message.creatorID !== req.session.id && // FIX: few devices use same account
                    conversation.conversors.includes(req.session.id)
                )
            ),
            resolve: ({ conversation }) => conversation
        },
        listenDialogMessages: {
            type: MessageType,
            args: {
                dialogID: { type: new GraphQLNonNull(GraphQLID) }
            },
            subscribe: withFilter(
                () => pubsub.asyncIterator("MESSENGER_MESSAGE_SENT"),
                ({ message, conversation }, { dialogID }, { req }) => (
                    req.session.id && req.session.authToken &&
                    // message.creatorID !== req.session.id && // FIX: few devices use same account
                    dialogID === message.conversationID &&
                    conversation.conversors.includes(req.session.id)
                )
            ),
            resolve: ({ message }) => message
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
    subscription: RootSubscription
});
