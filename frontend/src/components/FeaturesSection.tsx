import FeatureCard from "./FeatureCard";

function FeaturesSection() {
  return (
    <section className="features">
      <h2>Key Features</h2>

      <div className="feature-grid">
        <FeatureCard
          title="Workout Logging"
          description="Record exercises, sets, reps, and weights in one place."
        />

        <FeatureCard
          title="Exercise History"
          description="View previous sessions and compare your past performance."
        />

        <FeatureCard
          title="Progress Tracking"
          description="Track strength improvements across weeks and months."
        />
      </div>
    </section>
  );
}

export default FeaturesSection;