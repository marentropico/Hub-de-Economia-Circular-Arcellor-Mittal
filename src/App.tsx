import { useState, useEffect } from "react";
import { User, Company } from "./types";
import { getStoredSession, clearSession } from "./services/api";
import Layout from "./components/Layout";
import AuthPage from "./views/AuthPage";
import Dashboard from "./views/Dashboard";
import ProductCatalog from "./views/ProductCatalog";
import OrderHistory from "./views/OrderHistory";
import AdminPanel from "./views/AdminPanel";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    // Check if there is an active session
    const session = getStoredSession();
    if (session) {
      setUser(session.user);
      setCompany(session.company);
    }
  }, []);

  const handleAuthSuccess = (u: User, c: Company) => {
    setUser(u);
    setCompany(c);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setCompany(null);
  };

  const handleUpdateCompanyCredits = (newCredits: number) => {
    if (company) {
      const updated = { ...company, co2_credits: newCredits };
      setCompany(updated);
      
      // Update session storage too!
      if (user) {
        localStorage.setItem("arcelor_hub_company", JSON.stringify(updated));
      }
    }
  };

  // If user is not authenticated, render login onboarding page
  if (!user || !company) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout
      user={user}
      company={company}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div>
        {activeTab === "dashboard" && (
          <Dashboard
            user={user}
            company={company}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "catalog" && (
          <ProductCatalog
            user={user}
            company={company}
            setActiveTab={setActiveTab}
            onRefreshCompanyCredits={handleUpdateCompanyCredits}
          />
        )}
        {activeTab === "orders" && (
          <OrderHistory
            user={user}
            company={company}
            onRefreshCompanyCredits={handleUpdateCompanyCredits}
          />
        )}
        {activeTab === "admin" && user.role === "ADMIN_ARCELOR" && (
          <AdminPanel user={user} company={company} />
        )}
      </div>
    </Layout>
  );
}
export { App };
