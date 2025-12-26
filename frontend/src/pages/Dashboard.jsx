import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [extra, setExtra] = useState({
    projects: "",
    achievements: "",
    certifications: "",
    links: "",
  });
  const [showExtra, setShowExtra] = useState(false);
  const [showSaved, setShowSaved] = useState(false);


  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const fetchResume = async () => {
    try {
      const res = await fetch(
        `/api/resume/latest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("No resume");

      const data = await res.json();

      setResume(data);
      setExtra({
        projects: data.projects || "",
        achievements: data.achievements || "",
        certifications: data.certifications || "",
        links: data.links || "",
      });

    } catch (err) {
      console.error("FETCH RESUME ERROR 👉", err);
    }
  };

  fetchResume();
}, []);


  if (!resume) {
    return <div className="p-10">No resume data found.</div>;
  }

  /* ===== SIMPLE QUALITY CHECK (FREE MODE) ===== */
  const isEnough =
    (resume.experience && resume.experience.length > 30) ||
    (extra.projects && extra.projects.length > 30) ||
    (extra.achievements && extra.achievements.length > 10) ||
   (Array.isArray(resume.skills) && resume.skills.length >= 3);


  /* ===== SAVE EXTRA DETAILS ===== */
 const saveExtraDetails = () => {
  const updated = { ...resume, ...extra };

  localStorage.setItem("resumeData", JSON.stringify(updated));
  setResume(updated);

  setShowExtra(false);        // close editor
  setShowSaved(true);         // show success toast

  setTimeout(() => {
    setShowSaved(false);      // auto-hide after 2s
  }, 2000);
};

  /* ===== FREE SMART FORMATTER (NO AI) ===== */
  const generateFormattedResume = () => {
    const updated = { ...resume, ...extra };

    const formattedResume = {
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      photo: updated.photo,

      title: "Full Stack Developer",

      summary: updated.experience
        ? updated.experience
            .split("\n")
            .filter(Boolean)
            .slice(0, 3)
            .join(". ")
        : "",

      experience: updated.experience
        ? updated.experience
            .split("\n")
            .filter(Boolean)
            .join("\n")
        : "",

      projects: updated.projects || "",
      achievements: updated.achievements || "",
      certifications: updated.certifications || "",
      education: updated.education || "",
      links: updated.links || "",

      skills: Array.isArray(updated.skills) ? updated.skills : [],

    };

    localStorage.setItem(
      "formattedResume",
      JSON.stringify(formattedResume)
    );

    navigate("/preview");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {showSaved && (
  <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
    Extra details saved successfully ✓
  </div>
)}

      <div className="max-w-4xl mx-auto bg-white border rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-2">Resume Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">
          Review and improve your details before generating resume.
        </p>

        {/* RAW DETAILS */}
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {resume.name}</p>
          <p><strong>Email:</strong> {resume.email}</p>
          <p><strong>Phone:</strong> {resume.phone}</p>
          <p><strong>Education:</strong> {resume.education}</p>
          <p><strong>Experience:</strong> {resume.experience}</p>
          <p><strong>Skills:</strong> {resume.skills}</p>
        </div>

        <hr className="my-6" />

        {/* ADD MORE DETAILS */}
        <button
          onClick={() => setShowExtra(!showExtra)}
          className="text-violet-600 font-medium mb-4"
        >
          {showExtra ? "Hide extra details" : "+ Add more details (optional)"}
        </button>

        {showExtra && (
          <div className="space-y-4 bg-gray-50 border rounded-lg p-4">
            <textarea
              placeholder="Projects"
              className="input h-20"
              value={extra.projects}
              onChange={(e) =>
                setExtra({ ...extra, projects: e.target.value })
              }
            />

            <textarea
              placeholder="Achievements"
              className="input h-20"
              value={extra.achievements}
              onChange={(e) =>
                setExtra({ ...extra, achievements: e.target.value })
              }
            />

            <textarea
              placeholder="Certifications"
              className="input h-16"
              value={extra.certifications}
              onChange={(e) =>
                setExtra({ ...extra, certifications: e.target.value })
              }
            />

            <input
              placeholder="Links (GitHub, LinkedIn, Portfolio)"
              className="input"
              value={extra.links}
              onChange={(e) =>
                setExtra({ ...extra, links: e.target.value })
              }
            />

            <button
              onClick={saveExtraDetails}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg"
            >
              Save extra details
            </button>
          </div>
        )}

        <hr className="my-6" />

        {/* GENERATE SECTION */}
        {!isEnough ? (
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              Add more experience or details to generate a resume.
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              Your details are sufficient. You can now generate your resume.
            </p>

            <button
              onClick={generateFormattedResume}
              className="mt-3 bg-violet-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Generate Resume →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
