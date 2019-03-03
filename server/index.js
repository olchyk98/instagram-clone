const { createServer } = require('http');
const express = require('express');
const cookieSession = require('cookie-session');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const schema = require('./schema');

const mongodbtimetit = "The API server was successfully connected to the MongoDB database!";
console.time(mongodbtimetit);
mongoose.connect('mongodb://oles:0password@ds139435.mlab.com:39435/instagram-clone', {
    useNewUrlParser: true
});
mongoose.connection.once('open', () => console.timeEnd(mongodbtimetit));

const app = express();

app.use('/files', express.static('./files'));

const parseSession = new cookieSession({
    age: 24 * 60 * 60 * 1000,
    name: 'session',
    keys: [
        '7TyG9dowhOwL8nxwQyOp',
        'ft6MktjoBJfXIbG2xC61',
        'm8IsfH7VaPkvtbNr2ZK7',
        '8zQQmNYtfL3kqFEoEqM4',
        'aBt5bPyJ4ES0UogGp65w',
        'FjaeIh63pXG0997BFjsA'
    ]
});
app.use(parseSession);

const server = new ApolloServer({
    schema,
    engine: false,
    context: ({ req, connection }) => {
        if(connection) {
            return {
                req: {
                    ...req,
                    session: connection.context.session
                }
            }
        }

        return ({ req });
    },
    playground: {
        settings: {
            'editor.theme': 'light'
        }
    },
    subscriptions: {
        onConnect: async (_, webSocket, context) => {
            const session = await new Promise((resolve) => {
                parseSession(webSocket.upgradeReq, {}, () => {
                    resolve(webSocket.upgradeReq.session);
                })
            });

            return { session }
        }
    }
});
server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
        origin: [
            'http://localhost:3000',
            'http://localhost:5000',
            'https://olchyk98.github.io'
        ],
        credentials: true
    }
});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(process.env.PORT || 4000, () => console.log("Server is running on port 4000!"));
