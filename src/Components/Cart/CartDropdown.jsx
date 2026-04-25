import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../Store/cartSlice";
import { Link } from "react-router-dom";
import Style from "./CartDropdown.module.css";
import { UserContext } from "../../Context/UserContext";

export default function CartDropdown({ onClose }) {
  let dispatch = useDispatch();
  let items = useSelector(state => state.cart.items);
  let totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let { user } = useContext(UserContext);
  let isLoggedIn = user && !user.isAnonymous;

  function handleQuantity(id, quantity) {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  }

  return (
    <div className={Style.cartDropdown}>
      <h6 className={Style.cartDropdownTitle}>
        <i className={`fa-solid fa-bag-shopping ${Style.cartDropdownIcon}`}></i> Shopping Cart
      </h6>

      {items.length === 0 ? (
        <p className={Style.cartEmptyText}>Your cart is empty</p>
      ) : (
        <>
          {items.slice(0, 3).map(item => (
            <div key={item.id} className={Style.cartItemRow}>
              <img src={item.image} alt={item.title} className={Style.cartItemImg} />
              <div style={{ flex: 1 }}>
                <p className={Style.cartProductTitle}>{item.title}</p>
                <p className={Style.cartProductPrice}>${item.price}</p>
                <div className={Style.cartQtyControl}>
                  <button onClick={() => handleQuantity(item.id, item.quantity - 1)} className={Style.cartQtyBtn}>
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <span className={Style.cartQtySpan}>{item.quantity}</span>
                  <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className={Style.cartQtyBtn}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                  <button onClick={() => dispatch(removeFromCart(item.id))} className={Style.cartRemoveBtn}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              <span className={Style.cartItemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          {items.length > 3 && (
            <Link to="/cart" onClick={onClose} className={Style.cartMoreItems}>
              +{items.length - 3} more items
            </Link>
          )}

          <div className={Style.cartSubtotalBox}>
            <span className={Style.cartSubtotalLabel}>Subtotal:</span>
            <span className={Style.cartSubtotalPrice}>${totalPrice.toFixed(2)}</span>
          </div>

          <Link to="/cart" onClick={onClose} className={Style.cartViewBtn}>
            View Cart
          </Link>
          <Link to="/checkout" onClick={onClose} className={Style.cartCheckoutBtn}>
            {isLoggedIn ? "Checkout" : "Login to Checkout"}
          </Link>
        </>
      )}
    </div>
  );
}