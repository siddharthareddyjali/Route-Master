const steps = [
  { number: '01', title: 'Add Locations', text: 'Search, click map points, or upload a CSV of customer stops.' },
  { number: '02', title: 'Choose Vehicles', text: 'Set the number of vehicles and optional route constraints.' },
  { number: '03', title: 'Generate Routes', text: 'Create balanced clusters and assign stops across your fleet automatically.' },
  { number: '04', title: 'Optimize & Navigate', text: 'Optimize the order, calculate road paths and review the route maps.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="steps-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">How RouteMaster works</span>
          <h2>From stops to optimized schedules</h2>
        </div>
        <div className="step-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
