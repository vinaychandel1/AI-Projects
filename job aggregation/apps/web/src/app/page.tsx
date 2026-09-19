export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Find Jobs That Match Your Skills</h1>
      <p className="text-lg text-gray-600 mb-8">
        Upload your resume, add your skills, and discover relevant opportunities from multiple job sources.
      </p>
      <div className="flex gap-4">
        <a href="/login" className="px-6 py-3 bg-black text-white rounded-lg font-medium">
          Upload Resume
        </a>
        <a href="/jobs" className="px-6 py-3 border border-gray-300 rounded-lg font-medium">
          Explore Jobs
        </a>
      </div>
    </div>
  );
}
