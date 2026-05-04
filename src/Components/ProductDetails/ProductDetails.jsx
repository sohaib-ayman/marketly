import React, { useContext, useState } from "react";
import Style from "./ProductDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { DataContext } from "../../Context/DataContext";
import { Helmet } from "react-helmet-async";

export default function ProductDetails() {
    let { productSlug } = useParams();
    let navigate = useNavigate();
    let { products } = useContext(DataContext);

    let productID = productSlug?.split("-").pop();

    let currentProduct = products.find(
        (product) => product.id === Number(productID)
    );

    const [activeImg, setActiveImg] = useState(
        currentProduct?.images?.[0]
    );

    const [quantity, setQuantity] = useState(1);

    if (!currentProduct) return null;

    return (
        <>
            <Helmet>
                <title>{`${currentProduct.title} | Marketly`}</title>
                <meta name="description" content={currentProduct.description} />
            </Helmet>

            <div className={Style.container}>

                <button className={Style.backBtn} onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i> Back
                </button>

                <div className={Style.wrapper}>

                    {/* LEFT SIDE */}
                    <div className={Style.imagesSection}>

                        <div className={Style.mainImage}>
                            <img src={activeImg} alt={currentProduct.title} />
                        </div>

                        <div className={Style.thumbs}>
                            {currentProduct.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    onClick={() => setActiveImg(img)}
                                    className={
                                        activeImg === img
                                            ? Style.activeThumb
                                            : ""
                                    }
                                />
                            ))}
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className={Style.infoSection}>

                        <h2>{currentProduct.title}</h2>

                        <span className={Style.price}>
                            ${currentProduct.price}
                        </span>

                        <h4>Description</h4>
                        <p>{currentProduct.description}</p>

                        <div className={Style.quantity}>
                            <span>Quantity</span>

                            <div className={Style.counter}>
                                <button
                                    onClick={() =>
                                        setQuantity((prev) =>
                                            prev > 1 ? prev - 1 : 1
                                        )
                                    }
                                >
                                    -
                                </button>

                                <span>{quantity}</span>

                                <button
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button className={Style.addBtn}>
                            <i className="fa-solid fa-cart-shopping"></i>
                            Add to Cart
                        </button>

                        <div className={Style.details}>
                            <h4>Product Details</h4>

                            <div className={Style.row}>
                                <span>Category</span>
                                <span>
                                    {currentProduct.category.charAt(0).toUpperCase() +
                                        currentProduct.category.slice(1)}
                                </span>
                            </div>

                            <div className={Style.row}>
                                <span>Product ID</span>
                                <span>#{currentProduct.id}</span>
                            </div>

                            <div className={Style.row}>
                                <span>Availability</span>
                                <span className={Style.inStock}>
                                    In Stock
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}