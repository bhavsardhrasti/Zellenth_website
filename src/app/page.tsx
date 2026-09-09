export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <span className="font-accent text-accent text-sm tracking-widest uppercase">
        Laminate Door Visualizer
      </span>
      <h1 className="font-display text-hero text-text-primary text-center">
        Visualize Your Laminate Door
      </h1>
      <p className="font-body text-text-secondary max-w-md text-center">
        Try any laminate on any door in real time, before you order.
      </p>
      <div className="flex items-center gap-3">
        <button className="bg-accent hover:bg-accent-hover shadow-card rounded-sm px-5 py-2.5 font-medium text-white transition-colors">
          Try the Visualizer
        </button>
        <button className="bg-surface text-text-primary shadow-card rounded-sm px-5 py-2.5 font-medium transition-colors">
          Browse Catalogue
        </button>
      </div>
      <span className="bg-success-bg text-success-text rounded-pill px-3 py-1 text-xs font-medium">
        Made in Ahmedabad
      </span>
      <p className="font-handwritten text-text-secondary text-lg">
        &ldquo;Crafted, not just manufactured.&rdquo;
      </p>
    </main>
  );
}
