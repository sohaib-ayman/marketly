import React, { useContext, useEffect, useRef, useState } from "react";
import Style from './Navbar.module.css'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { ThemeContext } from "../../Context/ThemeContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { BeatLoader } from "react-spinners";
import { DataContext } from "../../Context/DataContext";
import CartDropdown from "../Cart/CartDropdown";
import { useSelector } from "react-redux";

export default function Navbar() {
    let [color, setColor] = useState("#ffffff");
    let { user, loading, role } = useContext(UserContext);
    let { theme, toggleTheme } = useContext(ThemeContext);
    let navigate = useNavigate();
    let [isOpen, setIsOpen] = useState(false);
    let [cartOpen, setCartOpen] = useState(false);
    let [cartVisible, setCartVisible] = useState(false);
    let [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    let location = useLocation();
    let isAdmin = role === "admin";
    let isLoggedIn = user && !user.isAnonymous;
    let [loggingOut, setLoggingOut] = useState(false);
    let { categories } = useContext(DataContext);

    let cartItems = useSelector(state => state.cart.items);
    let cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    let cartTimeoutRef = useRef(null);

    function openCartDropdown() {
        clearTimeout(cartTimeoutRef.current);
        setCartOpen(true);
        setCartVisible(true);
    }

    function closeCartDropdown() {
        setCartVisible(false);

        cartTimeoutRef.current = setTimeout(() => {
            setCartOpen(false);
        }, 300);
    }
    useEffect(() => {
        let handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    async function logOut() {
        setLoggingOut(true);
        await signOut(auth);
        navigate('/login');
    }

    useEffect(() => {
        setLoggingOut(false);
    }, [user]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (!e.target.closest(`.${Style.dropdownMenu}`) &&
                !e.target.closest(`.${Style.userBTN}`)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <Link className="navbar-brand" to={"/"}><img src="/Logo.png" alt="Bootstrap" width="150" /></Link>
                <div className="d-flex d-lg-none align-items-center gap-2 ms-auto">
                    <button className={Style.iconBTN} onClick={toggleTheme}>{theme === "light" ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}</button>
                    <Link className={`${Style.iconBTN} me-2 text-decoration-none`} to={"/cart"}><i className="fa-solid fa-cart-shopping"></i>
                        <span className={Style.cartBadge}>{cartCount}</span>
                    </Link>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto ms-auto">
                        <li><Link className={`nav-link ${Style.navLink} ms-2 me-2`} to="/"><span className={`${Style.categoryLink} ${location.pathname === "/" ? Style.activeCategory : ""}`}>Home</span></Link></li>
                        {categories.map((Category) => (
                            <li key={Category.id}><Link to={`/${Category.slug}`} className={`nav-link ${Style.navLink} ms-2 me-2`}>
                                <span className={`${Style.categoryLink} ${location.pathname.startsWith(`/${Category.slug}`) ? Style.activeCategory : ""}`}> {Category.name} </span>
                            </Link>
                            </li>
                        ))}
                        <li><Link to="/track-order" className={`nav-link ${Style.navLink} ms-2 me-2`}><span className={`${Style.categoryLink} ${location.pathname.includes("/track-order") ? Style.activeCategory : ""}`}>Track Order</span></Link></li>
                    </ul>

                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="ms-2 me-2 nav-item">
                            <button className={`${Style.iconBTN} d-none d-lg-block`} onClick={toggleTheme}>{theme === "light" ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}</button></li>
                        {(isLoggedIn) && isMobile && (
                            <>
                                <hr />
                                <li className="nav-item mb-1 text-muted"> Logged in as: <strong>{user?.displayName || "User"}</strong></li>
                                <li className="nav-item"><Link className="nav-link" to="/my-orders"><i className="fa-solid fa-box-open me-2"></i> My Orders</Link></li>
                                {isAdmin ? (<li className="nav-item"><Link className="nav-link" to="/admin-dashboard"><i className="fa-solid fa-chart-column me-2"></i> Admin Dashboard</Link></li>) : null}
                                <li className="nav-item"><button onClick={logOut} className="nav-link text-danger border-0 bg-transparent"><i className="fa-solid fa-arrow-right-to-bracket me-2"></i> Logout</button></li>
                            </>
                        )}

                        {(isLoggedIn) && !isMobile && (
                            <li className="nav-item position-relative">{loggingOut ? <button className={`btn ${Style.userLoading} d-flex justify-content-center align-items-center gap-2`}><BeatLoader color={color} size={10} /></button> : <button className={`btn ${Style.userBTN} w-100 d-flex justify-content-center align-items-center gap-2`} onClick={() => setIsOpen(!isOpen)}><i className="fa-regular fa-user"></i> {user.displayName || "User"}</button>}
                                <div className={`${Style.dropdownMenu} ${isOpen ? Style.show : ""}`}>
                                    <Link to="/my-orders" className={Style.dropdownItem}><i className="fa-solid fa-box-open"></i> My Orders</Link>
                                    {isAdmin ? (<Link to="/admin-dashboard" className={Style.dropdownItem}><i className="fa-solid fa-chart-column"></i> Admin Dashboard</Link>) : null}
                                    <hr />
                                    <button onClick={logOut} className={`${Style.dropdownItem} text-danger`}><i className="fa-solid fa-arrow-right-to-bracket"></i> Logout</button>
                                </div>
                            </li>
                        )}

                        {(!isLoggedIn) ? (
                            <li className="nav-item">{loading ? <button className={`btn ${Style.userLoading} d-flex justify-content-center align-items-center gap-2`}><BeatLoader color={color} size={10} /></button> : <Link className={`btn ${Style.loginBTN} text-white w-100 d-flex justify-content-center align-items-center gap-2 mt-3 mt-md-0`} to={"/login"}><i className="fa-solid fa-arrow-right-to-bracket"></i> Login</Link>}</li>) : ""}
                        <li
                            className="ms-2 me-2 nav-item d-none d-lg-block position-relative"
                            onMouseEnter={openCartDropdown}
                            onMouseLeave={closeCartDropdown}
                        >
                            <Link
                                to="/cart"
                                className={Style.iconBTN}
                                style={{ textDecoration: "none" }}
                            >
                                <i className="fa-solid fa-cart-shopping"></i>
                                <span className={Style.cartBadge}>{cartCount}</span>
                            </Link>

                            {cartOpen && (
                                <div
                                    onMouseEnter={openCartDropdown}
                                    onMouseLeave={closeCartDropdown}
                                    style={{
                                        opacity: cartVisible ? 1 : 0,
                                        transition: "opacity 0.3s ease"
                                    }}
                                >
                                    <CartDropdown onClose={closeCartDropdown} />
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
}