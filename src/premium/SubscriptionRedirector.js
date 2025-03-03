import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";

const SubscriptionRedirector = () => {
  const [isPremium, setIsPremium] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return; // Do nothing if there is no token

    axios
      .post(API_ROUTES.checkSubscription, {}, { headers: { Authorization: token } })
      .then(response => setIsPremium(response.data.premium))
      .catch(() => setIsPremium(false));
  }, []);

  useEffect(() => {
    if (isPremium === false) {
      const lastRedirectTime = localStorage.getItem("lastSubscriptionRedirect");
      const currentTime = Date.now();

      if (!lastRedirectTime || currentTime - lastRedirectTime > 60 * 60 * 1000) {
        localStorage.setItem("lastSubscriptionRedirect", currentTime);
        navigate("/subscription");
      }
    }
  }, [isPremium, navigate]);

  return null; // This component doesn’t render anything
};

export default SubscriptionRedirector;
