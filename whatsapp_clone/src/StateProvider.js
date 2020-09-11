import React, { createContext, useContext, useReducer } from "react"

// This command create the data layer.
// React Context API is a way to essentially create global variables that can be passed around in a React app. This is the alternative to "prop drilling", or passing props from grandparent to parent to child, and so on. Context is often touted as a simpler, lighter solution to using Redux for state management
export const StateContext = createContext();
// So useReducer provides a way to deliver variables deep into layers with dispatch and it requires reducer and initialState of the app
export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}
    >
        {children}
    </StateContext.Provider>);

// Accepts a context object (the value returned from React.createContext) and returns the current context value, as given by the nearest context provider for the given context.
export const useStateValue = () => useContext(StateContext);