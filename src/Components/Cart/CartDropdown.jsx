import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../Store/cartSlice";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";

export default function CartDropdown({ onClose }) {
  let dispatch = useDispatch();
  let items = useSelector(state => state.cart.items);
  let { theme } = useContext(ThemeContext);
  let isLight = theme === "light";

  let totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let dropdownStyle = {
    position: "absolute",
    top: "60px",
    right: "0",
    width: "420px",
    background: isLight ? "#ffffff" : "#151c2e",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    zIndex: 1000,
  };

  function handleQuantity(id, quantity) {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  }

  return (
    <div style={dropdownStyle}>
      <h6 style={{ color: isLight ? "#111827" : "#ffffff", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <i className="fa-solid fa-bag-shopping" style={{ color: "#4f8ef7" }}></i> Shopping Cart
      </h6>

      {items.length === 0 ? (
        <p style={{ color: isLight ? "#6b7280" : "#8892a4", textAlign: "center", padding: "20px 0" }}>
          Your cart is empty
        </p>
      ) : (
        <>
          {items.slice(0, 3).map(item => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: `1px solid ${isLight ? "#e5e7eb" : "#1e2a3a"}`
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  background: isLight ? "#f3f4f6" : "#1e2a3a"
                }}
              />

              <div style={{ flex: 1 }}>
                <p style={{ color: isLight ? "#111827" : "#ffffff", fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>
                  {item.title}
                </p>

                <p style={{ color: "#4f8ef7", fontSize: "13px", marginBottom: "8px" }}>
                  ${item.price}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => handleQuantity(item.id, item.quantity - 1)}
                    style={{
                      background: isLight ? "#f3f4f6" : "#1e2a3a",
                      border: "none",
                      color: isLight ? "#111827" : "#ffffff",
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "11px"
                    }}
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>

                  <span style={{ color: isLight ? "#111827" : "#ffffff", fontSize: "14px" }}>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQuantity(item.id, item.quantity + 1)}
                    style={{
                      background: isLight ? "#f3f4f6" : "#1e2a3a",
                      border: "none",
                      color: isLight ? "#111827" : "#ffffff",
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "11px"
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#e74c3c",
                      cursor: "pointer",
                      marginLeft: "4px"
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

              <span style={{ color: isLight ? "#111827" : "#ffffff", fontWeight: "700", fontSize: "14px" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          {items.length > 3 && (
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                color: "#4f8ef7",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              +{items.length - 3} more items
            </div>
          )}

          <div
            style={{
              background: isLight ? "#f3f4f6" : "#1e2a3a",
              borderRadius: "10px",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}
          >
            <span style={{ color: isLight ? "#111827" : "#ffffff", fontWeight: "600" }}>
              Subtotal:
            </span>

            <span style={{ color: "#4f8ef7", fontWeight: "700", fontSize: "18px" }}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <Link
            to="/cart"
            onClick={onClose}
            style={{
              display: "block",
              textAlign: "center",
              background: isLight ? "#e5e7eb" : "#2a3a4a",
              color: isLight ? "#111827" : "#ffffff",
              padding: "12px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              marginBottom: "10px"
            }}
          >
            View Cart
          </Link>

          <Link
            to="/checkout"
            onClick={onClose}
            style={{
              display: "block",
              textAlign: "center",
              background: "linear-gradient(90deg, #6c5ce7, #4fc3f7)",
              color: "#ffffff",
              padding: "12px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            Login to Checkout
          </Link>
        </>
      )}
    </div>
  );
}