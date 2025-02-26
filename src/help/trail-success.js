import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Lottie from "lottie-react";
import giftBox from "./gift-box.json"; // Import the Lottie animation

const TrialSuccess = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>

            <p style={styles.subText}>
                You've unlocked a <strong>3-day free trial</strong> of Edusify! 🚀
            </p>

            {/* 🎁 Gift Box Animation */}
            <div style={styles.giftContainer}>
                <Lottie animationData={giftBox} loop={true} style={styles.giftBox} />
            </div>

            {/* 🔥 Button */}
            <button
                style={styles.button}
                onClick={() => navigate("/")}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
                Start Exploring →
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#fdfdfd",
        textAlign: "center",
        padding: "20px",
    },
    heading: {
        fontSize: "30px",
        fontWeight: "bold",
        marginBottom: "10px",
        color: "#333",
        textTransform: "uppercase",
        textShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)",
    },
    subText: {
        fontSize: "18px",
        color: "#555",
        marginBottom: "20px",
        maxWidth: "80%",
        lineHeight: "1.5",
    },
    giftContainer: {
        position: "relative",
        zIndex: 2, // Keeps the box above confetti
    },
    giftBox: {
        width: "200px",
        height: "200px",
    },
    button: {
        marginTop: "20px",
        padding: "14px 28px",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#fff",
        background: "linear-gradient(135deg, #ff4d4d, #ffcc00)",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "0.3s ease-in-out",
        boxShadow: "0 4px 12px rgba(255, 77, 77, 0.3)",
    },
};

export default TrialSuccess;

