import React from "react";
import Style from './NotFound.module.css'
import { Helmet } from "react-helmet-async";

export default function NotFound() {

    return <>
        <Helmet>
            <title>Page Not Found | Marketly</title>
            <meta name="description" content="The page you are looking for does not exist on Marketly. Browse our products or return to the homepage."/>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1>NotFound</h1>
    </>
}