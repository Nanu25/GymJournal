import React from "react";
import WelcomeHeader from "./WelcomeHeader";

interface DashboardPageProps {
  username: string;
  isAdmin: boolean;
  onLogout: () => void;
  onNavigateToActivityLogs: () => void;
  children?: React.ReactNode;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  username,
  isAdmin,
  onLogout,
  onNavigateToActivityLogs,
  children,
}) => (
  <div>
    <div className="flex justify-between items-center px-8 py-6">
      <WelcomeHeader username={username} />
      <div className="flex items-center space-x-4">
        {isAdmin && (
          <button
            onClick={onNavigateToActivityLogs}
            className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
          >
            View Activity Logs
          </button>
        )}
        <button
          onClick={onLogout}
          className="px-6 py-3 text-lg font-bold text-black bg-white rounded-xl shadow hover:bg-blue-100 border border-blue-100 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
    {children}
  </div>
);

export default DashboardPage; 