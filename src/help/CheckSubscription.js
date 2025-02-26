import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";

const CheckSubscription = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSubscription = async () => {
            const token = localStorage.getItem("token");

            if (!token) return; // ⛔ Do nothing if no token

            try {
                const response = await axios.post(
                    API_ROUTES.checkSubscriptionTrail,
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
