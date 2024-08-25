import React, { createContext, useState } from 'react';

export  let CounterContext = createContext();

export default function CounterContextProvider(props){
    let[counter,]=useState();
    return <CounterContext.Provider value={{counter}}>
{props.children}

</CounterContext.Provider>    


}