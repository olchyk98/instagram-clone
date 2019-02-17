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
        isVerified: { type: GraphQLBoolean },
        subscribers: { type: new GraphQLList(GraphQLID) }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "hi"
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

                req.session.id = b._id;
                req.session.authToken = token;

                return b;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});
