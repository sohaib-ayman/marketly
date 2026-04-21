import { PropagateLoader } from "react-spinners";
import Style from "./LoadingScreen.module.css";

export default function LoadingScreen() {
    return (
        <div className={Style.overlay}>
            <PropagateLoader color="#4f6ef7" size={15} />
        </div>
    );
}