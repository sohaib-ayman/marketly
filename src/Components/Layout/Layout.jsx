import React, { useContext, useEffect, useState } from "react";
import Style from './Layout.module.css'
import Navbar from '../Navbar/Navbar'
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DataContext } from "../../Context/DataContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import toast from "react-hot-toast";

export default function Layout() {
    let { loading } = useContext(DataContext);

    useEffect(() => {
        function handleOffline() {
            toast.error("No internet connection", {
                id: "offline",
                duration: Infinity,
                position: "bottom-right",
                style: {
                    background: "#ef4444",
                    color: "#fff",
                },
            });
        }

        function handleOnline() {
            toast.dismiss("offline");
            toast.success("You're back online", {
                id: "online",
                duration: 3000,
                position: "bottom-right",
                style: {
                    background: "#22c55e",
                    color: "#fff",
                },
            });
        }

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    return <>
        {loading && <LoadingScreen />}
        <Navbar />
        <Outlet></Outlet>
        <Toaster
            position="bottom-left"
            toastOptions={{
                duration: 3000,
            }}
        />
    </>
}