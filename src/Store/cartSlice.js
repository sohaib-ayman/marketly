import { createSlice } from '@reduxjs/toolkit';

function loadCart(userId) {
  try {
    let data = localStorage.getItem(`cart_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(userId, items) {
  localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      let existing = state.items.find(item => item.id === action.payload.product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload.product, quantity: 1 });
      }

      saveCart(action.payload.userId, state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      saveCart(action.payload.userId, state.items);
    },

    updateQuantity: (state, action) => {
      let item = state.items.find(item => item.id === action.payload.id);

      if (item) {
        item.quantity = action.payload.quantity;
      }

      saveCart(action.payload.userId, state.items);
    },

    clearCart: (state, action) => {
      state.items = [];
      saveCart(action.payload.userId, state.items);
    },

    mergeCart: (state, action) => {
      action.payload.guestItems.forEach(guestItem => {
        let existing = state.items.find(item => item.id === guestItem.id);

        if (existing) {
          existing.quantity += guestItem.quantity;
        } else {
          state.items.push(guestItem);
        }
      });

      saveCart(action.payload.userId, state.items);
    },

    loadCartForUser: (state, action) => {
      state.items = loadCart(action.payload);
    },
  },
});

export const {addToCart, removeFromCart, updateQuantity, clearCart, mergeCart, loadCartForUser} = cartSlice.actions;
export default cartSlice.reducer;