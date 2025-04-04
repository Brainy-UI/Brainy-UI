"use client";
import React, { useEffect, useRef, useState } from "react";
import zxcvbn from "zxcvbn";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

type Props = {
  value: string;
  onChange: (value: string, score: number, suggestions: string[]) => void;
  placeholder?: string;
  showCrackTime?: boolean;
  showGuesses?: boolean;
  showEntropy?: boolean;
  showAnalysisTime?: boolean;
  showPatterns?: boolean;
};

const strengthLabels = [
  "🟥 Very Weak",
  "🟧 Weak",
  "🟨 Fair",
  "🟩 Strong",
  "🟦 Very Strong",
];

const popoverSideMap: Record<number, "top" | "right" | "left"> = {
  0: "top",
  1: "top",
  2: "right",
  3: "left",
  4: "left",
};

const PasswordInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  showCrackTime = true,
  showGuesses = true,
  showEntropy = true,
  showAnalysisTime = true,
  showPatterns = true,
}) => {
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [crackInfo, setCrackInfo] = useState<{
    online: string | number;
    offline: string | number;
    guesses: number;
    calcTime: number;
    entropy: number;
  } | null>(null);
  const [patterns, setPatterns] = useState<string[]>([]);
  const [popoverSide, setPopoverSide] = useState<"top" | "right" | "left">(
    "top"
  );

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value.length === 0) {
      setScore(0);
      setSuggestions([]);
      setShowPopover(false);
      setCrackInfo(null);
      setPatterns([]);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const result = zxcvbn(value);
      const { feedback, score, guesses, crack_times_display, calc_time } =
        result;
      const entropy = Math.round(result.guesses_log10 * 3.32); // approx conversion to bits

      setScore(score);
      setSuggestions(feedback.suggestions || []);
      setCrackInfo({
        online: crack_times_display.online_no_throttling_10_per_second,
        offline: crack_times_display.offline_fast_hashing_1e10_per_second,
        guesses,
        calcTime: calc_time,
        entropy,
      });

      setPatterns(result.sequence.map((seq) => seq.pattern));
      setPopoverSide(popoverSideMap[score]);

      onChange(value, score, feedback.suggestions || []);
      setShowPopover(!(score === 4 && feedback.suggestions.length === 0));
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, onChange]);

  const DynamicProgressBar = ({
    value,
    score,
  }: {
    value: number;
    score: number;
  }) => {
    const dynamicColor =
      score === 0
        ? "bg-red-500"
        : score === 1
        ? "bg-orange-500"
        : score === 2
        ? "bg-yellow-500"
        : score === 3
        ? "bg-green-500"
        : "bg-green-600";

    const fillValue = score === 0 ? 5 : value;

    return (
      <div className="w-full h-3 rounded-full bg-white shadow-inner border border-gray-200 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${dynamicColor} rounded-full`}
          style={{ width: `${fillValue}%` }}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md min-w-[300px]">
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <div className="w-full">
            <Label className="mb-1 text-sm font-medium">Password</Label>
            <Input
              type="password"
              value={value}
              onChange={(e) => onChange(e.target.value, score, suggestions)}
              placeholder={placeholder || "Enter your password"}
              className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          side={popoverSide}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="text-sm text-gray-600 w-full max-w-sm p-3 rounded-md shadow-lg border border-gray-200 bg-white space-y-2"
        >
          {suggestions.length > 0 && (
            <>
              <p className="font-medium mb-1">Suggestions:</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                {suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </>
          )}

          {crackInfo && (
            <div className="text-xs text-gray-500 space-y-1 border-t pt-2">
              {showCrackTime && (
                <>
                  <div>
                    <span className="font-semibold">Offline Crack Time:</span>{" "}
                    {crackInfo.offline}
                  </div>
                  <div>
                    <span className="font-semibold">Online Crack Time:</span>{" "}
                    {crackInfo.online}
                  </div>
                </>
              )}
              {showGuesses && (
                <div>
                  <span className="font-semibold">Estimated Guesses:</span>{" "}
                  {crackInfo.guesses.toLocaleString()}
                </div>
              )}
              {showEntropy && (
                <div>
                  <span className="font-semibold">Entropy:</span>{" "}
                  {crackInfo.entropy} bits
                </div>
              )}
              {showAnalysisTime && (
                <div>
                  <span className="font-semibold">Analysis Time:</span>{" "}
                  {crackInfo.calcTime}ms
                </div>
              )}
            </div>
          )}

          {showPatterns && patterns.length > 0 && (
            <div className="text-xs text-gray-500 border-t pt-2">
              <span className="font-semibold">Detected Patterns:</span>{" "}
              {patterns.join(", ")}
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{strengthLabels[score]}</span>
        </div>
        <DynamicProgressBar value={(score + 1) * 20} score={score} />
      </div>
    </div>
  );
};

export default PasswordInput;
