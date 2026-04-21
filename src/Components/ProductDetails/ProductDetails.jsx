import React, { useContext } from "react";
import Style from './ProductDetails.module.css'
import { useParams } from "react-router-dom";
import { DataContext } from "../../Context/DataContext";
import { Helmet } from "react-helmet-async";

export default function ProductDetails(){
    let { productSlug } = useParams();
    let productID = productSlug?.split("-").pop();
    let { products } = useContext(DataContext);
    let currentProduct = products.find((product) => product.id === Number(productID));

    return<>
    <Helmet>
        <title>{`${currentProduct?.title} | Marketly`}</title>
        <meta name="description" content={currentProduct?.description}/>
    </Helmet>
    <h1>{currentProduct?.title}</h1>
    </>
}