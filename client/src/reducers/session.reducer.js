export default function reducer(state = {}, { type, payload }) {
    let a = { ...state }

    switch(type) {
        case 'SET_GLOBAL_MENU':
            /*
                payload shape:

                {
                    buttons: null | Array *> [
                        {
                            isRed?: bool,
                            action: func,
                            text: string
                        }
                    ]
                }

                accepts: Object
                sets: @payload -full
            */

            a.multiwinMenu = payload;
        break;

        default:break;
    }

    return a;
}