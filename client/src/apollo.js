import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { RetryLink } from 'apollo-link-retry'
import { getMainDefinition } from 'apollo-utilities';

import api from './api';

const client = new ApolloClient({
    link: new RetryLink().split(
        sys => getMainDefinition(sys.query).operation === "subscription",
        new WebSocketLink({
            uri: api.wsocket,
            credentials: 'include',
            options: {
                reconnect: true
            }
        }),
        createUploadLink({
            uri: api.server,
            credentials: 'include'
        })
    ),
    cache: new InMemoryCache()
});

export default client;
