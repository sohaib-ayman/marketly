import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';

export let DataContext = createContext();

export default function DataContextProvider(props) {
    let [products, setProducts] = useState([]);
    let [categories, setCategories] = useState([]);
    let [counts, setCounts] = useState({});
    let [loading, setLoading] = useState(true);

    async function fetchData() {
        try {
            let [productsResult, categoriesResult] = await Promise.all([
                axios.get("https://api.escuelajs.co/api/v1/products"),
                axios.get("https://api.escuelajs.co/api/v1/categories"),
            ]);

            let productsData = productsResult.data;
            let categoriesData = categoriesResult.data;

            let productsCounter = {};
            productsData.forEach((product) => {
                let CategoryID = product.category.id;
                productsCounter[CategoryID] = (productsCounter[CategoryID] || 0) + 1;
            });

            setProducts(productsData);
            setCategories(categoriesData.slice(0, 5));
            setCounts(productsCounter);
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ products, categories, counts, loading }}>
            {props.children}
        </DataContext.Provider>
    );
}