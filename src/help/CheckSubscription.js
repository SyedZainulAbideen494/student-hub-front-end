import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";

const CheckSubscription = () => {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowLoader(false);
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
        }
      } catch (error) {
        console.error("❌ Error checking subscription:", error);
      } finally {
        setShowLoader(false);
      }
    };

    checkSubscription();
  }, [navigate]);

  if (showLoader) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(10, 10, 10, 0.9)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}>
        <div className="loader" />
      </div>
    );
  }

  return null;
};

export default CheckSubscription;
