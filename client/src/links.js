/*
    u - user
    s - settings
    e - explore
    d - direct
    t - tag
    p - post
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
        route: '/d/:id?',
        absolute: '/d'
    },
    "TAG_PAGE": {
        route: '/t/:tag',
        absolute: '/t'
    },
    "POST_PAGE": {
        route: '/p/:id',
        absolute: '/p'
    }
}

export default links;
