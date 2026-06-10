import React, { useContext, useState } from "react";
import Style from "./Checkout.module.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { clearCart } from "../../Store/cartSlice";
import { UserContext } from "../../Context/UserContext";
import { PropagateLoader } from "react-spinners";

function generateOrderId() {
  const random = Math.floor(100 + Math.random() * 900);
  return `ORD-${new Date().getFullYear()}-${random}`;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Checkout() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  if (items.length === 0 && !orderCompleted) {
    toast.error("Your cart is empty");
    return <Navigate to="/cart" replace />;
  }

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCompleteOrder() {
    if (!navigator.onLine) {
      toast.error("Please Check your internet connection and try again", {
      });
      return;
    }
    if (isSubmitting) return;

    const { name, email, address, city, zip, cardNumber, expiry, cvv } =
      formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !address.trim() ||
      !city.trim() ||
      !zip.trim() ||
      !cardNumber.trim() ||
      !expiry.trim() ||
      !cvv.trim()
    ) {
      toast.error("Please fill all checkout fields");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Card number must be 16 digits");
      return;
    }

    if (cvv.length < 3) {
      toast.error("Invalid CVV");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();

      const orderData = {
        orderId,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        subtotal,
        tax,
        total,
        status: "Processing",

        customer: {
          name,
          email,
          address,
          city,
          zip,
        },

        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail || item.image,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      await setDoc(doc(db, "orders", orderId), orderData);

      dispatch(
        clearCart({
          userId: user.isAnonymous ? "guest" : user.uid,
        }),
      );

      setOrderCompleted(true);

      toast.success("Order placed successfully!");

      navigate("/my-orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Marketly</title>
        <meta
          name="description"
          content="Complete your purchase securely on Marketly."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className={Style.checkoutPage}>
        <h1 className={Style.pageTitle}>Checkout</h1>
        <div className={Style.checkoutGrid}>
          <div className={Style.formsSection}>
            <div className={Style.card}>
              <div className={Style.titleRow}>
                <div className={Style.titleIcon}>
                  <i className="fa-regular fa-user"></i>
                </div>
                <h2 className={Style.sectionTitle}>Personal Information</h2>
              </div>
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={Style.card}>
              <div className={Style.titleRow}>
                <div className={Style.titleIcon}>
                  <i className="fa-solid fa-location-dot"></i>
                </div>

                <h2 className={Style.sectionTitle}>Shipping Address</h2>
              </div>
              <label>Street Address *</label>
              <input
                type="text"
                name="address"
                required
                autoComplete="street-address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={handleChange}
              />
              <div className={Style.twoCols}>
                <div>
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    autoComplete="address-level2"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    autoComplete="postal-code"
                    placeholder="10001"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={Style.card}>
              <div className={Style.titleRow}>
                <div className={Style.titleIcon}>
                  <i className="fa-regular fa-credit-card"></i>
                </div>
                <h2 className={Style.sectionTitle}>Payment Information</h2>
              </div>
              <label>Card Number *</label>
              <input
                type="text"
                name="cardNumber"
                required
                inputMode="numeric"
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
              />
              <div className={Style.twoCols}>
                <div>
                  <label>Expiry Date *</label>
                  <input
                    type="text"
                    name="expiry"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>CVV *</label>

                  <input
                    type="password"
                    name="cvv"
                    required
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button className={Style.completeBtn} onClick={handleCompleteOrder} disabled={isSubmitting}>
              {isSubmitting ? (<PropagateLoader color="#fff" size={10} />) : ("Complete Order")}
            </button>
          </div>

          <div className={Style.summaryCard}>
            <h2 className={Style.summaryTitle}>Order Summary</h2>

            {items.map((item) => (
              <div key={item.id} className={Style.summaryItem}>
                <img src={item.thumbnail || item.image} alt={item.title} />

                <div>
                  <h4>{item.title}</h4>
                  <p>
                    ${item.price.toFixed(2)}
                    {" × "}
                    {item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <hr />

            <div className={Style.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className={Style.summaryRow}>
              <span>Shipping</span>
              <span className={Style.free}>FREE</span>
            </div>

            <div className={Style.summaryRow}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className={Style.totalRow}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
