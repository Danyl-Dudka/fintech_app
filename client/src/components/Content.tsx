import { useContext } from "react";
import { AppModeContext, AuthContext } from "../content";
import FinanceContent from "./modes/FinanceContent";
import CryptoContent from "./modes/CryptoContent";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CreateNewPasswordPage from "./CreateNewPasswordPage/CreateNewPasswordPage";
import ForgotPasswordPage from "./ForgotPasswordPage/ForgotPasswordPage";
import EmailVerificationPage from "./EmailVerificationPage/EmailVerificationPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import LoginPage from "./LoginPage/LoginPage";
import InfoFooter from "./InfoFooter/InfoFooter";
import PricingPage from "./PricingPage/PricingPage";
import InfoHeader from "./InfoHeader/InfoHeader";
import FeaturesPage from "./FeaturesPage/FeaturesPage";
import DashboardPage from "./DashboardPage/DashboardPage";
import ContactsPage from "./ContactsPage/ContactsPage";
import MainPage from "./MainPage/MainPage";
import PageWrapper from "./PageWrapper";

export default function Content() {
  const { mode } = useContext(AppModeContext);
  const { isAuth } = useContext(AuthContext);
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><InfoHeader /><MainPage /><InfoFooter /></PageWrapper>} />
        <Route path="/pricing" element={<PageWrapper><InfoHeader /><PricingPage /><InfoFooter /></PageWrapper>} />
        <Route path="/features" element={<PageWrapper><InfoHeader /><FeaturesPage /><InfoFooter /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><InfoHeader /><DashboardPage /><InfoFooter /></PageWrapper>} />
        <Route path="/contacts" element={<PageWrapper><InfoHeader /><ContactsPage /><InfoFooter /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
        <Route path="/email_verification" element={<PageWrapper><EmailVerificationPage /></PageWrapper>} />
        <Route path="/forgot_password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
        <Route path="/new_password" element={<PageWrapper><CreateNewPasswordPage /></PageWrapper>} />
        <Route path="/*" element={isAuth ? (<PageWrapper>{mode === 'finance' ? <FinanceContent /> : <CryptoContent />}</PageWrapper>) : (<Navigate to="/login" replace />)} />
      </Routes>
    </AnimatePresence>
  )
}
