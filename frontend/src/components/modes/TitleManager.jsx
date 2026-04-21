import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const TitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const routeTitles = {
      "/": "Home | Study AI",
      "/login": "Login | Study AI",
      "/register": "Register | Study AI",
      "/home": "Dashboard | Study AI",
    };

    document.title =
      routeTitles[location.pathname] || "Study AI";
  }, [location]);

  return null;
};

export default TitleManager;