import { createContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export const DataContext = createContext();

export default function DataContextProvider(props) {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeProducts = onSnapshot(
            collection(db, "products"),
            (snapshot) => {

                const productsData = snapshot.docs.map(doc => {
                    const p = doc.data();

                    return {
                        ...p,
                        id: p.id ?? Number(doc.id),
                        category:
                            typeof p.category === "object"
                                ? p.category.slug
                                : p.category || "",
                        images:
                            Array.isArray(p.images) && p.images.length > 0
                                ? p.images
                                : p.thumbnail
                                    ? [p.thumbnail]
                                    : ["https://placehold.co/600x400"],
                        thumbnail:
                            p.thumbnail ||
                            (Array.isArray(p.images) ? p.images[0] : ""),
                        slug:
                            p.slug ||
                            p.title?.toLowerCase().replace(/\s+/g, "-"),
                    };
                });
                const counter = {};
                productsData.forEach(product => {
                    counter[product.category] =
                        (counter[product.category] || 0) + 1;
                });

                setProducts(productsData);
                setCounts(counter);
                setLoading(false);
            },
            (error) => {
                console.error(error);
                toast.error("Failed to load products");
            }
        );
        const unsubscribeCategories = onSnapshot(
            collection(db, "categories"),
            (snapshot) => {

                const categoriesData = snapshot.docs.map(doc => {
                    const c = doc.data();

                    return {
                        ...c,
                        id: c.id ?? doc.id,
                        slug:
                            c.slug ||
                            c.name?.toLowerCase().replace(/\s+/g, "-"),
                    };
                });

                setCategories(categoriesData);
            },
            (error) => {
                console.error(error);
                toast.error("Failed to load categories");
            }
        );
        return () => {
            unsubscribeProducts();
            unsubscribeCategories();
        };

    }, []);

    return <>
        <DataContext.Provider value={{ products, categories, counts, loading}}>
            {props.children}
        </DataContext.Provider>
    </>
}