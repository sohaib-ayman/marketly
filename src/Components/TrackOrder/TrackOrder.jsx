import React, { useEffect, useState } from "react";
import Style from "./TrackOrder.module.css";
import { Helmet } from "react-helmet-async";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const idFromUrl = searchParams.get("orderId");

    if (idFromUrl) {
      setOrderId(idFromUrl);
      handleTrackOrder(idFromUrl);
    }
  }, []);

  async function handleTrackOrder(customId = null) {
    const finalOrderId = typeof customId === "string" ? customId : orderId;

    if (!finalOrderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    try {
      setLoading(true);

      const ref = doc(db, "orders", finalOrderId.trim());
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        toast.error("Order not found");
        setOrder(null);
        return;
      }

      setOrder(snap.data());
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  }
  const statuses = ["placed", "processing", "shipped", "delivered"];
  const currentIndex = statuses.indexOf(order?.status?.toLowerCase());

  const progressMap = {
    0: "9%",
    1: "33.33%",
    2: "55%",
    3: "87.5%",
  };

  const progressWidth = progressMap[currentIndex] || "0%";

  const steps = [
    {
      icon: "fa-solid fa-box-open",
      label: "Order Placed",
    },
    {
      icon: "fa-regular fa-clock",
      label: "Processing",
    },
    {
      icon: "fa-solid fa-truck",
      label: "Shipped",
    },
    {
      icon: "fa-solid fa-circle-check",
      label: "Delivered",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Track Order | Marketly</title>
        <meta
          name="description"
          content="Track your Marketly order and view shipping updates."
        />
      </Helmet>

      <div className={Style.trackPage}>
        <div className={Style.container}>
          <h1 className={Style.pageTitle}>Track Your Order</h1>
          <div className={Style.card}>
            <label>Enter your Order ID</label>
            <div className={Style.searchRow}>
              <input
                type="text"
                placeholder="ORD-2026-001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <button onClick={handleTrackOrder} disabled={loading}>
                <i className="fa-solid fa-magnifying-glass"></i>{" "}
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </div>
            <p className={Style.helperText}>
              Try: ORD-2026-372, ORD-2026-878, ORD-2026-540, or ORD-2026-269
            </p>
          </div>

          {order && (
            <>
              <div className={Style.card}>
                <h2>Order Details</h2>

                <div className={Style.detailsGrid}>
                  <div>
                    <span>Order ID</span>
                    <strong>{order.orderId}</strong>
                  </div>

                  <div>
                    <span>Order Date</span>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </strong>
                  </div>

                  <div>
                    <span>Total Price</span>
                    <strong>${order.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <div className={Style.card}>
                <h2>Order Status</h2>

                <div className={Style.statusWrapper}>
                  <div className={Style.statusBaseLine}></div>

                  <div
                    className={Style.statusProgressLine}
                    style={{
                      width: progressWidth,
                      "--mobile-progress-height": progressWidth,
                    }}
                  ></div>

                  {steps.map((step, i) => (
                    <div key={i} className={Style.statusStep}>
                      <div
                        className={`${Style.statusIcon} ${
                          i <= currentIndex ? Style.active : ""
                        }`}
                      >
                        <i className={step.icon}></i>
                      </div>

                      <span>{step.label}</span>

                      {i === currentIndex && <small>Current Status</small>}
                    </div>
                  ))}
                </div>
              </div>

              <div className={Style.card}>
                <h2>Products Ordered</h2>

                <div className={Style.productsList}>
                  {order.items.map((item) => (
                    <div key={item.id} className={Style.productRow}>
                      <img loading="lazy" src={item.thumbnail} alt={item.title} />

                      <div className={Style.productInfo}>
                        <h4>{item.title}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>

                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
