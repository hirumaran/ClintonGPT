
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <MainContent />
    </div>
  );
};

export default Index;
