import React from "react";
import LoginForm from "./LoginForm";
import AuthLayout from "./AuthLayout";

import { User } from "../types/index";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToRegistration?: () => void;
  onGoogleLoginSuccess: (user: User) => void;
  onNavigateToContact?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegistration,
  onGoogleLoginSuccess,
  onNavigateToContact,
}) => {
  const handleNavigateToRegistration = () => {
    if (onNavigateToRegistration) {
      onNavigateToRegistration();
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Ready to crush your goals? Sign in to track your progress."
      maxWidth="max-w-3xl"
      onContactClick={onNavigateToContact}
    >
      <LoginForm
        onLoginSuccess={onLoginSuccess}
        onNavigateToRegistration={handleNavigateToRegistration}
        onGoogleLoginSuccess={onGoogleLoginSuccess}
      />
    </AuthLayout>
  );
};

export default LoginPage;