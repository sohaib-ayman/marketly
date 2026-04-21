import './App.css';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Auth from './Components/Auth/Auth';
import NotFound from './Components/NotFound/NotFound';
import TrackOrder from './Components/TrackOrder/TrackOrder';
import Checkout from './Components/Checkout/Checkout';
import Cart from './Components/Cart/Cart';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import MyOrders from './Components/MyOrders/MyOrders';
import CategoryPage from './Components/CategoryPage/CategoryPage';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HelmetProvider } from "react-helmet-async";
import UserContextProvider from './Context/UserContext';
import ThemeContextProvider from "./Context/ThemeContext";
import DataContextProvider from './Context/DataContext';

function App() {
  let routers = createBrowserRouter([
    {
      path: '', element: <Layout/>, children: [
        { index: true, element: <Home/>},
        { path: 'login', element: <Login/>},
        { path: 'register', element: <Register/>},
        { path: 'track-order', element:<TrackOrder/>},
        { path: 'checkout', element:<Auth><Checkout/></Auth>},
        { path: 'cart', element:<Cart/>},
        { path: '/:categorySlug', element:<CategoryPage/>},
        { path: '/:categorySlug/:productSlug', element:<ProductDetails/>},
        { path: 'my-orders', element:<Auth><MyOrders/></Auth>},
        { path: 'admin-dashboard', element:<Auth><AdminDashboard/></Auth>},
        { path: '*', element: <NotFound /> }
      ]
    }
  ])

  return <>
    <HelmetProvider>
      <DataContextProvider>
        <ThemeContextProvider>
          <UserContextProvider>
            <RouterProvider router={routers}></RouterProvider>
          </UserContextProvider>
        </ThemeContextProvider>
      </DataContextProvider>
    </HelmetProvider>
  </>
}

export default App;