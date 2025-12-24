const TemplateSelector = ({ selected, onChange }) => {
  const templates = [
    { id: "one", name: "Classic" },
    { id: "two", name: "Modern" },
    { id: "three", name: "Minimal" },
  ];

  return (
    <div className="no-print flex gap-3 mb-4">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2 rounded-lg font-medium border
            ${
              selected === t.id
                ? "bg-violet-600 text-white"
                : "bg-white text-gray-700"
            }`}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
};

export default TemplateSelector;
