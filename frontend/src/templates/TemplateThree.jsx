import Section from "../components/Section";
import Watermark from "../components/Watermark";

const TemplateThree = ({ resume, isPaid }) => {
  return (
    <div
      id="resume"
      className="relative bg-white shadow-lg mx-auto"
      style={{ width: "210mm", height: "297mm" }}
    >
      {/* WATERMARK */}
      {!isPaid && (
        <div className="watermark absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Watermark />
        </div>
      )}

      <div className="h-full px-10 py-8 overflow-hidden">
        {/* HEADER */}
        <h1 className="text-2xl font-bold break-words">
          {resume.name}
        </h1>

        <p className="text-sm mb-2 break-words">
          {resume.email} | {resume.phone}
        </p>

        <hr className="my-4" />

        {/* SUMMARY */}
        {resume.summary && (
          <Section
            title="Summary"
            content={
              <p className="text-sm leading-relaxed break-words">
                {resume.summary}
              </p>
            }
          />
        )}

        {/* SKILLS */}
        {resume.skills?.length > 0 && (
          <Section
            title="Skills"
            content={
              <ul className="list-disc ml-5 space-y-1 text-sm break-words">
                {resume.skills.map((skill, i) => (
                  <li
                    key={i}
                    className="whitespace-normal break-words leading-relaxed"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            }
          />
        )}

        {/* EXPERIENCE */}
        {resume.experience && (
          <Section
            title="Experience"
            content={
              <ul className="list-disc ml-5 space-y-2 text-sm leading-relaxed">
                {resume.experience
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
        {resume.education && (
          <Section
            title="Education"
            content={
              <p className="text-sm leading-relaxed break-words">
                {resume.education}
              </p>
            }
          />
        )}
      </div>
    </div>
  );
};

export default TemplateThree;
