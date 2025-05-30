
export const Header = () => {
  return (
    <header className="flex items-center justify-center px-6 py-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">C</span>
        </div>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          ClintonGPT
        </h1>
      </div>
    </header>
  );
};
