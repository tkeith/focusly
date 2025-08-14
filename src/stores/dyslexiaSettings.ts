import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FontFamily = "OpenDyslexic" | "Arial" | "Comic Sans" | "Verdana";
export type BackgroundColor = "cream" | "lightBlue" | "lightYellow" | "lightGray" | "white";
export type TextColor = "darkGray" | "navy" | "darkBrown" | "black";

interface DyslexiaSettings {
  // Typography Controls
  fontFamily: FontFamily;
  fontSize: number; // 16-28px
  letterSpacing: number; // 0.05-0.2em
  wordSpacing: number; // 0.1-0.4em
  lineHeight: number; // 1.5-3.0

  // Color Scheme
  backgroundColor: BackgroundColor;
  textColor: TextColor;

  // Reading Tools
  readingRulerEnabled: boolean;
  focusModeEnabled: boolean;
  syllableBreaksEnabled: boolean;
  paragraphSpacingEnabled: boolean;

  // Text-to-Speech Settings
  ttsSpeed: number; // 0.5-2.0

  // Actions
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: number) => void;
  setLetterSpacing: (spacing: number) => void;
  setWordSpacing: (spacing: number) => void;
  setLineHeight: (height: number) => void;
  setBackgroundColor: (color: BackgroundColor) => void;
  setTextColor: (color: TextColor) => void;
  setReadingRulerEnabled: (enabled: boolean) => void;
  setFocusModeEnabled: (enabled: boolean) => void;
  setSyllableBreaksEnabled: (enabled: boolean) => void;
  setParagraphSpacingEnabled: (enabled: boolean) => void;
  setTtsSpeed: (speed: number) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  fontFamily: "OpenDyslexic" as FontFamily,
  fontSize: 20,
  letterSpacing: 0.1,
  wordSpacing: 0.2,
  lineHeight: 2.0,
  backgroundColor: "cream" as BackgroundColor,
  textColor: "darkGray" as TextColor,
  readingRulerEnabled: false,
  focusModeEnabled: false,
  syllableBreaksEnabled: false,
  paragraphSpacingEnabled: true,
  ttsSpeed: 1.0,
};

export const useDyslexiaSettings = create<DyslexiaSettings>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      setFontFamily: (font) => set({ fontFamily: font }),
      setFontSize: (size) => set({ fontSize: size }),
      setLetterSpacing: (spacing) => set({ letterSpacing: spacing }),
      setWordSpacing: (spacing) => set({ wordSpacing: spacing }),
      setLineHeight: (height) => set({ lineHeight: height }),
      setBackgroundColor: (color) => set({ backgroundColor: color }),
      setTextColor: (color) => set({ textColor: color }),
      setReadingRulerEnabled: (enabled) => set({ readingRulerEnabled: enabled }),
      setFocusModeEnabled: (enabled) => set({ focusModeEnabled: enabled }),
      setSyllableBreaksEnabled: (enabled) => set({ syllableBreaksEnabled: enabled }),
      setParagraphSpacingEnabled: (enabled) => set({ paragraphSpacingEnabled: enabled }),
      setTtsSpeed: (speed) => set({ ttsSpeed: speed }),
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: "dyslexia-settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
