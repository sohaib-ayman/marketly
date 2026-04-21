import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import Style from './Home.module.css'
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { DataContext } from "../../Context/DataContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
    let { products, categories, counts, loading } = useContext(DataContext);
    let sectionRef = useRef(null);
    let navigate = useNavigate();
    let start = Math.floor(Math.random() * (products.length - 12));
    let featuredProducts = products.slice(start, start + 8);

    return <>
        <Helmet>
            <title>Marketly</title>
            <meta name="description" content="Welcome back to Marketly. Sign in to continue shopping, track your orders, and manage your account securely." />
        </Helmet>
        <div className={`${Style.heroSection} d-flex justify-content-center align-items-center flex-column`}>
            <h1>Welcome to Marketly</h1>
            <p>Discover amazing products at great prices</p>
            <button onClick={() => { sectionRef.current.scrollIntoView({ behavior: "smooth" }); }} className="mt-4 text-decoration-none bg-white">Shop Now <i className="fa-solid fa-arrow-right"></i></button>
        </div>

        <div ref={sectionRef} className="container px-5 py-5 ps-3 ps-md-0 pe-3 pe-md-0">
            <h2 className={`${Style.titleText} mb-5 ms-2`}>Shop by Category</h2>

            <div className="row justify-content-start justify-content-md-center gy-3 gy-md-0">
                {categories.map((category) => (
                    <div key={category.id} className="col-6 col-md">
                        <div className={Style.categoryCard} onClick={() => navigate(`/${category.slug}`)}>
                            <div className={Style.categoryImg}>
                                <img src={category.image} alt={category.name} />
                            </div>
                            <div className={Style.categoryInfo}>
                                <h3>{category.name}</h3>
                                <p className="mt-2 mb-0">
                                    {counts[category.id] || 0} products
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="container px-5 py-5 ps-3 ps-md-0 pe-3 pe-md-0">
            <h2 className={`${Style.titleText} mb-5 ms-2`}>Featured Products</h2>
            <div className="row justify-content-center gy-4">
                {featuredProducts.map((product) => (
                    <div key={product.id} className="col-12 col-md-6 col-lg-3">
                        <div className={Style.productCard} onClick={() => navigate(`/${product.category.slug}/${product.slug}-${product.id}`)}>
                            <div className={Style.productImg}>
                                <img src={product.images[0]} alt={product.title} />
                                <span className={Style.price}>${product.price}</span>
                                <button className={Style.addBtn} onClick={(e) => {e.stopPropagation();}}>
                                    <i className="fa-solid fa-cart-shopping"></i> Add to Cart
                                </button>
                            </div>
                            <div className={Style.productInfo}>
                                <h3>{product.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}