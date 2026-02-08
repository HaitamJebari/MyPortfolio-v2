// src/Analytics.jsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Send pageview on every route change
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null; // doesn't render anything
};

export default Analytics;
