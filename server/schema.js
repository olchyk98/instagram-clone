const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull
} = require('graphql');

const {
    User
} = require('./models');

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
        subscribers: { type: new GraphQLList(GraphQLID) }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: () => User.find({})
        },
        validateUser: { // Validate if user with this email | login exists
            type: GraphQLBoolean,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                login: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { email, login }) {
                let a = {},
                    b = false;

                if(email) {
                    a.email = email;
                    b = true;
                }
                if(login) {
                    e.login = login;
                    b = true;
                }

                const c = await User.findOne(a);
                if(!c) {
                    return 0;
                } else {
                    if(login && !email) return 1;
                    else if(email && !login) return 2;
                    else return 3; // login && email
                }
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
                login: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(_, { email, name, login, password }, { req }) {
                const a = await User.findOne({
                    $or: [
                        { email },
                        { login }
                    ]
                });
                if(a) return new Error("User with that email or login already exists!");

                const token = generateNoise();

                const b = await (
                    new User({
                        login,
                        name,
                        bio: "",
                        email,
                        gender: "",
                        password,
                        savedImages: [],
                        avatar: "/files/default/avatar.jpg",
                        isVerified: false,
                        subscribers: [],
                        authTokens: [token]
                    })
                ).save();

                req.session.id = str(b._id);
                req.session.authToken = token;

                return b;
            }
        },
        loginUser: {
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
                    password
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