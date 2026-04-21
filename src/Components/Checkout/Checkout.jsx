import React from "react";
import Style from './Checkout.module.css'
import { Helmet } from "react-helmet-async";

export default function Checkout() {
    return <>
        <Helmet>
            <title>Checkout | Marketly</title>
            <meta name="description" content="Complete your purchase securely on Marketly. Review your order, enter your details, and confirm your payment." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1>Checkout</h1>
    </>
}