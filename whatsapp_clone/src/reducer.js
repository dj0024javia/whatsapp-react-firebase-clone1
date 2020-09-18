
// Declaring InitialState - contains all variables which you want to use later on for deep layers. Predefined user variable with default value.
export const initialState = {
    user: null,
    allfriendlist: [],
    userDocId: null,
    friendDocId: null,
    commonchaturl: null,

}


// Actiontype defines what kind of dispatch is that and based on that inside reducer, we have created a way to update it, by using current state and action we want to perform on the object.
export const actionTypes = {
    SET_USER: "SET_USER",
    SET_USERDOCID: "SET_USERDOCID",
    SET_FRNDLST: "SET_FRNDLST",
    SET_FRNDDOCID: "SET_FRNDDOCID",
    COMMON_CHAT_URL: "COMMON_CHAT_URL",

}


const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state, user: action.user
            }
        case actionTypes.SET_USERDOCID:
            return {
                ...state, userDocId: action.userDocId
            }
        case actionTypes.SET_FRNDLST:
            console.log(state)
            console.log(action.allfriendlist)
            return {
                ...state, allfriendlist: [...state.allfriendlist, action.allfriendlist]
            }
        case actionTypes.SET_FRNDDOCID:
            return {
                ...state, friendDocId: action.friendDocId
            }

        case actionTypes.COMMON_CHAT_URL:
            return {
                ...state, commonchaturl: action.commonchaturl
            }
        default:
            return state;
    }
}

export default reducer;