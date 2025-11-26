import RegistrationForm from "./RegistrationForm";
import AuthLayout from "./AuthLayout";

interface RegistrationPageProps {
  onNavigateToLogin: () => void;
  onNavigateToContact?: () => void;
}

function RegistrationPage({
  onNavigateToLogin,
  onNavigateToContact,
}: RegistrationPageProps) {
  const handleNavigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <AuthLayout
      title={
        <>
          Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Movement</span>
        </>
      }
      subtitle="Start your journey to a stronger, healthier you today."
      maxWidth="max-w-4xl"
      onContactClick={onNavigateToContact}
    >
      <RegistrationForm onNavigateToLogin={handleNavigateToLogin} />
    </AuthLayout>
  );
}

export default RegistrationPage;
