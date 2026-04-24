import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

let store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export { store };
export default store;