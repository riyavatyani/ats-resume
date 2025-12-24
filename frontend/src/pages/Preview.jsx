import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

// ✅ IMPORT YOUR TEMPLATES
import TemplateOne from "../templates/TemplateOne";
import TemplateTwo from "../templates/TemplateTwo";
import TemplateThree from "../templates/TemplateThree";

import axios from "axios";
const [resume, setResume] = useState(null);
const [draft, setDraft] = useState(null);



/* ================= AI PARSER ================= */
const parseResume = (text, formData) => {
const getSection = (title) => {
  const regex = new RegExp(
    `${title}\\s*:\\s*([\\s\\S]*?)(?=\\n(?:Summary|Experience|Projects|Achievements|Education|Skills|Certifications|Links)\\s*:|$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[1].trim() : "";
};


  // ✅ MOVE THIS HERE (NOT INSIDE return)
  const rawSkills =
    getSection("Skills") ||
    getSection("Technical Skills") ||
    getSection("Key Skills");

  return {
    name: formData.name || "",
    email: formData.email || "",
    phone: formData.phone || "",
    photo: formData.photo || "",

    title:
      getSection("Title") ||
      formData.title ||
      "Software Developer",

  summary:
  getSection("Summary") ||
  getSection("Professional Summary"),

experience:
  getSection("Experience") ||
  getSection("Work Experience"),

    projects: getSection("Projects"),
    achievements: getSection("Achievements"),
    certifications: getSection("Certifications"),
    education: getSection("Education"),
    links: getSection("Links"),

    skills: rawSkills
      ? rawSkills
          .split(/,|\n|•|-/)
          .map((s) => s.trim())
          .filter((s) => s.length > 1)
      : [],
  };
};

/* ================= ATS SCORE ================= */
const calculateATS = (resume) => {
  let score = 0;
  const suggestions = [];

  if (resume.summary?.length > 40) score += 15;
  else suggestions.push("Improve summary (add 2–3 strong lines)");

  if (resume.experience?.length > 80) score += 20;
  else suggestions.push("Add more detailed experience points");

  if (resume.projects?.length > 50) score += 15;
  else suggestions.push("Include project details");

  if (resume.skills?.length >= 6) score += 20;
  else suggestions.push("Add at least 6 relevant skills");

  if (resume.education?.length > 20) score += 10;
  else suggestions.push("Education section is too short");

  if (
    resume.achievements?.length > 20 ||
    resume.certifications?.length > 20
  )
    score += 10;
  else suggestions.push("Add achievements or certifications");

  if (resume.links) score += 10;
  else suggestions.push("Add GitHub / LinkedIn links");

  return { score: Math.min(score, 100), suggestions };
};

/* ================= PREVIEW ================= */

/* ================= PREVIEW ================= */
const Preview = () => {

  //

  // ---------- ensure resumeId exists ----------
  useEffect(() => {
    let resumeId = localStorage.getItem("resumeId");
    if (!resumeId) {
      resumeId = crypto.randomUUID();
      localStorage.setItem("resumeId", resumeId);
    }
  }, []);


  // ---------- state ----------
  const [resume, setResume] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);

  const [template, setTemplate] = useState("one");
  const [isPaid] = useState(
    localStorage.getItem("isPaid") === "true"
  );

  // ---------- LOAD RESUME (SINGLE SOURCE OF TRUTH) ----------
 useEffect(() => {
  const fetchResumeFromDB = async () => {
    try {
      const token = localStorage.getItem("token");
      const resumeId = localStorage.getItem("resumeId");

      if (!token || !resumeId) {
        console.error("Missing token or resumeId");
        return;
      }

      const res = await axios.get(
        `http://localhost:8000/api/resume/${resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResume(res.data);
      setDraft(res.data);
    } catch (err) {
      console.error("Failed to fetch resume from DB", err);
    }
  };

  fetchResumeFromDB();
}, []);


  // ---------- loading ----------
  if (!resume) {
    return <div className="p-10">Loading preview...</div>;
  }

  const ats = calculateATS(resume);

  // ⬇️⬇️ REST OF YOUR FILE CONTINUES UNCHANGED ⬇️⬇️
// ✅ WAIT FOR REACT DOM TO FULLY RENDER BEFORE PDF
const waitForDOMPaint = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 300);
      });
    });
  });


  /* ================= FREE DOWNLOAD (WITH WATERMARK) ================= */
