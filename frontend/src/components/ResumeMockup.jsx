const ResumeMockup = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 relative text-sm text-gray-700">
      
      {/* ATS SCORE */}
      <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
        ATS Score: 82%
      </div>

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      {/* SECTIONS */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="h-3 w-20 bg-gray-300 rounded mb-2" />
          <div className="h-2 w-full bg-gray-200 rounded" />
        </div>

        <div>
          <div className="h-3 w-16 bg-gray-300 rounded mb-2" />
          <div className="flex gap-2">
            <div className="h-6 w-14 bg-violet-100 rounded" />
            <div className="h-6 w-16 bg-violet-100 rounded" />
            <div className="h-6 w-12 bg-violet-100 rounded" />
          </div>
        </div>

        <div>
          <div className="h-3 w-24 bg-gray-300 rounded mb-2" />
          <div className="h-2 w-full bg-gray-200 rounded" />
        </div>

        <div>
          <div className="h-3 w-20 bg-gray-300 rounded mb-2" />
          <div className="h-2 w-full bg-gray-200 rounded" />
        </div>
      </div>

      {/* DOWNLOAD */}
      <div className="mt-6 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
        Download PDF
      </div>
    </div>
  );
};

export default ResumeMockup;
