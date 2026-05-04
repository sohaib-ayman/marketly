import React, { useContext } from "react";
import Style from './Auth.module.css'
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Auth(props) {
    const { user, loading, role } = useContext(UserContext);
    const location = useLocation();

    if (loading) return null;

    if (!user || user.isAnonymous) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (location.pathname === "/admin-dashboard" && role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <>
        {props.children}
    </>
}