import FeatureCard from "./FeatureCard";

function FeaturesSection() {
  return (
    <section className="features">
      <div className="features-heading">
        <div>
          <span className="section-kicker">Everything in one place</span>
          <h2>Built for consistent progress</h2>
        </div>
        <p>
          Log each session, revisit your training, and see how your strength
          changes over time.
        </p>
      </div>

      <div className="feature-grid">
        <FeatureCard
          number="01"
          title="Workout Logging"
          description="Record exercises, sets, reps, and weights in one place."
        />

        <FeatureCard
          number="02"
          title="Exercise History"
          description="View previous sessions and compare your past performance."
        />

        <FeatureCard
          number="03"
          title="Progress Tracking"
          description="Track strength improvements across weeks and months."
        />
      </div>
    </section>
  );
}

export default FeaturesSection;
