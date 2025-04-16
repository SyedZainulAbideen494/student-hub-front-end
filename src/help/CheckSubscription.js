import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";

const CheckSubscription = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      // First show loading screen
      navigate("/loading/home");

      const token = localStorage.getItem("token");
      if (!token) {
        // No token, go back to home
        navigate("/");
        return;
      }

      try {
        const response = await axios.post(
          API_ROUTES.checkSubscriptionTrail,
          { token },
          { headers: { "Content-Type": "application/json" } }
        );

        const status = response.data.status;

        if (status === "redirect_subscription") {
          navigate("/subscription");
        } else {
          // Success — navigate to home after check
          navigate("/");
        }
      } catch (error) {
        console.error("❌ Error checking subscription:", error);
        // On error, still navigate to home
        navigate("/");
      }
    };

    checkSubscription();
  }, [navigate]);

  return null;
};

export default CheckSubscription;
