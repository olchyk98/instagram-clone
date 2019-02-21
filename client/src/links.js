/*
    u - user
    s - settings
    e - explore
    d - direct
*/

const links = {
    "FEED_PAGE": {
        route: '/',
        absolute: '/'
    },
    "ACCOUNT_PAGE": {
        route: '/u/:url',
        absolute: '/u'
    },
    "SETTINGS_PAGE": {
        route: '/s/:hook?',
        absolute: '/s'
    },
    "EXPLORE_PAGE": {
        route: '/e',
        absolute: '/e'
    },
    "MESSENGER_PAGE": {
        route: '/d',
        absolute: '/d'
    }
}

export default links;
