import React, { useState } from "react";
import Style from "./Footer.module.css";

export default function Footer() {
    const [modalType, setModalType] = useState(null);

    return <>
        <footer className={Style.footer}>
            <p>
                © {new Date().getFullYear()} Marketly ·{" "}
                <button className="bg-transparent" onClick={() => setModalType("terms")}>Terms of Service</button>
                {" "}·{" "}
                <button className="bg-transparent" onClick={() => setModalType("privacy")}>Privacy Policy</button>
            </p>
        </footer>

        {modalType && (
            <div className={Style.modalOverlay} onClick={() => setModalType(null)}>
                <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
                    <h2>{modalType === "terms" ? "Terms of Service" : "Privacy Policy"}</h2>
                    {modalType === "terms" ? (
                        <>
                            <p>By using Marketly, you agree to use the platform responsibly and lawfully.</p>
                            <ul>
                                <li>No abuse, spam, or unauthorized access.</li>
                                <li>You are responsible for your account security.</li>
                                <li>Violation may result in account suspension.</li>
                            </ul>
                        </>
                    ) : (
                        <>
                            <p>We collect only the information necessary to provide our services.
                            </p>
                            <ul>
                                <li>Email address and username.</li>
                                <li>Used for account management and security.</li>
                                <li>We do not sell your personal data.</li>
                            </ul>
                        </>
                    )}

                    <button className={Style.closeBtn} onClick={() => setModalType(null)}>Close</button>
                </div>
            </div>
        )}
    </>
}