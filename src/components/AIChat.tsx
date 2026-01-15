import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile, ChatMessage } from '@/types/fitness';
import { Send, Loader2, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIChatProps {
  profile: UserProfile;
  chatHistory: ChatMessage[];
  onChatUpdate: (messages: ChatMessage[]) => void;
}

const AIChat = ({ profile, chatHistory, onChatUpdate }: AIChatProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messageIds, setMessageIds] = useState<number[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Track new messages for animation
  useEffect(() => {
    if (chatHistory.length > messageIds.length) {
      const newMessageId = chatHistory[chatHistory.length - 1]?.id;
      if (newMessageId && !messageIds.includes(Number(newMessageId))) {
        setMessageIds(prev => [...prev, Number(newMessageId)]);
      }
    }
  }, [chatHistory, messageIds]);

  const getCustomApiKey = () => {
    const useCustomApi = localStorage.getItem('fitgenius-use-custom-api');
    if (useCustomApi === 'true') {
      const apiKey = localStorage.getItem('fitgenius-gemini-api-key');
      return apiKey ? JSON.parse(apiKey) : null;
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...chatHistory, userMessage];
    onChatUpdate(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const messages = updatedHistory.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const customApiKey = getCustomApiKey();
      const { data, error } = await supabase.functions.invoke('ai-trainer', {
        body: {
          type: 'chat',
          userProfile: profile,
          messages,
          customApiKey,
        },
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not process your request.',
        timestamp: new Date().toISOString(),
      };

      onChatUpdate([...updatedHistory, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    onChatUpdate([]);
    setMessageIds([]);
    toast.success('Chat cleared');
  };

  const suggestions = [
    "How can I improve my bench press form?",
    "What should I eat before a workout?",
    "How many rest days should I take?",
    "Can you suggest a quick warm-up routine?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-24rem)]">
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary shadow-glow transition-all duration-300 hover:shadow-glow-lg">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold">AI Coach</h2>
            <p className="text-sm text-muted-foreground">Ask me anything about fitness</p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat} 
            className="text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <Card className="flex-1 border-border/50 shadow-card overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <CardContent className="p-4 space-y-4">
            {chatHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 rounded-2xl gradient-primary mb-4 shadow-glow animate-float transition-all duration-300 hover:shadow-glow-lg">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2 animate-fade-in">
                  How can I help you today?
                </h3>
                <p className="text-muted-foreground text-center text-sm mb-6 max-w-sm animate-fade-in animation-delay-200">
                  I'm your AI fitness coach. Ask me about workouts, nutrition, form tips, or anything fitness-related!
                </p>
                <div className="flex flex-wrap justify-center gap-2 animate-fade-in animation-delay-300">
                  {suggestions.map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(suggestion)}
                      className="text-xs border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {chatHistory.map((message, index) => {
              const isNew = messageIds.includes(Number(message.id));
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
                    isNew ? 'message-enter' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.role === 'assistant' && (
                    <div className="p-2 rounded-lg gradient-primary h-fit transition-transform duration-300 hover:scale-110">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-xl transition-all duration-300 ${
                      message.role === 'user'
                        ? 'gradient-primary text-primary-foreground shadow-glow'
                        : 'bg-muted border border-border/50 hover:border-primary/30'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="p-2 rounded-lg bg-muted h-fit transition-transform duration-300 hover:scale-110">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 message-enter">
                <div className="p-2 rounded-lg gradient-primary h-fit">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted border border-border/50 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      <div className="mt-4 flex gap-3 animate-fade-in animation-delay-200">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI coach..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
          className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="gradient-primary border-0 hover:opacity-90 transition-all duration-300 hover:shadow-glow px-6"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIChat;
