import { useNavigate } from "react-router-dom";
import ResumeMockup from "../components/ResumeMockup";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-100">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Build a Resume Recruiters Can Actually Read
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            Our AI rewrites and structures your resume to be clear, professional,
            and compatible with Applicant Tracking Systems.
          </p>

          <button
            onClick={() => navigate("/build")}
            className="mt-8 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
          >
            Start Building My Resume
          </button>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>✔ AI-assisted writing</span>
            <span>✔ ATS-safe formatting</span>
            <span>✔ Multiple professional templates</span>
            <span>✔ Live preview & PDF export</span>
          </div>
        </div>

        <div className="hidden md:block">
          <ResumeMockup />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white py-14 border-t border-b">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">ATS</h3>
            <p className="text-gray-500 mt-1">Compatible Layouts</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">AI</h3>
            <p className="text-gray-500 mt-1">Content Improvement</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">Clean</h3>
            <p className="text-gray-500 mt-1">Professional Design</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">Fast</h3>
            <p className="text-gray-500 mt-1">Built in Minutes</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Designed for Real Job Applications
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-lg text-gray-900">
              Intelligent Content Suggestions
            </h3>
            <p className="text-gray-600 mt-2">
              AI helps improve clarity, removes weak phrases,
              and highlights impact recruiters actually look for.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-lg text-gray-900">
              ATS-Compatible Structure
            </h3>
            <p className="text-gray-600 mt-2">
              Standard headings, clean formatting, and layouts
              designed to work with modern ATS software.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-lg text-gray-900">
              Multiple Resume Templates
            </h3>
            <p className="text-gray-600 mt-2">
              Choose from multiple professional templates tailored
              for freshers, experienced professionals, and corporate roles.
            </p>
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Professional Templates for Every Career Stage
          </h2>

          <p className="text-center text-gray-600 mt-4 max-w-3xl mx-auto">
            Each template is built for readability, clarity, and ATS compatibility —
            without unnecessary design distractions.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                Fresher / Student
              </h4>
              <p className="text-gray-600 text-sm">
                Highlights education, skills, internships, and projects.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                Experienced Professional
              </h4>
              <p className="text-gray-600 text-sm">
                Focuses on work experience, achievements, and measurable impact.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                Corporate / ATS-Focused
              </h4>
              <p className="text-gray-600 text-sm">
                Simple, structured format optimized for large organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            How This Is Different
          </h2>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Typical Resume Builders
              </h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Design-first, content-second</li>
                <li>• Generic AI text</li>
                <li>• Too many confusing options</li>
              </ul>
            </div>

            <div className="bg-violet-50 rounded-xl p-6 border border-violet-200">
              <h4 className="font-semibold text-gray-900 mb-3">
                This Resume Builder
              </h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Content-first approach</li>
                <li>• Clear ATS-safe structure</li>
                <li>• Guided and simple flow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-10 space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900">
              Is this suitable for freshers?
            </h4>
            <p className="text-gray-600 mt-2">
              Yes. The templates and guidance work well for students,
              fresh graduates, and early professionals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">
              Will this work for experienced professionals?
            </h4>
            <p className="text-gray-600 mt-2">
              Absolutely. The builder emphasizes achievements,
              responsibilities, and impact.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">
              Does this guarantee a job?
            </h4>
            <p className="text-gray-600 mt-2">
              No tool can guarantee a job. This helps you present
              your profile clearly and professionally.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
        <h2 className="text-3xl font-bold">
          Build Your Resume With Confidence
        </h2>

        <p className="mt-3 text-violet-100">
          Clear structure. Professional language. No unnecessary complexity.
        </p>

        <button
          onClick={() => navigate("/build")}
          className="mt-6 bg-white text-violet-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100"
        >
          Get Started Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 text-sm py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4">
          <p>© {new Date().getFullYear()} Resume Builder. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
