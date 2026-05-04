import React, { useContext, useState } from "react";
import Style from './CategoryPage.module.css'
import HomeStyle from '../Home/Home.module.css'
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../Context/DataContext";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Store/cartSlice";
import { UserContext } from "../../Context/UserContext";

export default function CategoryPage() {
    let { categorySlug } = useParams();
    let { categories, products } = useContext(DataContext);
    let currentCategory = categories.find((category) => category.slug === categorySlug);
    let { user } = useContext(UserContext);
    let navigate = useNavigate();
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [showFilters, setShowFilters] = useState(false);
    let [toast, setToast] = useState(null);
    let dispatch = useDispatch();

    let categoryProducts = products.filter(
        product =>
            product.category === categorySlug &&
            product.title.toLowerCase().includes(search.toLowerCase()) &&
            product.price >= minPrice &&
            product.price <= maxPrice
    );
    if (sort === "low-high") {
        categoryProducts.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
        categoryProducts.sort((a, b) => b.price - a.price);
    }

    return <>
        <div className={Style.pageContainer}>
            <Helmet>
                <title>{`${currentCategory?.name} | Marketly`}</title>
                <meta
                    name="description"
                    content={`Browse ${currentCategory?.name} products on Marketly`}
                />
            </Helmet>

            <h1>{currentCategory?.name}</h1>

            <p>{categoryProducts.length} products found</p>

            <input
                className={Style.searchBox}
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className={Style.filterRow}>
                <button
                    className={Style.filterBtn}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <i className="fa-solid fa-sliders"></i> Filters
                </button>

                <div className={Style.sortBox}>
                    <select className={Style.sortSelect}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">
                            Sort By
                        </option>

                        <option value="low-high">
                            Price Low to High
                        </option>

                        <option value="high-low">
                            Price High to Low
                        </option>
                    </select>
                </div>
            </div>

            {showFilters && (
                <div className={Style.filterPanel}>

                    <p>
                        Price Range: ${minPrice} - ${maxPrice}
                    </p>

                    <div className={Style.filterInputs}>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                        />

                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                    </div>

                    <button
                        className={Style.resetBtn}
                        onClick={() => {
                            setMinPrice(0);
                            setMaxPrice(1000);
                            setSearch("");
                        }}
                    >
                        Reset Filters
                    </button>

                </div>
            )}

            <div className={Style.productsGrid}>

                <div className="row justify-content-center gy-4">

                    {categoryProducts.map((product) => (

                        <div key={product.id} className="col-12 col-md-6 col-lg-3">

                            <div className={HomeStyle.productCard} onClick={() => navigate(`/${product.category}/${product.slug}-${product.id}`)}>

                                <div className={HomeStyle.productImg}>
                                    <img src={product.images[0]} alt={product.title} />

                                    <span className={HomeStyle.price}>
                                        ${product.price}
                                    </span>

                                    <button className={HomeStyle.addBtn} onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(addToCart({
                                            userId: user.isAnonymous ? "guest" : user.uid,
                                            product: {
                                                id: product.id,
                                                title: product.title,
                                                price: product.price,
                                                image: product.images[0],
                                            }
                                        }));
                                        setToast(product.title);
                                        setTimeout(() => setToast(null), 3000);
                                    }}>
                                        Add To Cart
                                    </button>

                                </div>

                                <div className={HomeStyle.productInfo}>
                                    <h3>{product.title}</h3>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
        </div>
        {toast && (
            <div style={{ position: "fixed", top: "20px", right: "20px", background: "#1e2a3a", color: "#ffffff", padding: "14px 20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", fontSize: "14px", fontWeight: "500", animation: "slideDown 0.3s ease" }}>
                <i className="fa-solid fa-circle-check" style={{ color: "#2ecc71" }}></i>
                {toast} added to cart!
            </div>
        )}
    </>
}