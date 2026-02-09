import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function GAListener() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-9XKCY9XF93", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
}

export default GAListener;
