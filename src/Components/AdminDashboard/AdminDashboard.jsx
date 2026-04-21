import React from "react";
import Style from './AdminDashboard.module.css'
import { Helmet } from "react-helmet-async";

export default function AdminDashboard() {
    return <>
        <Helmet>
            <title>Admin Dashboard | Marketly</title>
            <meta name="description" content="Manage products, orders, and users from the Marketly admin dashboard. Control your store operations efficiently." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1>AdminDashboard</h1>
    </>
}