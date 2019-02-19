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
    GraphQLUpload
} = require('apollo-server');

const {
    User,
    Post,
    Comment
} = require('./models');

//
// const mobilenet = require('@tensorflow-models/mobilenet');

// const IClassifier = require('./mobilenet');
// let ICLModel = null;
// (async () => {
//     ICLModel = await mobilenet.load();
// })();

// if(ICLModel) IClassifier(ICLModel, './photo.jpg');
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
        registeredByFacebook: { type: GraphQLBoolean },
        savedPosts: {
            type: new GraphQLList(PostType),
            resolve: ({ savedPosts }) => Post.find({
                _id: {
                    $in: savedPosts
                }
            })
        },
        avatar: { type: GraphQLString },
        authTokens: { type: new GraphQLList(GraphQLString) },
        lastAuthToken: {
            type: GraphQLString,
            resolve: ({ authTokens }) => authTokens.slice(-1)[0] || null
        },
        isVerified: { type: GraphQLBoolean },
        subscribedTo: { type: new GraphQLList(GraphQLID) },
        feed: {
            type: new GraphQLList(PostType),
            resolve({ id, subscribedTo }) {
                return Post.find({
                    $or: [
                        {
                            creatorID: {
                                $in: subscribedTo
                            }
                        },
                        {
                            creatorID: str(id)
                        }
                    ]
                });
            }
        }
    })
});

const MediaType = new GraphQLObjectType({
    name: "Media",
    fields: () => ({
        durationS: { type: GraphQLInt },
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
        inBookmarks: {
            type: GraphQLBoolean,
            resolve: async ({ id }, _, { req: { session: { id: clientID } } }) => {
                const a = await User.findById(clientID).select("savedPosts");
                return a.savedPosts.includes(str(id))
            }
        },
        time: { type: GraphQLString },
        people: { type: new GraphQLList(GraphQLID) },
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
                limit: { type: GraphQLInt }
            },
            resolve: ({ id }, { limit }) => Comment.find({
                postID: str(id)
            }).sort({ time: 1 }).limit(limit || 0)
        },
        text: { type: GraphQLString }
    })
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
                targetID: { type: GraphQLID }
            },
            resolve(_, { targetID }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                return User.findById(targetID || req.session.id);
            }
        },
        validateUser: { // Validate if user with this email | login exists
            type: new GraphQLList(GraphQLBoolean),
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                login: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { email, login }) {
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
                byFacebook: { type: GraphQLBoolean }
            },
            async resolve(_, { email, name, login, password, pictureURL, byFacebook }, { req }) {
                if(!byFacebook) {
                    const a = await User.findOne({
                        $or: [
                            { email },
                            { login }
                        ]
                    });
                    if(a) return new Error("User with that email or login already exists!");
                }

                const _a = false;

                if(byFacebook) {
                    const b = await User.findOne({
                        email,
                        registeredByFacebook: true
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

                        // I can pass any image format here.
                        // Thanks, Mark blyad' Cucumber -_-
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
                            registeredByFacebook: !!byFacebook
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
                    registeredByFacebook: false
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
                places: { type: new GraphQLList(GraphQLString) },
                people: { type: new GraphQLList(GraphQLID) },
                media: { type: new GraphQLNonNull(new GraphQLList(GraphQLUpload)) }
            },
            async resolve(_, { text, places, people, media }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await (
                    new Post({
                        creatorID: str(req.session.id),
                        likes: [],
                        time: str(+new Date),
                        people: people || [],
                        places: places || [],
                        text
                    })
                ).save();

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
                        $push: {
                            likes: req.session.id
                        }
                    });

                    a.likes.push(str(req.session.id));
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
        commentPost: {
            type: CommentType,
            args: {
                postID: { type: new GraphQLNonNull(GraphQLID) },
                content: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { postID, content }, { req }) {
                if(!req.session.id || !req.session.authToken)
                    throw new AuthenticationError("No current session.");

                const a = await (
                    new Comment({
                        postID,
                        creatorID: req.session.id,
                        content,
                        likes: [],
                        time: str(+new Date)
                    })
                ).save();

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
                        $push: {
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
                        $push: {
                            likes: req.session.id
                        }
                    });

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

                const a = await (
                    new Comment({
                        postID,
                        creatorID: req.session.id,
                        content,
                        likes: [],
                        time: str(+new Date)
                    })
                ).save();

                return a;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});