const downloadWithWatermark = async () => {
  await waitForDOMPaint(); // ✅ WAIT FOR AI TEXT TO RENDER

  const resumeEl = document.getElementById("resume");
  if (!resumeEl) {
    console.error("Resume DOM not found");
    return;
  }

  await html2pdf()
    .set({
      margin: 0,
      filename: "Resume.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(resumeEl)
    .save();
};


/* ================= PAID DOWNLOAD (WITHOUT WATERMARK) ================= */
const downloadWithoutWatermark = async () => {
  await waitForDOMPaint(); // ✅ WAIT FOR FINAL DOM

  const resumeEl = document.getElementById("resume");
  if (!resumeEl) {
    console.error("Resume DOM not found");
    return;
  }

  const watermarkEls = resumeEl.querySelectorAll(".watermark");
  watermarkEls.forEach((el) => (el.style.display = "none"));

  await html2pdf()
    .set({
      margin: 0,
      filename: "Resume.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
  scale: 2,
  useCORS: true,
  backgroundColor: "#ffffff",
  scrollY: 0,
  windowWidth: resumeEl.scrollWidth,
  windowHeight: resumeEl.scrollHeight,
},

      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(resumeEl)
    .save();

  watermarkEls.forEach((el) => (el.style.display = "flex"));
};

  /* ================= PDF DOWNLOAD ================= */
  /* ================= PAID DOWNLOAD ================= */
const handlePaidDownload = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    const resumeId = localStorage.getItem("resumeId"); // you MUST have this
    if (!resumeId) {
      alert("Resume ID missing");
      return;
    }

    // 1️⃣ Create order from backend
    const { data } = await axios.post(
      "http://localhost:8000/api/payment/create-order",
      { resumeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 2️⃣ Razorpay options (NO hardcoded amount)
    const options = {
      key: data.key,
      amount: data.amount, // 👈 comes from backend (₹49 → 4900)
      currency: data.currency,
      order_id: data.orderId,
      name: "AI Resume Builder",
      description: "Resume Download",

      handler: async function (response) {
        // 3️⃣ Verify payment on backend
        await axios.post(
          "http://localhost:8000/api/payment/verify",
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 4️⃣ Download WITHOUT watermark
        downloadWithoutWatermark();
      },

      theme: {
        color: "#7c3aed",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
  console.error(
    "🔥 PAYMENT ERROR FULL 👉",
    err.response?.status,
    err.response?.data || err.message
  );

  alert(
    err.response?.data?.message ||
    err.message ||
    "Payment failed"
  );
}

};
// ✅ CHECK PERMISSION & DOWNLOAD
const handleDownloadWithoutWatermark = async () => {
  try {
    const token = localStorage.getItem("token");
    const resumeId = localStorage.getItem("resumeId");

    if (!token || !resumeId) {
      alert("Please login again");
      return;
    }

    const res = await axios.get(
      "http://localhost:8000/api/payment/can-download",
      {
        params: { resumeId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.allowed) {
      downloadWithoutWatermark();
    } else {
      handlePaidDownload();
    }
  } catch (err) {
    console.error("Download check failed", err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* ATS SCORE */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">ATS Compatibility Score</h3>
          <span
            className={`text-2xl font-bold ${
              ats.score >= 80
                ? "text-green-600"
                : ats.score >= 60
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {ats.score} / 100
          </span>
        </div>

        {ats.suggestions.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600 list-disc ml-5">
            {ats.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}
      </div>

      {/* CONTROLS */}
      <div className="no-print flex gap-3 mb-4 items-center">
        <button onClick={() => setTemplate("one")} className={btn(template === "one")}>Classic</button>
        <button onClick={() => setTemplate("two")} className={btn(template === "two")}>Modern</button>
        <button onClick={() => setTemplate("three")} className={btn(template === "three")}>Minimal</button>

        <div className="ml-auto flex gap-3">
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 border rounded-lg"
          >
            {editMode ? "Cancel Edit" : "Edit Resume"}
          </button>

          {editMode && (
            <button
              onClick={() => {
                localStorage.setItem("formattedResume", JSON.stringify(draft));
                setResume(draft); // ✅ user-edited AI text
    localStorage.setItem("formattedResume", JSON.stringify(draft));
    setEditMode(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
          )}

          {/* DOWNLOAD DROPDOWN */}
        {/* DOWNLOAD DROPDOWN */}
<div className="relative">
  <button
    onClick={() => setOpenDownload((prev) => !prev)}
    className="bg-violet-600 text-white px-6 py-2 rounded-lg"
  >
    Download ▼
  </button>

  {openDownload && (
    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
      <button
        onClick={() => {
          setOpenDownload(false);
          downloadWithWatermark();
        }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        Download with Watermark (Free)
      </button>

      <button
        onClick={() => {
          setOpenDownload(false);
          handleDownloadWithoutWatermark();
        }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        Download without Watermark ₹49
      </button>
    </div>
  )}
</div>


            </div>
          </div>
        

      {/* EDIT MODE UI */}
      
      {editMode && (
  <div className="bg-white border rounded-lg p-4 mb-4 space-y-3">
    {Object.keys(draft).map(
      (key) =>
        key !== "photo" &&
        key !== "skills" &&
        typeof draft[key] === "string" && (
          <textarea
            key={key}
            value={draft[key]}
            onChange={(e) =>
              setDraft({ ...draft, [key]: e.target.value })
            }
            placeholder={key}
            className="w-full border rounded p-2 text-sm"
          />
        )
    )}

    {/* ✅ SKILLS EDITOR */}
    <textarea
      value={Array.isArray(draft.skills) ? draft.skills.join(", ") : ""}
      onChange={(e) =>
        setDraft({
          ...draft,
          skills: e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        })
      }
      placeholder="Skills (comma separated)"
      className="w-full border rounded p-2 text-sm"
    />
  </div>
)}


     <div id="resume">
  {template === "one" && <TemplateOne resume={resume} isPaid={isPaid} />}
  {template === "two" && <TemplateTwo resume={resume} isPaid={isPaid} />}
  {template === "three" && <TemplateThree resume={resume} isPaid={isPaid} />}
</div>

    </div>
  );
};

const btn = (active) =>
  `px-4 py-2 rounded-lg border font-medium ${
    active ? "bg-violet-600 text-white" : "bg-white"
  }`;

export default Preview;
