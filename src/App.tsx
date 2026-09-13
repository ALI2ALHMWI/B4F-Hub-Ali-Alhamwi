import CommunitySection from "./components/community/CommunitySection";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <CommunitySection />

        <section className="hub-panel opportunities-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">YOUR NEXT STEP</span>

              <h2>Opportunities</h2>

              <p>Find jobs, internships, scholarships, and more.</p>
            </div>

            <span className="panel-count">0 opportunities</span>
          </div>

          <div className="panel-placeholder">
            <div className="placeholder-icon">↗</div>

            <h3>Discover your next opportunity</h3>

            <p>Relevant roles and opportunities will appear here.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
