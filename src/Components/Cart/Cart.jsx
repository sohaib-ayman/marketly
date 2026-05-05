import React, { useContext, useState } from "react";
import Style from './Cart.module.css';
import { Helmet } from "react-helmet-async";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../../Store/cartSlice";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";

export default function Cart() {
  let dispatch = useDispatch();
  let items = useSelector(state => state.cart.items);
  let { theme } = useContext(ThemeContext);
  let isLight = theme === "light";
  let [confirmId, setConfirmId] = useState(null);
  let { user } = useContext(UserContext);
  let isLoggedIn = user && !user.isAnonymous;
  let totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let cardStyle = {
    background: isLight ? "#ffffff" : "#151c2e",
    border: isLight ? "1px solid #e5e7eb" : "none",
    boxShadow: isLight ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "16px",
  };

  let titleStyle = { color: isLight ? "#111827" : "#ffffff", fontSize: "28px", fontWeight: "700", marginBottom: "24px" };
  let productTitleStyle = { color: isLight ? "#111827" : "#ffffff", fontSize: "16px", fontWeight: "600", marginBottom: "4px" };
  let priceStyle = { color: isLight ? "#6b7280" : "#8892a4", fontSize: "14px", marginBottom: "12px" };
  let imgStyle = { width: "100px", height: "100px", objectFit: "contain", borderRadius: "8px", background: isLight ? "#f3f4f6" : "#1e2a3a" };
  let qtyBtnStyle = { background: isLight ? "#f3f4f6" : "#1e2a3a", border: isLight ? "1px solid #e5e7eb" : "none", color: isLight ? "#111827" : "#ffffff", width: "32px", height: "32px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center"};
  let qtySpanStyle = { color: isLight ? "#111827" : "#ffffff", fontSize: "16px", minWidth: "20px", textAlign: "center" };
  let itemTotalStyle = { color: isLight ? "#111827" : "#ffffff", fontSize: "18px", fontWeight: "700" };
  let summaryStyle = { background: isLight ? "#ffffff" : "#151c2e", border: isLight ? "1px solid #e5e7eb" : "none", boxShadow: isLight ? "0 2px 12px rgba(0,0,0,0.06)" : "none", borderRadius: "12px", padding: "24px" };
  let summaryTitleStyle = { color: isLight ? "#111827" : "#ffffff", fontSize: "20px", fontWeight: "700" };
  let summaryRowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", color: isLight ? "#6b7280" : "#8892a4" };
  let hrStyle = { borderColor: isLight ? "#e5e7eb" : "#2a3a4a" };
  let cartUserId = user?.isAnonymous ? "guest" : user?.uid;
  
  function handleQuantity(id, quantity) {
    if (quantity < 1) {
      dispatch(removeFromCart({id, userId:cartUserId}));
      return;
    }
    dispatch(updateQuantity({id, quantity, userId:cartUserId}));
  }

  if (items.length === 0) {
    return <>
      <Helmet>
        <title>Your Cart | Marketly</title>
        <meta name="description" content="Review the items in your shopping cart, update quantities, and proceed to secure checkout on Marketly."/>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className={Style.emptyCart}>
        <i className="fa-solid fa-cart-shopping" style={{ fontSize: "80px", color: isLight ? "#d1d5db" : "#2a3a4a" }}></i>
        <h3 style={{ color: isLight ? "#111827" : "#ffffff", fontSize: "28px", fontWeight: "700" }}>Your cart is empty</h3>
        <p style={{ color: isLight ? "#6b7280" : "#8892a4" }}>Start shopping now to add items to your cart</p>
        <Link to="/" className={Style.continueBtn}>Continue Shopping</Link>
      </div>
    </>;
  }

  return <>
    <Helmet>
      <title>Your Cart | Marketly</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className="container py-5">
      <h2 style={titleStyle}>Shopping Cart</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          {items.map(item => (
            <div key={item.id} style={cardStyle}>
              <img src={item.thumbnail} alt={item.title} style={imgStyle} />
              <div style={{ flex: 1 }}>
                <h5 style={productTitleStyle}>{item.title}</h5>
                <p style={priceStyle}>${item.price} each</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button style={qtyBtnStyle} onClick={() => handleQuantity(item.id, item.quantity - 1)}>
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <span style={qtySpanStyle}>{item.quantity}</span>
                  <button style={qtyBtnStyle} onClick={() => handleQuantity(item.id, item.quantity + 1)}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                  <button style={{ background: "transparent", border: "none", color: "#e74c3c", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }} onClick={() => setConfirmId(item.id)}>
                    <i className="fa-solid fa-trash"></i> Remove
                  </button>
                </div>
              </div>
              <span style={itemTotalStyle}>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div style={summaryStyle}>
            <h5 style={summaryTitleStyle}>Order Summary</h5>
            <hr style={hrStyle} />
            <div style={summaryRowStyle}>
              <span>Subtotal</span>
              <strong style={{ color: isLight ? "#111827" : "#ffffff" }}>${totalPrice.toFixed(2)}</strong>
            </div>
            <div style={summaryRowStyle}>
              <span>Shipping</span>
              <span style={{ color: "#2ecc71", fontWeight: "600" }}>FREE</span>
            </div>
            <hr style={hrStyle} />
            <div style={summaryRowStyle}>
              <strong style={{ color: isLight ? "#111827" : "#ffffff" }}>Total</strong>
              <strong style={{ color: "#4f8ef7", fontSize: "20px" }}>${totalPrice.toFixed(2)}</strong>
            </div>
            <Link to="/checkout" className={Style.checkoutBtn}>
              {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
            </Link>
            <Link to="/" className={Style.continueLink}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>

    {confirmId && (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
        <div style={{ background: isLight ? "#ffffff" : "#1a2235", borderRadius: "12px", padding: "32px", maxWidth: "600px", width: "90%" }}>
          <h5 style={{ color: isLight ? "#111827" : "#ffffff", marginBottom: "12px" }}>Remove from cart?</h5>
          <p style={{ color: isLight ? "#6b7280" : "#8892a4", marginBottom: "24px", whiteSpace: "normal" }}>Are you sure you want to remove this item from your cart?</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button onClick={() => setConfirmId(null)} style={{ background: isLight ? "#f3f4f6" : "#2a3a4a", border: "none", color: isLight ? "#111827" : "#ffffff", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
            <button onClick={() => { dispatch(removeFromCart({id:confirmId, userId:cartUserId})); setConfirmId(null); }} style={{ background: "#e74c3c", border: "none", color: "#ffffff", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Remove</button>
          </div>
        </div>
      </div>
    )}
  </>;
}