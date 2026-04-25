import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { categoryImages } from "../categoryImages";

export let DataContext = createContext();

export default function DataContextProvider(props) {
    let [products, setProducts] = useState([]);
    let [categories, setCategories] = useState([]);
    let [counts, setCounts] = useState({});
    let [loading, setLoading] = useState(true);

    async function fetchData() {
        try {
            let [productsResult, categoriesResult] = await Promise.all([
                axios.get("https://dummyjson.com/products?limit=0"),
                axios.get("https://dummyjson.com/products/categories"),
            ]);

            let productsData = productsResult.data.products;
            let rawCategories = categoriesResult.data;

            let featuredSlugs = ["beauty", "fragrances", "furniture", "groceries", "smartphones",];

            let formattedCategories = rawCategories
                .filter((cat) => featuredSlugs.includes(cat.slug))
                .map((cat, index) => ({
                    id: index + 1,
                    slug: cat.slug,
                    name: cat.name,
                    image: categoryImages[cat.slug],
                }));

            let productsCounter = {};

            productsData.forEach((product) => {
                productsCounter[product.category] =
                    (productsCounter[product.category] || 0) + 1;
            });

            setProducts(productsData);
            setCategories(formattedCategories);
            setCounts(productsCounter);
        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
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