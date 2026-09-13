import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <section className="hub-panel community-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">STAY CONNECTED</span>

              <h2>Community</h2>

              <p>Share updates, ask questions, and celebrate wins.</p>
            </div>

            <span className="panel-count">0 posts</span>
          </div>

          <div className="panel-placeholder">
            <div className="placeholder-icon">✦</div>

            <h3>Community is coming together</h3>

            <p>Posts, announcements, events, and resources will appear here.</p>
          </div>
        </section>

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
