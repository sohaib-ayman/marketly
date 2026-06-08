import React, { useState, useContext } from "react";
import Style from "./AdminDashboard.module.css";
import { Helmet } from "react-helmet-async";
import UsersManagement from "../../Components/UsersManagement/UsersManagement";
import ProductsManagement from "../../Components/ProductsManagement/ProductsManagement";
import OrdersManagement from "../../Components/OrdersManagement/OrdersManagement";
import SeedingManagement from "../../Components/SeedingManagement/SeedingManagement";
import BackupManagement from "../../Components/BackupManagement/BackupManagement";
import { UserContext } from "../../Context/UserContext";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users");
    const { user } = useContext(UserContext);

    return <>
        <Helmet>
            <title>Admin Dashboard | Marketly</title>
            <meta name="description" content="Manage products, users, orders, backups, and system settings from the Marketly admin dashboard." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <section className={Style.adminDashboard}>
            <div className="container">

                <div className={Style.header}>
                    <h1>Admin Dashboard</h1>
                    <p>Manage products, users, orders, backups and system settings.</p>
                </div>

                <div className={Style.tabs}>
                    <button className={`${Style.tabBtn} ${activeTab === "users" ? Style.active : ""} bg-transparent`} onClick={() => setActiveTab("users")}>
                        <i className="fa-solid fa-user-group"></i> Users Management
                    </button>

                    <button className={`${Style.tabBtn} ${activeTab === "products" ? Style.active : ""} bg-transparent`} onClick={() => setActiveTab("products")}>
                        <i className="fa-solid fa-box-open"></i> Products Management
                    </button>

                    <button className={`${Style.tabBtn} ${activeTab === "orders" ? Style.active : ""} bg-transparent`} onClick={() => setActiveTab("orders")}>
                        <i className="fa-solid fa-dolly"></i> Orders Management
                    </button>

                    {user?.role === "owner" && (
                        <button className={`${Style.tabBtn} ${activeTab === "seeding" ? Style.active : ""} bg-transparent`} onClick={() => setActiveTab("seeding")}>
                            <i className="fa-solid fa-database"></i> Seeding
                        </button>
                    )}

                    {user?.role === "owner" && (
                        <button className={`${Style.tabBtn} ${activeTab === "backup" ? Style.active : ""} bg-transparent`} onClick={() => setActiveTab("backup")}>
                            <i className="fa-solid fa-box-archive"></i> Backup
                        </button>
                    )}
                </div>

                {activeTab === "users" && <UsersManagement />}
                {activeTab === "products" && <ProductsManagement />}
                {activeTab === "orders" && <OrdersManagement />}
                {activeTab === "seeding" && user?.role === "owner" && (<SeedingManagement />)}
                {activeTab === "backup" && user?.role === "owner" && (<BackupManagement />)}

            </div>
        </section>
    </>
}