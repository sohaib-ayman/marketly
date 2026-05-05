import React, { useState } from "react";
import Style from "./BackupManagement.module.css";
import { db } from "../../firebase";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc
} from "firebase/firestore";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

export default function BackupManagement() {

    const [modalType, setModalType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function backupProducts() {
        const snap = await getDocs(collection(db, "products"));
        for (let p of snap.docs) {
            await setDoc(
                doc(db, "backups", "clean_backup", "products", String(p.id)),
                p.data()
            );
        }
    }

    async function backupCategories() {
        const snap = await getDocs(collection(db, "categories"));
        for (let c of snap.docs) {
            await setDoc(
                doc(db, "backups", "clean_backup", "categories", String(c.id)),
                c.data()
            );
        }
    }

    async function clearCollection(name) {
        const snap = await getDocs(collection(db, name));

        for (let d of snap.docs) {
            await deleteDoc(doc(db, name, d.id));
        }
    }

    async function restoreProducts() {
        await clearCollection("products");

        const snap = await getDocs(
            collection(db, "backups", "clean_backup", "products")
        );

        for (let p of snap.docs) {
            const data = p.data();

            await setDoc(
                doc(db, "products", String(data.id || p.id)),
                data
            );
        }
    }

    async function restoreCategories() {
        await clearCollection("categories");

        const snap = await getDocs(
            collection(db, "backups", "clean_backup", "categories")
        );

        for (let c of snap.docs) {
            const data = c.data();

            await setDoc(
                doc(db, "categories", String(data.id || c.id)),
                data
            );
        }
    }

    async function handleAction() {
        try {
            setLoading(true);
            setDone(false);

            if (modalType === "backup-products") await backupProducts();
            if (modalType === "backup-categories") await backupCategories();
            if (modalType === "restore-products") await restoreProducts();
            if (modalType === "restore-categories") await restoreCategories();

            setDone(true);
            toast.success("Done successfully");

        } catch (err) {
            console.error("FULL ERROR:", err);
            toast.error("Operation failed");
        } finally {
            setLoading(false);
        }
    }

    return <>
        <div className={Style.panel}>

            <div className={Style.header}>
                <h3>Backup Management</h3>
                <span className={Style.badge}>Owner Only</span>
            </div>

            <div className={Style.cards}>
                <div className={Style.card}>
                    <h4>Products</h4>

                    <button
                        className={Style.primaryBtn}
                        onClick={() => setModalType("backup-products")}
                    >
                        Backup
                    </button>

                    <button
                        className={Style.secondaryBtn}
                        onClick={() => setModalType("restore-products")}
                    >
                        Restore
                    </button>
                </div>

                {/* CATEGORIES */}
                <div className={Style.card}>
                    <h4>Categories</h4>

                    <button
                        className={Style.primaryBtn}
                        onClick={() => setModalType("backup-categories")}
                    >
                        Backup
                    </button>

                    <button
                        className={Style.secondaryBtn}
                        onClick={() => setModalType("restore-categories")}
                    >
                        Restore
                    </button>
                </div>

            </div>
        </div>

        {modalType && (
            <div
                className={Style.modalOverlay}
                onClick={() => !loading && setModalType(null)}
            >
                <div
                    className={Style.modal}
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className={Style.modalHeader}>
                        <div className={Style.icon}>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <h3>Confirm Action</h3>
                            <p>{modalType.replaceAll("-", " ")}</p>
                        </div>
                    </div>

                    <div className={Style.modalBody}>
                        {loading ? (
                            <div className={Style.loaderWrapper}>
                                <BeatLoader size={10} color="#fff" />
                            </div>
                        ) : done ? (
                            <p className={Style.successText}>
                                Done successfully
                            </p>
                        ) : (
                            <p>
                                {modalType.includes("restore")
                                    ? "⚠ This will DELETE current data and restore backup."
                                    : "This will save current state."}
                            </p>
                        )}
                    </div>

                    <div className={Style.modalFooter}>
                        {!loading && !done && (
                            <>
                                <button
                                    className={Style.cancelBtn}
                                    onClick={() => setModalType(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={Style.confirmBtn}
                                    onClick={handleAction}
                                >
                                    Confirm
                                </button>
                            </>
                        )}

                        {done && (
                            <button
                                className={Style.confirmBtn}
                                onClick={() => {
                                    setModalType(null);
                                    setDone(false);
                                }}
                            >
                                Close
                            </button>
                        )}
                    </div>

                </div>
            </div>
        )}
    </>
}