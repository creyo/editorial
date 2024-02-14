import React, { useEffect } from 'react';
import {   useNavigate } from 'react-router-dom';

function PrivateRoute(props) {

const {Component} =  props
const navigate = useNavigate()

useEffect (()=>{
    let login = localStorage.getItem('sb-czlpeqcpksfalvtmrulq-auth-token')
   
    // console.log(login)
    if(!login){
        navigate('/')  
    }
})

  return (
    <div>
        <Component/>
    </div>
  );
}

export default PrivateRoute;
