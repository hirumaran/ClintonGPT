import { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

export const MainContent = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      // Navigate to chat page with the message
      navigate('/chat', { state: { initialMessage: message } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full text-center">
          {/* Greeting */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              ClintonGPT
            </h1>
            <p className="text-xl text-gray-600 font-light">
              Your favorite science teacher
            </p>
          </div>

          {/* Input area */}
          <div className="mb-8">
            <div className="relative bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200 transition-all duration-300">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about science..."
                className="w-full resize-none border-0 focus:ring-0 bg-transparent p-8 pr-20 min-h-[100px] max-h-40 text-gray-800 placeholder-gray-500 text-lg rounded-3xl"
                rows={1}
              />
              <div className="absolute right-6 bottom-6">
                <Button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 rounded-2xl w-12 h-12 p-0 shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <ArrowUp className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
