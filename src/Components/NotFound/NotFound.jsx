import React from "react";
import Style from "./NotFound.module.css";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFound() {
    return <>
        <Helmet>
            <title>Page Not Found | Marketly</title>
            <meta name="description" content="The page you are looking for does not exist on Marketly." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <section className={Style.notFoundPage}>
            <div className={Style.content}>
                <span className={Style.code}>404</span>
                <h1>Page Not Found</h1>
                <p>The page you are looking for doesn't exist or may have been moved.</p>
                <div className={Style.actions}>
                    <Link to="/" className={Style.primaryBtn}><i className="fa-solid fa-house"></i>Back to Home</Link>
                    <Link to="/track-order" className={Style.secondaryBtn}><i className="fa-solid fa-truck-fast"></i> Track Order
                    </Link>
                </div>
            </div>
        </section>
    </>
}