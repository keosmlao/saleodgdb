// src/components/AutoLogoutWrapper.jsx
import { Outlet } from 'react-router-dom';
import useAutoLogout from '../hooks/useAutoLogout';

export default function AutoLogoutWrapper() {
  useAutoLogout(15); // ⏳ Auto logout after 15 minutes of inactivity
  return <Outlet />;
}
