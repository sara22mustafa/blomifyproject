import React from 'react'
import { Navigate } from 'react-router-dom'


export default function ProtectedRoute(props) {
  if(localStorage.getItem('userToken') !== null){
    return props.children
  }
  else{
// return <Navigate to={'./login'}/>  error-->Use an absolute path (/login)
    return <Navigate to={'/login'}/>
  }
 
}
