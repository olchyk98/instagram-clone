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
    AuthenticationError
} = require('apollo-server');

const {
    User,
    Post
} = require('./models');

//
const mobilenet = require('@tensorflow-models/mobilenet');

// const IClassifier = require('./mobilenet');
// let ICLModel = null;
// (async () => {
//     ICLModel = await mobilenet.load();
// })();

// if(ICLModel) IClassifier(ICLModel, './photo.jpg');
//

// Functions
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
        password: { type: GraphQLString },
        savedImagesID: { type: new GraphQLList(GraphQLID) },
        registeredByFacebook: { type: GraphQLBoolean },
        savedImages: {
            type: new GraphQLList(GraphQLID),
            resolve: ({ savedImages }) => Image.find({
                _id: {
                    $in: savedImages
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
            type: UserType,
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
    fields: {
        durationS: { type: GraphQLInt },
        altDescription: { type: GraphQLString },
        url: { type: GraphQLString },
        type: { type: GraphQLString },
        postID: { type: GraphQLString }
    }
});

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLID },
        creatorID: { type: GraphQLID },
        creator: {
            type: UserType,
            resolve: ({ creatorID }) => User.findById(creatorID)
        },
        likes: { type: GraphQLInt },
        likesInt: {
            type: GraphQLInt,
            resolve: ({ likes }) => likes.length
        },
        time: { type: GraphQLString },
        people: { type: new GraphQLList(GraphQLID) },
        places: { type: new GraphQLList(GraphQLString) },
        media: {
            type: new GraphQLList(MediaType),
            resolve: ({ id }) => Media.find({
                postID: str(id)
            })
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
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
        users: {
            type: new GraphQLList(UserType),
            resolve: () => User.find({})
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
                    const b = await User.findOne({ // Vulnerability? I think facebook protects and checks user's email.
                        email
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

                        avatar = `/files/avatars/${ generateNoise(128) }.jpeg`;
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
                            savedImages: [],
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
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});
