'use client';

import React, { useState, useEffect } from 'react';
import { 
  Binary, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles,
  Search
} from 'lucide-react';

interface StepState {
  left: number;
  right: number;
  mid?: number;
  found?: boolean;
  explanation: string;
}

export const AlgoVisualizerTool: React.FC = () => {
  const [array, setArray] = useState<number[]>([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
  const [target, setTarget] = useState<number>(23);
  const [algorithm, setAlgorithm] = useState<'binary-search' | 'two-pointers'>('binary-search');
  const [steps, setSteps] = useState<StepState[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Compute all steps for Binary Search
  const computeBinarySearchSteps = (arr: number[], tar: number) => {
    const s: StepState[] = [];
    let l = 0;
    let r = arr.length - 1;

    s.push({
      left: l,
      right: r,
      explanation: `Initialized pointers: Left = index 0 (value ${arr[0]}), Right = index ${r} (value ${arr[r]}). Searching for target ${tar}.`,
    });

    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      if (arr[m] === tar) {
        s.push({
          left: l,
          right: r,
          mid: m,
          found: true,
          explanation: `🎯 Match found! Array[mid=${m}] == ${tar}. Time complexity O(log N).`,
        });
        break;
      } else if (arr[m] < tar) {
        s.push({
          left: l,
          right: r,
          mid: m,
          found: false,
          explanation: `Array[mid=${m}] (${arr[m]}) < target (${tar}). Target must lie in the right half. Moving Left pointer to ${m + 1}.`,
        });
        l = m + 1;
      } else {
        s.push({
          left: l,
          right: r,
          mid: m,
          found: false,
          explanation: `Array[mid=${m}] (${arr[m]}) > target (${tar}). Target must lie in the left half. Moving Right pointer to ${m - 1}.`,
        });
        r = m - 1;
      }
    }

    if (l > r) {
      s.push({
        left: l,
        right: r,
        found: false,
        explanation: `Target ${tar} not found in the array. Left crossed Right (l > r). Search terminated in O(log N).`,
      });
    }

    return s;
  };

  // Compute steps for Two Pointers (Target Sum)
  const computeTwoPointersSteps = (arr: number[], tar: number) => {
    const s: StepState[] = [];
    let l = 0;
    let r = arr.length - 1;

    s.push({
      left: l,
      right: r,
      explanation: `Initialized Two Pointers: Left at index 0 (${arr[0]}), Right at index ${r} (${arr[r]}). Looking for pair summing to ${tar}.`,
    });

    while (l < r) {
      const sum = arr[l] + arr[r];
      if (sum === tar) {
        s.push({
          left: l,
          right: r,
          found: true,
          explanation: `🎯 Pair found! Array[${l}] (${arr[l]}) + Array[${r}] (${arr[r]}) == ${tar}. Done in O(N).`,
        });
        break;
      } else if (sum < tar) {
        s.push({
          left: l,
          right: r,
          found: false,
          explanation: `Current sum (${arr[l]} + ${arr[r]} = ${sum}) < target (${tar}). Incremented Left pointer to ${l + 1} to increase sum.`,
        });
        l++;
      } else {
        s.push({
          left: l,
          right: r,
          found: false,
          explanation: `Current sum (${arr[l]} + ${arr[r]} = ${sum}) > target (${tar}). Decremented Right pointer to ${r - 1} to decrease sum.`,
        });
        r--;
      }
    }

    if (l >= r) {
      s.push({
        left: l,
        right: r,
        found: false,
        explanation: `No two elements sum up to target ${tar}. Pointers met.`,
      });
    }

    return s;
  };

  // Re-run step calculation on changes
  useEffect(() => {
    const computed = algorithm === 'binary-search' 
      ? computeBinarySearchSteps(array, target)
      : computeTwoPointersSteps(array, target);
    setSteps(computed);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [array, target, algorithm]);

  // Autoplay effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const currentStep = steps[currentStepIndex] || { left: 0, right: 0, explanation: '' };

  const randomizeArray = () => {
    const randomSet = new Set<number>();
    while (randomSet.size < 10) {
      randomSet.add(Math.floor(Math.random() * 95) + 3);
    }
    const sorted = Array.from(randomSet).sort((a, b) => a - b);
    setArray(sorted);
    setTarget(sorted[Math.floor(Math.random() * sorted.length)]);
  };

  return (
    <div className="space-y-6 text-zinc-200">
      
      {/* Header Info */}
      <div className="p-4 rounded-xl bg-[#161822] border border-[#262a3c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">AlgoVisualizer Pro Runner</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Interactive Studio
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Step forward and backward through pointer memory graphs and call states in real-time.
            </p>
          </div>
        </div>

        {/* Algorithm Select */}
        <div className="flex items-center gap-2">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as 'binary-search' | 'two-pointers')}
            className="bg-[#1c2030] border border-[#2d334a] text-white text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none"
          >
            <option value="binary-search">Binary Search (O(log N))</option>
            <option value="two-pointers">Two Pointers Sum (O(N))</option>
          </select>

          <button
            onClick={randomizeArray}
            className="px-2.5 py-1.5 rounded-lg bg-[#1f2334] hover:bg-[#282d44] text-xs text-zinc-300 border border-[#2c334b]"
          >
            Randomize
          </button>
        </div>
      </div>

      {/* Target input and playback controls */}
      <div className="p-3.5 rounded-xl bg-[#13151f] border border-[#222637] flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-semibold">Search Target:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            className="w-16 bg-[#1a1d2b] border border-[#2b3147] text-white px-2 py-1 rounded-md text-center font-mono focus:outline-none"
          />
        </div>

        {/* Playback step buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="p-1.5 rounded-lg bg-[#1c2030] hover:bg-[#252a3f] text-zinc-300 transition"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg bg-[#1c2030] hover:bg-[#252a3f] disabled:opacity-40 text-zinc-300 transition"
            title="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            disabled={currentStepIndex >= steps.length - 1}
            onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            className="p-1.5 rounded-lg bg-[#1c2030] hover:bg-[#252a3f] disabled:opacity-40 text-zinc-300 transition"
            title="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-zinc-500 font-mono text-[11px] ml-1">
            Step {currentStepIndex + 1} / {steps.length}
          </span>
        </div>

      </div>

      {/* Visual Memory Array Display */}
      <div className="p-6 rounded-xl bg-[#10121a] border border-[#1f2231] space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
          <span>Memory Array Buffer [Sorted]</span>
          {currentStep.found && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Target Matched!
            </span>
          )}
        </div>

        {/* Array Bars Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {array.map((val, idx) => {
            const isLeft = idx === currentStep.left;
            const isRight = idx === currentStep.right;
            const isMid = idx === currentStep.mid;
            const isFound = isMid && currentStep.found;

            let bgColor = 'bg-[#181b28] border-[#292f45] text-zinc-200';
            if (isFound) {
              bgColor = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20';
            } else if (isMid) {
              bgColor = 'bg-amber-600/30 border-amber-500 text-amber-200';
            } else if (isLeft || isRight) {
              bgColor = 'bg-blue-600/20 border-blue-500 text-blue-200';
            } else if (idx < currentStep.left || idx > currentStep.right) {
              bgColor = 'bg-[#0f1118]/50 border-[#1a1d28] text-zinc-600 opacity-40';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-full h-16 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-base transition-all duration-200 ${bgColor}`}
                >
                  <span>{val}</span>
                  <span className="text-[9px] font-sans font-normal opacity-60">[{idx}]</span>
                </div>

                {/* Pointer Indicators */}
                <div className="h-5 flex items-center gap-1 text-[10px] font-bold">
                  {isLeft && <span className="text-blue-400">L</span>}
                  {isMid && <span className="text-amber-400">M</span>}
                  {isRight && <span className="text-indigo-400">R</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Explanation Callout */}
      <div className="p-4 rounded-xl bg-[#141724] border border-[#242b3e] space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Execution Trace</span>
        </div>
        <p className="text-zinc-300 leading-relaxed font-mono text-[11px]">
          {currentStep.explanation}
        </p>
      </div>

    </div>
  );
};
