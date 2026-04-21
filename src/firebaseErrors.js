export function getFirebaseErrorMessage(code) {
    return firebaseErrorMessages[code] || "Something went wrong";
}

export const firebaseErrorMessages = {
    "auth/email-already-in-use": "This email is already registered",
    "auth/invalid-email": "Invalid email address",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/user-disabled": "This account has been disabled",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/network-request-failed": "Network error. Check your connection",

    "auth/invalid-credential": "Invalid email or password",
    "auth/missing-email": "Please enter your email",
    "auth/missing-password": "Please enter your password",
    "auth/user-token-expired": "Session expired. Please log in again",
    "auth/invalid-user-token": "Invalid session. Please log in again",

    "auth/internal-error": "Something went wrong. Please try again",
    "auth/timeout": "Request timed out. Try again",
};