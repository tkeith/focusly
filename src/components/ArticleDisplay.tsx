import { useState, useEffect, useRef } from "react";
import { useDyslexiaSettings, BackgroundColor, TextColor, FontFamily } from "~/stores/dyslexiaSettings";

interface ArticleContent {
  type: "heading" | "paragraph";
  level?: number;
  text: string;
}

interface ArticleDisplayProps {
  title: string;
  content: ArticleContent[];
  url: string;
}

export function ArticleDisplay({ title, content, url }: ArticleDisplayProps) {
  const {
    fontFamily,
    fontSize,
    letterSpacing,
    wordSpacing,
    lineHeight,
    backgroundColor,
    textColor,
    readingRulerEnabled,
    focusModeEnabled,
    syllableBreaksEnabled,
    paragraphSpacingEnabled,
  } = useDyslexiaSettings();

  const [focusedParagraphIndex, setFocusedParagraphIndex] = useState<number | null>(null);
  const [rulerPosition, setRulerPosition] = useState({ x: 0, y: 0, visible: false });
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for reading ruler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!readingRulerEnabled || !contentRef.current) return;

      const rect = contentRef.current.getBoundingClientRect();
      const isInside = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      setRulerPosition({
        x: e.clientX,
        y: e.clientY,
        visible: isInside,
      });
    };

    if (readingRulerEnabled) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [readingRulerEnabled]);

  // Color mapping
  const backgroundColorMap: Record<BackgroundColor, string> = {
    cream: "#FDFDF5",
    lightBlue: "#E6F3FF",
    lightYellow: "#FFFDE6",
    lightGray: "#F5F5F5",
    white: "#FFFFFF",
  };

  const textColorMap: Record<TextColor, string> = {
    darkGray: "#333333",
    navy: "#000080",
    darkBrown: "#3B2F2F",
    black: "#000000",
  };

  const fontFamilyMap: Record<FontFamily, string> = {
    OpenDyslexic: "'OpenDyslexic', sans-serif",
    Arial: "Arial, sans-serif",
    "Comic Sans": "'Comic Sans MS', cursive",
    Verdana: "Verdana, sans-serif",
  };

  // Function to add syllable breaks to words
  const addSyllableBreaks = (text: string): string => {
    if (!syllableBreaksEnabled) return text;

    return text.replace(/\b\w{9,}\b/g, (word) => {
      // Simple syllable breaking - this is a basic implementation
      // In a real app, you'd use a proper syllable library
      const syllables = word.match(/.{1,3}/g) || [word];
      return syllables.join('•');
    });
  };

  // Base styles for the content area
  const contentStyles = {
    backgroundColor: backgroundColorMap[backgroundColor],
    color: textColorMap[textColor],
    fontFamily: fontFamilyMap[fontFamily],
    fontSize: `${fontSize}px`,
    letterSpacing: `${letterSpacing}em`,
    wordSpacing: `${wordSpacing}em`,
    lineHeight: lineHeight,
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: backgroundColorMap[backgroundColor] }}>
      {/* Reading Ruler */}
      {readingRulerEnabled && rulerPosition.visible && (
        <div
          className="fixed pointer-events-none z-40"
          style={{
            left: 0,
            right: 0,
            top: rulerPosition.y - 1,
            height: '2px',
            backgroundColor: textColorMap[textColor],
            opacity: 0.3,
          }}
        />
      )}

      <div 
        ref={contentRef}
        className="max-w-4xl mx-auto px-8 py-12"
        style={contentStyles}
      >
        {/* Article Title */}
        <h1 
          className="mb-8 font-bold transition-all duration-300"
          style={{
            fontSize: `${Math.min(fontSize * 1.8, 48)}px`,
            marginBottom: paragraphSpacingEnabled ? '2em' : '1em',
          }}
        >
          {addSyllableBreaks(title)}
        </h1>

        {/* Article URL */}
        <div className="mb-8 text-sm opacity-60">
          <span>Source: </span>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            {url}
          </a>
        </div>

        {/* Article Content */}
        <div className="space-y-4">
          {content.map((item, index) => {
            const isHeading = item.type === "heading";
            const isParagraph = item.type === "paragraph";
            const isFocused = focusModeEnabled && focusedParagraphIndex === index;
            const isUnfocused = focusModeEnabled && focusedParagraphIndex !== null && focusedParagraphIndex !== index;

            const commonStyles = {
              opacity: isUnfocused ? 0.3 : 1,
              transition: 'opacity 0.3s ease',
              marginBottom: paragraphSpacingEnabled ? '2em' : '1em',
              cursor: focusModeEnabled ? 'pointer' : 'default',
            };

            if (isHeading) {
              const HeadingTag = `h${Math.min(item.level || 1, 6)}` as keyof JSX.IntrinsicElements;
              const headingSize = Math.max(fontSize * (1.5 - (item.level || 1) * 0.1), fontSize);

              return (
                <HeadingTag
                  key={index}
                  className="font-semibold transition-all duration-300"
                  style={{
                    ...commonStyles,
                    fontSize: `${headingSize}px`,
                  }}
                  onClick={() => focusModeEnabled && setFocusedParagraphIndex(isFocused ? null : index)}
                >
                  {addSyllableBreaks(item.text)}
                </HeadingTag>
              );
            }

            if (isParagraph) {
              return (
                <p
                  key={index}
                  className="transition-all duration-300"
                  style={commonStyles}
                  onClick={() => focusModeEnabled && setFocusedParagraphIndex(isFocused ? null : index)}
                >
                  {addSyllableBreaks(item.text)}
                </p>
              );
            }

            return null;
          })}
        </div>

        {/* Focus Mode Instructions */}
        {focusModeEnabled && (
          <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
            Click on paragraphs to focus • Click again to unfocus
          </div>
        )}
      </div>
    </div>
  );
}
