/*
    u - user
    s - settings
    e - explore
    d - direct
    t - tag
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
    },
    "TAG_PAGE": {
        route: '/t/:name',
        absolute: '/t'
    }
}

export default links;
