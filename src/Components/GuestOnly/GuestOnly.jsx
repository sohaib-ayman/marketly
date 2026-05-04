import React, { Children, useContext } from "react";
import Style from './GuestOnly.module.css'
import { UserContext } from "../../Context/UserContext";
import { Navigate, useLocation } from "react-router-dom";

export default function GuestOnly(props){
    const {user, loading} = useContext(UserContext);
    const location = useLocation();
    
    if (loading) return null;

    if (user && !user.isAnonymous) {
        const redirectTo = location.state?.from?.pathname || "/";
        return <Navigate to={redirectTo} replace />;
    }
    
    return<>
    {props.children}
    </>
}