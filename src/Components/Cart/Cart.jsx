import React from "react";
import Style from './Cart.module.css'
import { Helmet } from "react-helmet-async";

export default function Cart() {
    return <>
        <Helmet>
            <title>Your Cart | Marketly</title>
            <meta name="description" content="Review the items in your cart on Marketly. Update quantities, remove products, and proceed to checkout securely." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1>Cart</h1>
    </>
}