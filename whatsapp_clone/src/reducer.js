
// Declaring InitialState - contains all variables which you want to use later on for deep layers. Predefined user variable with default value.
export const initialState = {
    user: null,
    allfriendlist: []
}


// Actiontype defines what kind of dispatch is that and based on that inside reducer, we have created a way to update it, by using current state and action we want to perform on the object.
export const actionTypes = {
    SET_USER: "SET_USER",
    SET_USERDOCID: "SET_USERDOCID",
    SET_FRNDLST: "SET_FRNDLST"
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
            return {
                ...state, allfriendlist: [...state.allfriendlist, action.friendlist]
            }
        default:
            return state;
    }
}

export default reducer;