import { useState, useEffect, useRef } from "react";
import { ArrowUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  gifUrl?: string;
}

interface Response {
  type: 'combined';
  text: string;
  gifUrl: string;
}

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial message from homepage
  useEffect(() => {
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && messages.length === 0) {
      handleInitialMessage(initialMessage);
    }
  }, [location.state]);

  const handleInitialMessage = async (initialMsg: string) => {
    console.log("Processing initial message:", initialMsg);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: initialMsg,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages([userMessage]);

    // Generate and add bot response
    try {
      const response = await generateResponse(initialMsg);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        gifUrl: response.gifUrl || undefined
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Suure!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const getGif = async (query: string) => {
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=6nPg94hr67xzBoPniMaHtuHEMLoOTW5M&s=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.data?.images?.fixed_height?.url || null;
    } catch (error) {
      console.log("Error fetching GIF:", error);
      return null;
    }
  };

  const generateResponse = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Define different categories and their associated search terms and responses
    const categories = {
      positive: {
        keywords: ['happy', 'great', 'awesome', 'amazing', 'wow', 'cool', 'excellent', 'love', 'like', 'good', 'yes', 'yeah', 'sure', 'okay', 'ok'],
        responses: ['Suure!', 'That sounds amazing!', 'I love that!', 'That\'s fantastic!']
      },
      negative: {
        keywords: ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike', 'no', 'nope', 'wrong', 'sorry', 'apologize'],
        responses: ['Put that one on the Need to know list!', 'Let\'s think about this...', 'Hmm, interesting perspective...']
      },
      thinking: {
        keywords: ['think', 'thought', 'idea', 'maybe', 'perhaps', 'possibly', 'consider', 'wonder', 'question'],
        responses: ['Put that one on the Need to know list!', 'That\'s worth thinking about!', 'Interesting thought!']
      },
      excited: {
        keywords: ['excited', 'wow', 'amazing', 'incredible', 'fantastic', 'wonderful', 'brilliant', 'perfect'],
        responses: ['Suure!', 'That\'s incredible!', 'Absolutely amazing!']
      },
      confused: {
        keywords: ['confused', 'what', 'huh', 'pardon', 'sorry', 'repeat', 'again', 'clarify', 'explain'],
        responses: ['Let me think about that...', 'Interesting question!', 'Hmm...']
      },
      agreement: {
        keywords: ['agree', 'yes', 'sure', 'okay', 'fine', 'alright', 'definitely', 'absolutely', 'certainly'],
        responses: ['Suure!', 'Absolutely!', 'Definitely!']
      },
      disagreement: {
        keywords: ['disagree', 'no', 'nope', 'wrong', 'incorrect', 'false', 'never', 'not'],
        responses: ['Put that one on the Need to know list!', 'Let\'s discuss this...', 'Interesting perspective...']
      },
      greeting: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
        responses: ['Suure!', 'Hello there!', 'Hi! How can I help?']
      },
      farewell: {
        keywords: ['bye', 'goodbye', 'see you', 'farewell', 'later', 'take care'],
        responses: ['Put that one on the Need to know list!', 'See you later!', 'Take care!']
      },
      thanks: {
        keywords: ['thanks', 'thank you', 'appreciate', 'grateful'],
        responses: ['Suure!', 'You\'re welcome!', 'My pleasure!']
      },
      science: {
        keywords: ['science', 'experiment', 'research', 'study', 'lab', 'chemistry', 'physics', 'biology'],
        responses: ['Suure!', 'Science is fascinating!', 'Let\'s explore that!']
      },
      needToKnow: {
        keywords: ['important', 'remember', 'note', 'write down', 'don\'t forget', 'keep in mind'],
        responses: ['Put that one on the Need to know list!', 'I\'ll remember that!', 'Noted!']
      }
    };

    // Find the most relevant category for the message
    let bestCategory = '';
    let maxMatches = 0;
    let categoryResponses: string[] = [];

    for (const [category, data] of Object.entries(categories)) {
      const matches = data.keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestCategory = category;
        categoryResponses = data.responses;
      }
    }

    // If no category matches, use default responses
    if (!bestCategory) {
      categoryResponses = ['Suure!', 'Put that one on the Need to know list!'];
    }

    // Get a random response from the category
    const textResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    // Create a search term that combines the category and response
    const searchTerm = bestCategory ? 
      `${bestCategory} ${textResponse.toLowerCase().replace(/[^a-z0-9]+/g, ' ')}` : 
      textResponse.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
    
    // Try to get a GIF
    const gifUrl = await getGif(searchTerm);
    
    if (gifUrl) {
      return { 
        type: 'combined',
        text: textResponse,
        gifUrl: gifUrl
      } as Response;
    }
    
    // Fallback to just text if no GIF is found
    return { 
      type: 'combined',
      text: textResponse,
      gifUrl: ''
    } as Response;
  };

  const handleSend = async () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      const currentMessage = message;
      setMessage("");

      // Generate and add bot response immediately
      try {
        const response = await generateResponse(currentMessage);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isUser: false,
          timestamp: new Date(),
          gifUrl: response.gifUrl || undefined
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error("Error generating response:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Suure!",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            ClintonGPT
          </h1>
        </div>
        <div className="w-16"></div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Start a conversation with ClintonGPT!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.isUser
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                  : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800'
              } shadow-lg`}
            >
              <p className="text-sm">{msg.text}</p>
              {msg.gifUrl && (
                <img 
                  src={msg.gifUrl} 
                  alt="Response GIF" 
                  className="rounded-lg max-w-full h-auto mt-2"
                />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200 transition-all duration-300">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about science..."
              className="w-full resize-none border-0 focus:ring-0 bg-transparent p-6 pr-20 min-h-[60px] max-h-32 text-gray-800 placeholder-gray-500 rounded-3xl"
              rows={1}
            />
            <div className="absolute right-4 bottom-4">
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
  );
};

export default Chat;

