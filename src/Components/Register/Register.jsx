import React, { useState, CSSProperties, useEffect } from "react";
import Style from './Register.module.css'
import { PulseLoader } from "react-spinners"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirebaseErrorMessage } from "../../firebaseErrors";
import { auth } from "../../firebase";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Register() {
    let [isLoading, setIsLoading] = useState(false)
    let [color, setColor] = useState("#ffffff");
    let navigate = useNavigate();
    let [error, setError] = useState(null);
    let [showModal, setShowModal] = useState(false);
    let [modalType, setModalType] = useState("");
    let location = useLocation();
    let from = location.state?.from;

    useEffect(() => {
        let handleKey = (e) => {
            if (e.key === "Escape") setShowModal(false);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    async function handleGuestLogin() {
        try {
            toast.success("You're browsing as a guest");
            navigate('/')
        } catch (err) {
            toast.error("Something went wrong");
        }
    }

    async function submitRegister(values) {
        setIsLoading(true);

        try {
            let userCred = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );

            await updateProfile(userCred.user, {
                displayName: values.userName
            });

            toast.success(`Welcome, ${values.userName}!`)
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
        userName: Yup.string().min(3, 'Username minLength is 3').max(10, 'Name maxLength is 10').required('Username is required'),
        password: Yup.string().matches(/^[A-Za-z0-9]{8,15}$/, 'Password must be more than 8 characters').required('Password is required'),
    })

    let formik = useFormik({
        initialValues: {
            email: '',
            userName: '',
            password: ''
        }, validationSchema
        , onSubmit: submitRegister
    })
    return <>
        <Helmet>
            <title>Register | Marketly</title>
            <meta name="description" content="Create your Marketly account and start exploring" />
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className={`${Style.register} mt-4 w-100 min-vh-100`}>
            <div className={`container ${Style.registerCard}`}>
                <form onSubmit={formik.handleSubmit}>
                    <div className={`m-auto py-5 d-flex flex-column align-items-center ${Style.formContainer}`}>
                        <div className={Style.user}>
                            <i className="fa-regular fa-user"></i>
                        </div>
                        <h2 className="mt-3">Create Account</h2>
                        <p className="mb-2">Join Marketly today</p>
                        {error ? <div className="alert alert-danger">{error}</div> : null}
                        <div className="w-100">
                            <label htmlFor="email" className="mt-3 mb-2">Email</label>
                            <div className={Style.inputField}>
                                <i className="fa-regular fa-envelope"></i>
                                <input id="email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} className="form-control" type="email" name="email" placeholder="your@email.com" />
                            </div>
                            {formik.errors.email && formik.touched.email ? <div className="alert alert-danger p-2 mt-2 mb-0">{formik.errors.email}</div> : ''}
                        </div>
                        <div className="w-100">
                            <label htmlFor="userName" className="mt-3 mb-2">Username</label>
                            <div className={Style.inputField}>
                                <i className="fa-regular fa-user"></i>
                                <input id="userName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userName} className="form-control" type="text" name="userName" placeholder="Choose a username" />
                            </div>
                            {formik.errors.userName && formik.touched.userName ? <div className="alert alert-danger p-2 mt-2 mb-0">{formik.errors.userName}</div> : ''}
                        </div>
                        <div className="w-100">
                            <label htmlFor="password" className="mt-3 mb-2">Password</label>
                            <div className={Style.inputField}>
                                <i className="fa-solid fa-lock"></i>
                                <input id="password" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} className="form-control" type="password" name="password" placeholder="At least 6 characters" />
                            </div>
                            {formik.errors.password && formik.touched.password ? <div className="alert alert-danger p-2 mt-2 mb-0">{formik.errors.password}</div> : ''}
                        </div>
                        {(isLoading) ? <button disabled className={`${Style.registerBTN} text-white mt-5 mb-4 w-100 d-flex justify-content-center align-items-center`} type="button"><PulseLoader color={color} size={10} /></button> : <button disabled={!(formik.isValid && formik.dirty)} type="submit" className={`btn ${Style.registerBTN} text-white mt-5 mb-4 w-100`}>Create Account</button>}
                        <p className={Style.dividerText}>Already have an account?</p>
                        <Link type="button" className={`btn w-100 d-flex justify-content-center align-items-center ${Style.loginBTN}`} to={'/login'} state={{ from }}>Sign In Instead</Link>
                        <button type="button" className={` mt-3 link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover bg-transparent border-0 ${Style.registerGuest}`} onClick={handleGuestLogin}>Continue as Guest →</button>
                    </div>
                </form>
            </div>
            <p className={`${Style.registerFooter} mt-4 mb-5 text-center`}>By creating an account, you agree to our{" "}
                <span className="link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover" onClick={() => {
                    setModalType("terms");
                    setShowModal(true);
                }}
                    style={{ cursor: "pointer" }}>Terms of Service</span>
                {" "}and<br />
                <span className="link-primary link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover" onClick={() => {
                    setModalType("privacy");
                    setShowModal(true);
                }}
                    style={{ cursor: "pointer" }}>Privacy Policy
                </span>
            </p>
        </div>

        {showModal && (
            <div className={Style.modalOverlay} onClick={() => setShowModal(false)}>
                <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
                    <h2>{modalType === "terms" ? "Terms of Service" : "Privacy Policy"}</h2>
                    {modalType === "terms" ? (
                        <div>
                            <h5>Welcome to Marketly</h5>
                            <p>
                                By creating an account, you agree to use our platform responsibly
                                and in accordance with these terms.
                            </p>

                            <h6 className="mt-3">What you agree to:</h6>
                            <ul>
                                <li>Use the service only for legal purposes</li>
                                <li>Do not attempt to access other users' data</li>
                                <li>Avoid spamming or abusing the platform</li>
                            </ul>

                            <h6 className="mt-3">Account Responsibility</h6>
                            <p>
                                You are responsible for maintaining the confidentiality of your
                                account and password.
                            </p>

                            <h6 className="mt-3">Termination</h6>
                            <p>
                                We may suspend or terminate accounts that violate these terms
                                without prior notice.
                            </p>

                            <h6 className="mt-3">Updates</h6>
                            <p>
                                These terms may be updated at any time. Continued use means you
                                accept any changes.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h5>Your Privacy Matters</h5>
                            <p>
                                We are committed to protecting your personal information and
                                ensuring transparency in how it is used.
                            </p>

                            <h6 className="mt-3">Information We Collect</h6>
                            <ul>
                                <li>Email address</li>
                                <li>Username</li>
                            </ul>

                            <h6 className="mt-3">How We Use Your Data</h6>
                            <ul>
                                <li>To create and manage your account</li>
                                <li>To improve user experience</li>
                                <li>To maintain security</li>
                            </ul>

                            <h6 className="mt-3">Data Protection</h6>
                            <p>
                                Your data is securely stored using trusted services like Firebase.
                                We do not sell or share your personal data.
                            </p>

                            <h6 className="mt-3">Your Responsibility</h6>
                            <p>
                                You are responsible for keeping your login credentials secure.
                            </p>
                        </div>
                    )}
                    <button className="btn btn-danger mt-3" onClick={() => setShowModal(false)}>Close</button>
                </div>
            </div>
        )}
    </>
}