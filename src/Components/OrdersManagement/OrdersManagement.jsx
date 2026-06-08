import React, { useEffect, useMemo, useState } from "react";
import Style from "./OrdersManagement.module.css";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

const lockedOrders = [
    "ORD-2026-372",
    "ORD-2026-878",
    "ORD-2026-540",
    "ORD-2026-269",
];

export default function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "orders"),
            (snapshot) => {
                const data = snapshot.docs.map((docSnap) => ({
                    firestoreId: docSnap.id,
                    ...docSnap.data(),
                }));

                data.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

                setOrders(data);
            }
        );

        return () => unsubscribe();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(
            (order) =>
                order.orderId
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                order.customer?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
        );
    }, [orders, search]);

    async function updateStatus(order, newStatus) {
        try {
            await updateDoc(
                doc(db, "orders", order.firestoreId),
                {
                    status: newStatus,
                }
            );
        } catch (err) {
            console.error(err);
        }
    }

    function getStatusClass(status) {
        switch (status) {
            case "Placed":
                return Style.placed;

            case "Processing":
                return Style.processing;

            case "Shipped":
                return Style.shipped;

            case "Delivered":
                return Style.delivered;

            default:
                return "";
        }
    }

    return <>
        <div className={Style.panel}>
            <input className={Style.searchInput} placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <div className={Style.tableWrapper}>
                <table className={Style.table}>
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>CUSTOMER</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                            <th>DATE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredOrders.map((order) => {
                            const isLocked = lockedOrders.includes(order.orderId) && user?.role !== "owner";
                            return (
                                <tr key={order.firestoreId}>
                                    <td><strong>{order.orderId}</strong></td>
                                    <td>{order.customer?.name}</td>
                                    <td>${order.total?.toFixed(2)}</td>
                                    <td><div className={`${Style.statusBadge} ${getStatusClass(order.status)}`}>{order.status}</div></td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className={Style.actions}>
                                            <select className={`${Style.statusSelect} ${isLocked ? Style.lockedSelect : ""}`} value={order.status} disabled={isLocked} title={isLocked ? "Locked Order" : ""} onChange={(e) => updateStatus(order, e.target.value)}>
                                                <option value="Placed">Placed</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>

                                            <button className={`${Style.viewBtn} bg-transparent`} onClick={() => setSelectedOrder(order)}><i className="fa-regular fa-eye"></i> View</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {selectedOrder && (
            <div className={Style.modalOverlay} onClick={() => setSelectedOrder(null)}>
                <div className={Style.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={Style.modalHeader}>
                        <h3>Order Details</h3>
                        <button className={Style.closeBtn} onClick={() => setSelectedOrder(null)}><i className="fa-solid fa-x"></i></button>
                    </div>

                    <div className={Style.modalBody}>
                        <div className={Style.customerBox}>
                            <h4>Customer Information</h4>
                            <p><strong>Name:</strong>{" "}{selectedOrder.customer?.name}</p>
                            <p><strong>Email:</strong>{" "}{selectedOrder.customer?.email}</p>
                            <p><strong>Address:</strong>{" "}{selectedOrder.customer?.address}</p>
                            <p><strong>City:</strong>{" "}{selectedOrder.customer?.city}</p>
                            <p><strong>ZIP:</strong>{" "}{selectedOrder.customer?.zip}</p>
                        </div>

                        <div className={Style.itemsSection}>
                            <h4>Items</h4>
                            {selectedOrder.items?.map((item) => (
                                <div key={item.id} className={Style.itemRow}>
                                    <img src={item.thumbnail} alt={item.title} />
                                    <div className={Style.itemInfo}>
                                        <h5>{item.title}</h5>
                                        <p>Qty: {item.quantity}</p>
                                    </div>

                                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                                </div>
                            ))}
                        </div>

                        <div className={Style.summaryBox}>
                            <div className={Style.summaryRow}>
                                <span>Subtotal</span>
                                <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                            </div>

                            <div className={Style.summaryRow}>
                                <span>Tax</span>
                                <span>${selectedOrder.tax?.toFixed(2)}</span>
                            </div>

                            <div className={Style.summaryRow}>
                                <span>Total</span>
                                <strong>${selectedOrder.total?.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
}