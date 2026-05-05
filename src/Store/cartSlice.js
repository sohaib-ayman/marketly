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
      let { product, userId } = action.payload;
      let quantity = action.payload.quantity || 1;

      let existing = state.items.find(item => item.id === product.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,

          thumbnail:
            product.thumbnail ||
            product.image ||
            product.images?.[0],

          quantity,
        });
      }

      saveCart(userId, state.items);
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

export const { addToCart, removeFromCart, updateQuantity, clearCart, mergeCart, loadCartForUser } = cartSlice.actions;
export default cartSlice.reducer;