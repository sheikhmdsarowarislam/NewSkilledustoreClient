export default function MyToolsPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2">
          <span className="text-sm font-medium text-purple-400">
            Coming Soon
          </span>
        </div>

        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          My Tools
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-gray-400">
          We’re working on something useful for you. The My Tools section
          will be available soon.
        </p>

        <a
          href="/dashboard"
          className="mt-8 inline-block rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700"
        >
          Back to Dashboard
        </a>
      </div>
    </main>
  );
}