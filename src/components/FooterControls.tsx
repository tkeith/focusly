import { useState, useRef, useEffect } from "react";
import { Play, Pause, Printer, Copy, Volume2 } from "lucide-react";
import { useDyslexiaSettings } from "~/stores/dyslexiaSettings";
import toast from "react-hot-toast";

interface FooterControlsProps {
  title: string;
  content: { type: "heading" | "paragraph"; level?: number; text: string; }[];
}

export function FooterControls({ title, content }: FooterControlsProps) {
  const { ttsSpeed } = useDyslexiaSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle text-to-speech
  const handleTTS = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported in your browser');
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    // Cancel any existing speech
    speechSynthesis.cancel();

    // Prepare text content
    const textToSpeak = [title, ...content.map(item => item.text)].join('. ');

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = ttsSpeed;
    utterance.volume = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast.error('Error occurred during text-to-speech');
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopTTS = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Handle print
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { font-size: 24px; margin-bottom: 20px; }
            h2 { font-size: 20px; margin: 20px 0 10px 0; }
            h3 { font-size: 18px; margin: 15px 0 10px 0; }
            p { margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${content.map(item => {
            if (item.type === 'heading') {
              const level = Math.min(item.level || 1, 6);
              return `<h${level}>${item.text}</h${level}>`;
            }
            return `<p>${item.text}</p>`;
          }).join('')}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  // Handle copy text
  const handleCopy = async () => {
    const textToCopy = [title, ...content.map(item => item.text)].join('\n\n');
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Text copied to clipboard');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast.success('Text copied to clipboard');
      } catch (fallbackError) {
        toast.error('Failed to copy text');
      }
      
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 space-x-6">
          {/* Text-to-Speech Controls */}
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-gray-500" />
            <button
              onClick={handleTTS}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {isPlaying ? (
                isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                )
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </>
              )}
            </button>
            
            {isPlaying && (
              <button
                onClick={stopTTS}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Stop
              </button>
            )}
          </div>

          {/* Utility Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </button>
            
            <button
              onClick={handleCopy}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
