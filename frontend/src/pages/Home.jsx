import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Stats from "../components/Stats";

export default function Home() {
  return (
    <>

      {/* HERO */}
      <Hero />

      {/* FEATURES */}
      <section className="features">
        <h2>Our Smart Features</h2>
        <p className="section-subtitle">
          Advanced AI + IoT system for modern precision agriculture
        </p>

        <div className="feature-grid">
          <FeatureCard 
            title="AI Disease Detection" 
            desc="CNN-based image analysis for early-stage disease detection with high accuracy."
            icon="🤖"
          />

          <FeatureCard 
            title="IoT Monitoring" 
            desc="Real-time soil monitoring including moisture, temperature, and pH levels."
            icon="📡"
          />

          <FeatureCard 
            title="Predictive Analytics" 
            desc="LSTM models predict disease outbreaks 7-21 days in advance."
            icon="📊"
          />
        </div>
      </section>

      {/* STATS */}
      <Stats />

      {/* RESEARCH SECTION */}
      <section className="research">
        <div className="research-content">
          <h2>Research-Based Innovation</h2>

          <p>
            Traditional crop disease detection methods rely heavily on manual inspection, 
            which often leads to delayed identification. Our system leverages deep learning 
            and IoT sensors to detect diseases even before visible symptoms appear.
          </p>

          <p>
            By combining CNN-based image classification with LSTM-based predictive models, 
            the system can forecast disease outbreaks up to 21 days in advance, helping 
            farmers take preventive actions early.
          </p>

          <div className="research-images">
            <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6" />
            <img src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf" />
          </div>

          <p>
            Field trials across multiple regions have shown significant improvements in crop 
            yield, reduction in pesticide usage, and better resource management, making this 
            solution highly effective for sustainable agriculture.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="workflow">
        <h2>How It Works</h2>

        <div className="workflow-steps">
          <div className="step">
            <h3>1️⃣ Collect Data</h3>
            <p>IoT sensors collect real-time soil and environmental data.</p>
          </div>

          <div className="step">
            <h3>2️⃣ AI Analysis</h3>
            <p>Deep learning models analyze images and predict disease risk.</p>
          </div>

          <div className="step">
            <h3>3️⃣ Get Insights</h3>
            <p>Farmers receive actionable insights and recommendations.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What Farmers Say</h2>

        <div className="testimonial-grid">

          <div className="testimonial">
            <p>
              "This system helped me detect disease early and saved my wheat crop. 
              I reduced pesticide usage significantly."
            </p>
            <h4>- Ramesh Kumar, Punjab</h4>
          </div>

          <div className="testimonial">
            <p>
              "The prediction feature is amazing. I got alerts before disease spread 
              and increased my yield by almost 20%."
            </p>
            <h4>- Suresh Patel, Gujarat</h4>
          </div>

          <div className="testimonial">
            <p>
              "Very easy to use and helpful. Even without technical knowledge, 
              I can understand the results."
            </p>
            <h4>- Meena Devi, Haryana</h4>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta">
        <h2>Start Smart Farming Today 🌱</h2>
        <p>
          Use AI-powered insights to protect your crops and increase productivity.
        </p>
        <button className="btn">Get Started</button>
      </section>

    </>
  );
}