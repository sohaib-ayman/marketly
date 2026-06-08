import React, { useContext, useEffect, useState } from "react";
import Style from "./MyOrders.module.css";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export default function MyOrders() {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusClassMap = {
        Placed: Style.placed,
        Processing: Style.processing,
        Shipped: Style.shipped,
        Delivered: Style.delivered,
    };

    useEffect(() => {
        if (!user || user.isAnonymous) {
            setOrders([]);
            setLoading(false);
            return;
        }

        async function fetchOrders() {
            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );

                const snapshot = await getDocs(q);

                const fetchedOrders = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setOrders(fetchedOrders);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [user]);

    if (loading) return <LoadingScreen />;

    if (orders.length === 0) {
        return <>
            <Helmet>
                <title>My Orders | Marketly</title>
                <meta name="description" content="View your order history and track your purchases on Marketly." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className={Style.emptyState}>
                <h1>My Orders</h1>
                <p>No orders found.</p>
            </div>
        </>
    }

    return <>
        <Helmet>
            <title>My Orders | Marketly</title>
            <meta name="description" content="View your order history and track your purchases on Marketly." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className={Style.ordersPage}>
            <div className={Style.container}>
                <h1 className={Style.pageTitle}>My Orders</h1>
                {orders.map((order) => (
                    <div key={order.id} className={Style.orderCard}>
                        <div className={Style.orderHeader}>
                            <div>
                                <div className={Style.topRow}>
                                    <h2>Order {order.orderId}</h2>
                                    <span className={`${Style.statusBadge} ${statusClassMap[order.status] || Style.processing}`}>{order.status}</span>
                                </div>
                                <div className={Style.metaRow}>
                                    <span>Placed on{" "} {order.createdAt ? new Date(order.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )
                                        : "Unknown"}
                                    </span>

                                    <span>•</span>

                                    <strong>Total: ${order.total.toFixed(2)}</strong>
                                </div>
                            </div>

                            <Link to={`/track-order?orderId=${order.orderId}`} className={Style.trackBtn}><i className="fa-solid fa-truck-fast"></i> Track Order</Link>
                        </div>

                        <div className={Style.itemsList}>
                            {order.items.map((item) => (
                                <div key={item.id} className={Style.itemRow}>
                                    <img loading="lazy" src={item.thumbnail} alt={item.title} />

                                    <div className={Style.itemInfo}>
                                        <h4>{item.title}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>

                                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}