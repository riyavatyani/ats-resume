const TemplateClassic = ({ resume }) => {
  return (
    <div className="grid grid-cols-3">
      <div className="bg-slate-900 text-white p-6">
        <img src={resume.photo} className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-bold text-center">{resume.name}</h2>
        <p className="text-center text-sm">{resume.title}</p>

        <h3 className="mt-6 font-semibold">Skills</h3>
        <ul className="list-disc list-inside text-sm">
          {resume.skills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="col-span-2 p-8">
        <Section title="Summary" content={resume.summary} />
        <Section title="Experience" content={resume.experience} />
        <Section title="Education" content={resume.education} />
      </div>
    </div>
  );
};

export default TemplateClassic;
