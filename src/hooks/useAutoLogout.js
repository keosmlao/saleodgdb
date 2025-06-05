// src/hooks/useAutoLogout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAutoLogout(timeoutMinutes = 10) {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("คุณถูกล็อกเอาท์เนื่องจากไม่มีการใช้งานเป็นเวลานาน");
      navigate("/");
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, timeoutMinutes * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, timeoutMinutes]);
}
