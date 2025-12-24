const Section = ({ title, content }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2 border-b pb-1">
        {title}
      </h3>

      {/* IMPORTANT: no <p> wrapper */}
      <div className="text-sm text-gray-700 leading-relaxed">
        {content}
      </div>
    </div>
  );
};

export default Section;
