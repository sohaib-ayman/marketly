import { createSlice } from '@reduxjs/toolkit';

function loadCart() {
  try {
    let data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem('cart', JSON.stringify(items));
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      let existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      let item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
    mergeCart: (state, action) => {
      let guestItems = action.payload;
      guestItems.forEach(guestItem => {
        let existing = state.items.find(item => item.id === guestItem.id);
        if (existing) {
          existing.quantity += guestItem.quantity;
        } else {
          state.items.push(guestItem);
        }
      });
      saveCart(state.items);
    },
  },
});

export let { addToCart, removeFromCart, updateQuantity, clearCart, mergeCart } = cartSlice.actions;
export default cartSlice.reducer;