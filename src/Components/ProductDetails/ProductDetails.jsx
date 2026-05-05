import React, { useContext, useEffect, useState } from "react";
import Style from "./ProductDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { DataContext } from "../../Context/DataContext";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Store/cartSlice";
import { UserContext } from "../../Context/UserContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export default function ProductDetails() {
    let { productSlug } = useParams();
    let navigate = useNavigate();
    let { products } = useContext(DataContext);
    let { user } = useContext(UserContext);
    let dispatch = useDispatch();
    let productID = productSlug?.split("-").pop();
    let [activeImg, setActiveImg] = useState(null);
    let [toast, setToast] = useState(null);
    let currentProduct = products.find(
        (product) => product.id === Number(productID)
    );

    useEffect(() => {
        if (currentProduct?.images?.length) {
            setActiveImg(currentProduct.images[0]);
        }
    }, [currentProduct]);

    const [quantity, setQuantity] = useState(1);

    if (!currentProduct) {
        return <LoadingScreen />
    };

    return <>
        <Helmet>
            <title>{`${currentProduct.title} | Marketly`}</title>
            <meta name="description" content={currentProduct.description} />
        </Helmet>

        <div className={Style.container}>


            <div className={Style.wrapper}>

                <div className={Style.imagesSection}>
                    <button className={`${Style.backBtn} ps-0`} onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </button>

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

                <div className={Style.infoSection}>

                    <h2>{currentProduct.title}</h2>

                    <span className={Style.price}>
                        ${currentProduct.price}
                    </span>

                    <h4>Description</h4>
                    <p className="text-secondary">{currentProduct.description}</p>

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
                                <i className="fa-solid fa-minus"></i>
                            </button>

                            <span>{quantity}</span>

                            <button
                                onClick={() =>
                                    setQuantity((prev) => prev + 1)
                                }
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <button
                        className={Style.addBtn}
                        onClick={() => {
                            dispatch(addToCart({
                                userId: user?.uid || "guest",
                                product: {
                                    id: currentProduct.id,
                                    title: currentProduct.title,
                                    price: currentProduct.price,
                                    thumbnail: currentProduct.thumbnail || currentProduct.images?.[0]
                                },
                                quantity: quantity,
                            }));
                            setToast(`${currentProduct.title} x ${quantity}`);
                            setTimeout(()=> setToast(null), 3000);
                        }}
                    >
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
        {toast && (
            <div style={{ position: "fixed", bottom: "20px", left: "20px", background: "var(--pageBgColor)", color: "var(--textColor)", padding: "14px 20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", fontSize: "14px", fontWeight: "500", animation: "slideDown 0.3s ease" }}>
                <i className="fa-solid fa-circle-check" style={{ color: "#2ecc71" }}></i>
                {toast} added to cart!
            </div>
        )}
    </>
}