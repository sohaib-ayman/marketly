import React from "react";
import Style from './Checkout.module.css'
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

export default function Checkout() {
    let items = useSelector(state => state.cart.items);
    if (items.length === 0) {
        toast.error("Your cart is empty");
        return <Navigate to="/cart" replace />;
    }
    return <>
        <Helmet>
            <title>Checkout | Marketly</title>
            <meta name="description" content="Complete your purchase securely on Marketly. Review your order, enter your details, and confirm your payment." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1>Checkout</h1>
    </>
}