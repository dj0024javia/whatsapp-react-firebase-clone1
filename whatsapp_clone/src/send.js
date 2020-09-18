import React from 'react'
import { actionTypes } from './reducer'
import { useStateValue } from './StateProvider'
const [{ }, dispatch] = useStateValue()

function send({ value, variable1, var1value }) {



    return (
        dispatch({
            type: actionTypes.value,
            variable1: var1value
        })
    )
}

export default send
