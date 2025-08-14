import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, RotateCcw } from "lucide-react";
import { useDyslexiaSettings, FontFamily, BackgroundColor, TextColor } from "~/stores/dyslexiaSettings";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
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
    ttsSpeed,
    setFontFamily,
    setFontSize,
    setLetterSpacing,
    setWordSpacing,
    setLineHeight,
    setBackgroundColor,
    setTextColor,
    setReadingRulerEnabled,
    setFocusModeEnabled,
    setSyllableBreaksEnabled,
    setParagraphSpacingEnabled,
    setTtsSpeed,
    resetToDefaults,
  } = useDyslexiaSettings();

  const fontOptions: { value: FontFamily; label: string }[] = [
    { value: "OpenDyslexic", label: "OpenDyslexic" },
    { value: "Arial", label: "Arial" },
    { value: "Comic Sans", label: "Comic Sans" },
    { value: "Verdana", label: "Verdana" },
  ];

  const backgroundColors: { value: BackgroundColor; label: string; color: string }[] = [
    { value: "cream", label: "Cream", color: "#FDFDF5" },
    { value: "lightBlue", label: "Light Blue", color: "#E6F3FF" },
    { value: "lightYellow", label: "Light Yellow", color: "#FFFDE6" },
    { value: "lightGray", label: "Light Gray", color: "#F5F5F5" },
    { value: "white", label: "White", color: "#FFFFFF" },
  ];

  const textColors: { value: TextColor; label: string; color: string }[] = [
    { value: "darkGray", label: "Dark Gray", color: "#333333" },
    { value: "navy", label: "Navy", color: "#000080" },
    { value: "darkBrown", label: "Dark Brown", color: "#3B2F2F" },
    { value: "black", label: "Black", color: "#000000" },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-end">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-white shadow-xl transition-all h-full">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      Reading Settings
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Typography Controls */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Typography</h4>
                      
                      {/* Font Family */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select
                          value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {fontOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Size: {fontSize}px
                        </label>
                        <input
                          type="range"
                          min="16"
                          max="28"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Letter Spacing */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Letter Spacing: {letterSpacing}em
                        </label>
                        <input
                          type="range"
                          min="0.05"
                          max="0.2"
                          step="0.01"
                          value={letterSpacing}
                          onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Word Spacing */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Word Spacing: {wordSpacing}em
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="0.4"
                          step="0.01"
                          value={wordSpacing}
                          onChange={(e) => setWordSpacing(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Line Height */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Line Height: {lineHeight}
                        </label>
                        <input
                          type="range"
                          min="1.5"
                          max="3.0"
                          step="0.1"
                          value={lineHeight}
                          onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Color Schemes */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Color Scheme</h4>
                      
                      {/* Background Color */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Color
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {backgroundColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setBackgroundColor(color.value)}
                              className={`p-3 rounded-md border-2 transition-all ${
                                backgroundColor === color.value
                                  ? "border-indigo-500 ring-2 ring-indigo-200"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                              style={{ backgroundColor: color.color }}
                            >
                              <span className="text-xs font-medium">{color.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Color */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Text Color
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {textColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setTextColor(color.value)}
                              className={`p-3 rounded-md border-2 transition-all ${
                                textColor === color.value
                                  ? "border-indigo-500 ring-2 ring-indigo-200"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-4 h-4 rounded mr-2"
                                  style={{ backgroundColor: color.color }}
                                />
                                <span className="text-xs font-medium">{color.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Reading Tools */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Reading Tools</h4>
                      
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={readingRulerEnabled}
                            onChange={(e) => setReadingRulerEnabled(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Reading Ruler</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={focusModeEnabled}
                            onChange={(e) => setFocusModeEnabled(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Focus Mode</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={syllableBreaksEnabled}
                            onChange={(e) => setSyllableBreaksEnabled(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Syllable Breaks</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={paragraphSpacingEnabled}
                            onChange={(e) => setParagraphSpacingEnabled(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Extra Paragraph Spacing</span>
                        </label>
                      </div>
                    </div>

                    {/* Text-to-Speech */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Text-to-Speech</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reading Speed: {ttsSpeed}x
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.1"
                          value={ttsSpeed}
                          onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={resetToDefaults}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
