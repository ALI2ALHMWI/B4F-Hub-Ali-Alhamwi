import CommunitySection from "./components/community/CommunitySection";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import OpportunitiesSection from "./components/opportunities/OpportunitiesSection";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <CommunitySection />

       <OpportunitiesSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
