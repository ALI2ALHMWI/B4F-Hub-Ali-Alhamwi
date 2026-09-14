import CommunitySection from "./components/community/CommunitySection";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import OpportunitiesSection from "./components/opportunities/OpportunitiesSection";
import { NotificationProvider } from "./components/notifications/NotificationCenter";

function App() {
  return (
    <NotificationProvider>
      <div className="app-shell">
        <Navbar />

        <main className="main-content">
          <CommunitySection />
          <OpportunitiesSection />
        </main>

        <Footer />
      </div>
    </NotificationProvider>
  );
}

export default App;
