import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number;
  showCursor?: boolean;
}

export const TypingText = ({ 
  text, 
  className, 
  speed = 100,
  showCursor = true 
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [displayedText, text, speed]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {showCursor && (
        <span 
          className={cn(
            "inline-block w-0.5 h-[1em] bg-primary ml-1.5 align-middle",
            "animate-[blink_1s_step-end_infinite]"
          )}
        />
      )}
    </span>
  );
};
