import React from "react";
import Style from './MyOrders.module.css'
import { Helmet } from "react-helmet-async";

export default function MyOrders() {
    return <>
        <Helmet>
            <title>My Orders | Marketly</title>
            <meta name="description" content="View and track your orders on Marketly. Check order status, delivery details, and purchase history."/>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1>MyOrders</h1>
    </>
}