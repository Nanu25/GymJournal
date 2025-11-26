import GoogleUserDetailsForm from "./GoogleUserDetailsForm";
import AuthLayout from "./AuthLayout";

interface GoogleUserSetupPageProps {
  onComplete: () => void;
  user: {
    id: string;
    name: string;
    email: string;
  };
  onNavigateToContact?: () => void;
}

function GoogleUserSetupPage({
  onComplete,
  user,
  onNavigateToContact,
}: GoogleUserSetupPageProps) {
  return (
    <AuthLayout
      title={
        <>
          Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Profile</span>
        </>
      }
      subtitle="Just a few more details to personalize your experience."
      maxWidth="max-w-4xl"
      onContactClick={onNavigateToContact}
    >
      <GoogleUserDetailsForm user={user} onComplete={onComplete} />
    </AuthLayout>
  );
}

export default GoogleUserSetupPage;



