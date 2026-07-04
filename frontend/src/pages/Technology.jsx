export default function Technology() {
  return (
    <div className="page">
      <h1>Technology</h1>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>Edge Layer</h3>
          <p>IoT Sensors collect soil data</p>
        </div>

        <div className="feature-card">
          <h3>Fog Layer</h3>
          <p>Data preprocessing</p>
        </div>

        <div className="feature-card">
          <h3>Cloud Layer</h3>
          <p>AI & analytics</p>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>CNN</h3>
          <p>Image-based detection</p>
        </div>

        <div className="feature-card">
          <h3>LSTM</h3>
          <p>Time-series prediction</p>
        </div>
      </div>
    </div>
  );
}