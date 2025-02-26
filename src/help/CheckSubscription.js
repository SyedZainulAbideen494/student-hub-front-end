import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckSubscription = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSubscription = async () => {
            const token = localStorage.getItem("token");

            if (!token) return; // ⛔ Do nothing if no token

            try {
                const response = await axios.post(
                    "http://localhost:8080/check-subscription/trial",
                    { token }, 
                    { headers: { "Content-Type": "application/json" } }
                );

                const status = response.data.status;

                if (status === "redirect_subscription") {
                    navigate("/subscription");
                } else if (status === "trial_granted") {
                    navigate("/trial-success");
                }
            } catch (error) {
                console.error("❌ Error checking subscription:", error);
            }
        };

        checkSubscription();
    }, [navigate]);

    return null;
};

export default CheckSubscription;
