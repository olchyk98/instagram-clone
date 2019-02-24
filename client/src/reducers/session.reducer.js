export default function reducer(state = {}, { type, payload }) {
    let a = { ...state }

    switch(type) {
        case 'SET_GLOBAL_MENU':
            /*
                payload shape:

                {
                    type: string,
                    buttons: null | Array *> [
                        {
                            isRed?: bool,
                            action: func,
                            text: string,
                            close?: boolean
                        }
                    ]
                }

                accepts: Object
                sets: @payload -full
            */

            a.multiwinMenu = payload;
        break;
        case 'CREATE_NEW_POST':
            a.newPostWin = payload;
        break;
        case 'CAST_GLOBAL_ERROR':
            a.globalError = payload;
        break;
        case 'PREVIEW_FLOAT_MODAL':
            /*
                payload = { id } || null
            */

            a.floatPhotoModal = payload;
        break;
        default:break;
    }

    return a;
}
