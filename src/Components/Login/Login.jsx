import React, { useState, CSSProperties } from "react";
import Style from './Login.module.css'
import { PulseLoader } from "react-spinners"
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseErrorMessage } from "../../firebaseErrors";
import { auth } from "../../firebase";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Login() {
    let [isLoading, setIsLoading] = useState(false)
    let [color, setColor] = useState("#ffffff");
    let navigate = useNavigate();
    let [error, setError] = useState(null);
    let location = useLocation();
    let from = location.state?.from;

    async function handleGuestLogin() {
        try {
            toast.success("You're browsing as a guest");
            navigate('/')
        } catch (err) {
            toast.error("Something went wrong");
        }
    }

    async function submitLogin(values) {
        setIsLoading(true);

        try {
            let userCred = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );

            if (from) {
                toast.success("You're in! Continue your checkout");
            } else {
                toast.success(`Welcome back, ${userCred.user.displayName || "User"}!`);
            }

            navigate(from || "/");

        } catch (err) {
            let message = getFirebaseErrorMessage(err.code);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    let validationSchema = Yup.object({
        email: Yup.string().email('Enter a valid email').required('Email is required'),
        password: Yup.string().matches(/^[A-Za-z0-9]{8,15}$/, 'Password must be more than 8 characters').required('Password is required'),
    })

    let formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        }, validationSchema
        , onSubmit: submitLogin
    })

    return <>
        <Helmet>
            <title>Login | Marketly</title>
            <meta name="description" content="Shop smarter with Marketly. Discover trending products, exclusive deals, and a seamless shopping experience designed for you." />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className={`${Style.login} mt-4 w-100 min-vh-100`}>
            <div className={`container mb-5 ${Style.loginCard}`}>
                <form onSubmit={formik.handleSubmit}>
                    <div className={`m-auto py-5 d-flex flex-column align-items-center ${Style.formContainer}`}>
                        <div className={Style.user}>
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <h2 className="mt-3">Welcome Back</h2>
                        <p className="mb-2">Sign in to your account</p>
                        <div className="w-100">
                            <label htmlFor="email" className="mt-3 mb-2">Email</label>
                            <div className={Style.inputField}>
                                <i className="fa-regular fa-envelope"></i>
                                <input id="email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} className="form-control" type="email" name="email" placeholder="your@email.com" />
                            </div>
                            {formik.errors.email && formik.touched.email ? <div className="alert alert-danger p-2 mt-2 mb-0">{formik.errors.email}</div> : ''}
                        </div>
                        <div className="w-100">
                            <label htmlFor="password" className="mt-3 mb-2">Password</label>
                            <div className={Style.inputField}>
                                <i className="fa-solid fa-lock"></i>
                                <input id="password" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} className="form-control" type="password" name="password" placeholder="At least 6 characters" />
                            </div>
                            {formik.errors.password && formik.touched.password ? <div className="alert alert-danger p-2 mt-2 mb-0">{formik.errors.password}</div> : ''}
                        </div>
                        {(isLoading) ? <button disabled className={`${Style.loginBTN} text-white mt-5 mb-4 w-100 d-flex justify-content-center align-items-center`} type="button"><PulseLoader color={color} size={10} /></button> : <button disabled={!(formik.isValid && formik.dirty)} type="submit" className={`btn ${Style.loginBTN} text-white mt-5 mb-4 w-100`}>Sign In</button>}
                        <p className={Style.dividerText}>New to Marketly?</p>
                        <Link type="button" className={`btn w-100 d-flex justify-content-center align-items-center ${Style.registerBTN}`} to={'/register'} state={{ from }}>Create New Account</Link>
                        <button type="button" className={` mt-3 link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover bg-transparent border-0 ${Style.loginGuest}`} onClick={handleGuestLogin}>Continue as Guest →</button>
                    </div>
                </form>
            </div>
        </div>
    </>
}