import { createContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export let DataContext = createContext();

export default function DataContextProvider(props) {
    let [products, setProducts] = useState([]);
    let [categories, setCategories] = useState([]);
    let [counts, setCounts] = useState({});
    let [loading, setLoading] = useState(true);

    async function fetchData() {
        try {
            const [productsSnap, categoriesSnap] = await Promise.all([
                getDocs(collection(db, "products")),
                getDocs(collection(db, "categories"))
            ]);

            let productsData = productsSnap.docs.map(doc => doc.data());
            let categoriesData = categoriesSnap.docs.map(doc => doc.data());

            let productsCounter = {};

            productsData.forEach(product => {
                productsCounter[product.category] =
                    (productsCounter[product.category] || 0) + 1;
            });

            setProducts(productsData);
            setCategories(categoriesData);
            setCounts(productsCounter);

        } catch (err) {
            toast.error("Failed to load data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{
            products,
            setProducts,
            categories,
            counts,
            loading
        }}>
            {props.children}
        </DataContext.Provider>
    );
}