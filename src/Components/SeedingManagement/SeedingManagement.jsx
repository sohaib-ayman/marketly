import React, { useState } from "react";
import Style from "./SeedingManagement.module.css";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

export default function SeedingManagement() {
    const [confirmType, setConfirmType] = useState(null);
    const [isSeeding, setIsSeeding] = useState(false);
    const [done, setDone] = useState(false);

    async function seedCategories() {
        try {
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

            toast.success("Categories seeded");
        } catch (err) {
            console.error(err);
            toast.error("Seeding failed");
        }
    }

    async function seedProducts() {
        try {
            const res = await axios.get("https://api.escuelajs.co/api/v1/products");

            await Promise.all(
                res.data.map((product) =>
                    setDoc(
                        doc(db, "products", String(product.id)),
                        {
                            id: product.id,
                            title: product.title,
                            slug:
                                product.slug ||
                                product.title
                                    .toLowerCase()
                                    .replace(/[^\w\s-]/g, "")
                                    .replace(/\s+/g, "-"),
                            description: product.description,
                            price: Number(product.price) || 0,
                            category: product.category?.slug || "misc",
                            thumbnail:
                                product.images?.[0] ||
                                "https://placehold.co/600x400",
                            images: product.images || [],
                            creationAt: product.creationAt,
                            updatedAt: product.updatedAt,
                        }
                    )
                )
            );

            toast.success("Products seeded");
        } catch (err) {
            console.error(err);
            toast.error("Seeding failed");
        }
    }

    async function handleConfirm() {
        setIsSeeding(true);

        if (confirmType === "products") {
            await seedProducts();
        } else {
            await seedCategories();
        }

        setIsSeeding(false);
        setDone(true);

        setTimeout(() => {
            setDone(false);
            setConfirmType(null);
        }, 1500);
    }

    return (
        <div className={Style.panel}>

            <div className={Style.header}>
                <h3>Database Seeding</h3>
                <span className={Style.badge}>Owner Only</span>
            </div>

            <p className={Style.description}>
                Import initial data from Platzi API. This may overwrite existing data.
            </p>

            <div className={Style.cards}>

                <div className={Style.seedCard}>
                    <h4>Products</h4>
                    <p>Seed all products into Firestore</p>

                    <button
                        className={Style.primaryBtn}
                        onClick={() => setConfirmType("products")}
                        disabled={isSeeding}
                    >
                        Seed Products
                    </button>
                </div>

                <div className={Style.seedCard}>
                    <h4>Categories</h4>
                    <p>Seed all categories into Firestore</p>

                    <button
                        className={Style.secondaryBtn}
                        onClick={() => setConfirmType("categories")}
                        disabled={isSeeding}
                    >
                        Seed Categories
                    </button>
                </div>

            </div>

            {confirmType && (
                <div
                    className={Style.modalOverlay}
                    onClick={() => !isSeeding && setConfirmType(null)}
                >
                    <div
                        className={Style.modal}
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Header */}
                        <div className={Style.modalHeader}>
                            <div className={Style.icon}>
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>

                            <div>
                                <h3>Confirm Seeding</h3>
                                <p>This action cannot be undone</p>
                            </div>
                        </div>

                        <div className={Style.modalBody}>
                            {isSeeding ? (
                                <p>Seeding in progress... please wait</p>
                            ) : done ? (
                                <p className={Style.successText}>
                                    Seeding completed successfully
                                </p>
                            ) : (
                                <>
                                    You are about to seed{" "}
                                    <strong>{confirmType}</strong>.
                                    This may overwrite existing data.
                                </>
                            )}
                        </div>

                        <div className={Style.modalFooter}>
                            <button
                                className={Style.cancelBtn}
                                onClick={() => setConfirmType(null)}
                                disabled={isSeeding}
                            >
                                Cancel
                            </button>

                            <button
                                className={Style.confirmBtn}
                                onClick={handleConfirm}
                                disabled={isSeeding}
                            >
                                {isSeeding ? (
                                    <div className={Style.loaderWrapper}>
                                        <BeatLoader size={8} color="#fff" />
                                    </div>
                                ) : done ? (
                                    "Done ✓"
                                ) : (
                                    "Yes, Seed Now"
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}