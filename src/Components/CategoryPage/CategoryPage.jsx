import React, { useContext } from "react";
import Style from './CategoryPage.module.css'
import { useParams } from "react-router-dom";
import { DataContext } from "../../Context/DataContext";
import { Helmet } from "react-helmet-async";

export default function CategoryPage() {
    let { categorySlug } = useParams();
    let { categories } = useContext(DataContext);
    let currentCategory = categories.find((category) => category.slug === categorySlug);

    return <>
        <Helmet>
            <title>{`${currentCategory?.name} | Marketly`}</title>
            <meta name="description" content={`Browse ${currentCategory?.name} products on Marketly`}/>
        </Helmet>
        <h1>{currentCategory?.name}</h1>
    </>
}