import React from "react";
import Style from './TrackOrder.module.css'
import { Helmet } from "react-helmet-async";

export default function TrackOrder(){
    return<>
    <Helmet>
        <title>Track Order | Marketly</title>
        <meta name="description" content="Track your order on Marketly. Enter your order details to check delivery status, shipping updates, and estimated arrival time."/>
    </Helmet>
    <h1>TrackOrder</h1>
    </>
}