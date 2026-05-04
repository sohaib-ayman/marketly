import React, { useState } from "react";
import Style from "./AdminDashboard.module.css";
import { Helmet } from "react-helmet-async";
import UsersManagement from "../../Components/UsersManagement/UsersManagement";
import ProductsManagement from "../../Components/ProductsManagement/ProductsManagement";
import axios from "axios";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users");


    async function seedCategories() {
        let res = await axios.get("https://api.escuelajs.co/api/v1/categories");

        for (let cat of res.data) {
            await setDoc(
                doc(db, "categories", String(cat.id)),
                {
                    id: cat.id,
                    name: cat.name,
                    image: cat.image,
                    slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
                    createdAt: new Date(),
                },
                { merge: true }
            );
        }

        console.log("CATEGORIES SEEDED");
    }


 async function seedProducts() {
    try {
        const res = await axios.get("https://api.escuelajs.co/api/v1/products");
        const products = res.data;

        await Promise.all(
            products.map((product) => {
                const formattedProduct = {
                    id: product.id,
                    title: product.title,

                    // 👇 slug آمن
                    slug:
                        product.slug ||
                        product.title
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, "")
                            .replace(/\s+/g, "-"),

                    description: product.description,
                    price: Number(product.price) || 0,

                    // 👇 نحولها string عشان الكود عندك
                    category: product.category?.slug || "misc",

                    // 👇 صور آمنة
                    thumbnail:
                        product.images?.[0] ||
                        "https://placehold.co/600x400",

                    images: product.images || [],

                    creationAt: product.creationAt,
                    updatedAt: product.updatedAt,

                    source: "platzi",
                };

                return setDoc(
                    doc(db, "products", String(product.id)),
                    formattedProduct
                );
            })
        );

        toast.success("Products seeded successfully ✅");
        console.log("Products seeded ✅");

    } catch (error) {
        console.error(error);
        toast.error("Seeding failed ❌");
    }
}
    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Marketly</title>
                <meta
                    name="description"
                    content="Manage products, orders, and users from the Marketly admin dashboard."
                />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <section className={Style.adminDashboard}>
                <div className="container">

                    <div className={Style.header}>
                        <h1>Admin Dashboard</h1>
                        <p>Manage users and products</p>
                    </div>

                    <div className={Style.tabs}>
                        <button
                            className={`${Style.tabBtn} ${activeTab === "users" ? Style.active : ""}`}
                            onClick={() => setActiveTab("users")}
                        >
                            <i className="fa-solid fa-user-group"></i> Users Management
                        </button>

                        <button
                            className={`${Style.tabBtn} ${activeTab === "products" ? Style.active : ""}`}
                            onClick={() => setActiveTab("products")}
                        >
                            <i className="fa-solid fa-box-open"></i> Products Management
                        </button>
                    </div>

                    {activeTab === "users" && <UsersManagement />}
                    {activeTab === "products" && <ProductsManagement />}

                </div>
            </section>
            <button onClick={seedProducts}>
                Seed Products
            </button>
            <button onClick={seedCategories}>
    Seed Categories
</button>
        </>
    );
}