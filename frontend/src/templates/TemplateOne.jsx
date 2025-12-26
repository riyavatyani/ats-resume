import Section from "../components/Section";
import Watermark from "../components/Watermark";

const TemplateOne = ({ resume, isPaid }) => {
  return (
    <div
      id="resume"
      className="relative bg-white mx-auto"
      style={{ width: "210mm", height: "297mm" }}
    >
      {/* WATERMARK */}
      {!isPaid && (
        <div className="watermark absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Watermark />
        </div>
      )}

      <div className="flex h-full">
        {/* LEFT COLUMN */}
        <div className="w-1/3 bg-slate-900 text-white h-full p-6">
          {resume.photo && (
            <img
              src={resume.photo}
              alt="profile"
              className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white"
            />
          )}

          <h2 className="text-xl font-bold text-center">
            {resume.name}
          </h2>

          <p className="text-sm text-center text-slate-300 mb-4">
            {resume.title}
          </p>

          <p className="text-sm break-words">📧 {resume.email}</p>
          <p className="text-sm mb-4 break-words">📞 {resume.phone}</p>

          {/* SKILLS */}
          <h3 className="font-semibold mt-4 mb-2">Skills</h3>
          <ul className="list-disc pl-4 text-sm space-y-1 break-words">
            {resume.skills?.map((skill, i) => (
              <li
                key={i}
                className="whitespace-normal break-words leading-relaxed"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN */}
      {/* RIGHT COLUMN */}
<div className="w-2/3 p-8 h-full space-y-6">

  {/* SUMMARY */}
  <Section
    title="Summary"
    content={
      resume.summary?.length > 0 ? (
        <div className="text-sm leading-relaxed whitespace-pre-line text-gray-800">
          {resume.summary}
        </div>
      ) : (
        <div className="text-sm italic text-gray-400">
          Summary not provided
        </div>
      )
    }
  />

  {/* EXPERIENCE */}
  <Section
    title="Experience"
    content={
      resume.experience?.length > 0 ? (
        <div className="text-sm leading-relaxed whitespace-pre-line text-gray-800">
          {resume.experience}
        </div>
      ) : (
        <div className="text-sm italic text-gray-400">
          Experience not provided
        </div>
      )
    }
  />

  {/* PROJECTS */}
  {resume.projects &&
  resume.projects
    .split("\n")
    .filter(line => line.trim() !== "").length > 0 && (
      <Section
        title="Projects"
        content={
          <ul className="list-disc ml-5 space-y-2 text-sm whitespace-pre-line">
            {resume.projects
              .split("\n")
              .filter(line => line.trim() !== "")
              .map((item, i) => (
                <li key={i}>{item}</li>
              ))}
          </ul>
        }
      />
)}


{resume.achievements &&
  resume.achievements
    .split("\n")
    .filter(line => line.trim() !== "").length > 0 && (
      <Section
        title="Achievements"
        content={
          <ul className="list-disc ml-5 space-y-2 text-sm whitespace-pre-line">
            {resume.achievements
              .split("\n")
              .filter(line => line.trim() !== "")
              .map((item, i) => (
                <li key={i}>{item}</li>
              ))}
          </ul>
        }
      />
)}


  {/* CERTIFICATIONS */}
  {resume.certifications?.length > 0 && (
    <Section
      title="Certifications"
      content={
        <ul className="list-disc ml-5 space-y-2 text-sm whitespace-pre-line">
          {resume.certifications
            .split("\n")
            .filter(Boolean)
            .map((item, i) => (
              <li key={i}>{item}</li>
            ))}
        </ul>
      }
    />
  )}

  {/* EDUCATION */}
  {resume.education?.length > 0 && (
    <Section
      title="Education"
      content={
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {resume.education}
        </div>
      }
    />
  )}

  {/* LINKS */}
  {resume.links?.length > 0 && (
    <Section
      title="Links"
      content={
        <div className="text-sm break-all whitespace-pre-line">
          {resume.links}
        </div>
      }
    />
  )}

</div>

      </div>
    </div>
  );
};

export default TemplateOne; 