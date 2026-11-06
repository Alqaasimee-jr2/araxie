'use client';

import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Download, 
  Calculator, 
  Clock, 
  AlertCircle,
  FileDown
} from 'lucide-react';

interface Assignment {
  id: string;
  course: string;
  title: string;
  dueDate: string;
  weight: number; // percentage of grade
  currentScore?: number;
  completed: boolean;
}

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    course: 'CS 106B',
    title: 'Assignment 4: Binary Trees & Heaps',
    dueDate: '2026-11-12',
    weight: 15,
    currentScore: 94,
    completed: true,
  },
  {
    id: 'a2',
    course: 'CHEM 33',
    title: 'Organic Reaction Mechanism Set #3',
    dueDate: '2026-11-15',
    weight: 10,
    currentScore: 88,
    completed: false,
  },
  {
    id: 'a3',
    course: 'CS 106B',
    title: 'Midterm Examination',
    dueDate: '2026-11-20',
    weight: 35,
    completed: false,
  },
  {
    id: 'a4',
    course: 'MATH 51',
    title: 'Multivariable Linear Systems Problem Set',
    dueDate: '2026-11-18',
    weight: 15,
    currentScore: 92,
    completed: true,
  },
  {
    id: 'a5',
    course: 'CHEM 33',
    title: 'Final Cumulative Synthesis Exam',
    dueDate: '2026-12-08',
    weight: 40,
    completed: false,
  }
];

export const CanvasAutoPilotTool: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(DEFAULT_ASSIGNMENTS);
  const [targetGrade, setTargetGrade] = useState<number>(90); // e.g. 90% for an A
  const [finalWeight, setFinalWeight] = useState<number>(35); // weight of final exam
  const [currentAverage, setCurrentAverage] = useState<number>(89);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS 106B');
  const [newDueDate, setNewDueDate] = useState('2026-11-22');
  const [newWeight, setNewWeight] = useState('10');

  // Calculate required score on remaining exam to achieve target grade:
  // Target = (CurrentAvg * (100 - FinalWeight) + Required * FinalWeight) / 100
  // Required = (Target * 100 - CurrentAvg * (100 - FinalWeight)) / FinalWeight
  const weightNonFinal = 100 - finalWeight;
  const rawRequiredScore = (targetGrade * 100 - currentAverage * weightNonFinal) / finalWeight;
  const requiredScore = Number(rawRequiredScore.toFixed(1));

  const toggleComplete = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const addAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: Assignment = {
      id: `task-${Date.now()}`,
      course: newCourse,
      title: newTitle,
      dueDate: newDueDate,
      weight: parseFloat(newWeight) || 10,
      completed: false,
    };
    setAssignments(prev => [item, ...prev]);
    setNewTitle('');
  };

  // Generate real .ics file for Google / Apple Calendar import
  const exportICS = () => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Araxie Student Tools//CanvasAutoPilot v2.4//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    assignments.forEach(a => {
      const dateClean = a.dueDate.replace(/-/g, '');
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:araxie-${a.id}@campuswhop.edu`);
      lines.push(`DTSTAMP:${dateClean}T090000Z`);
      lines.push(`DTSTART;VALUE=DATE:${dateClean}`);
      lines.push(`SUMMARY:[${a.course}] ${a.title}`);
      lines.push(`DESCRIPTION:Canvas LMS Coursework deadline. Weight: ${a.weight}% of final grade.`);
      lines.push('STATUS:CONFIRMED');
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    const icsContent = lines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Araxie-Canvas-Schedule-${Date.now()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-zinc-200">
      
      {/* Header Info Banner */}
      <div className="p-4 rounded-xl bg-[#161822] border border-[#262a3c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">CanvasAutoPilot Workspace</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Interactive Tool Active
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Synchronize assignments, forecast required syllabus exam curves, and export to calendar.
            </p>
          </div>
        </div>

        <button
          onClick={exportICS}
          className="px-3.5 py-2 rounded-xl bg-[#1f2333] hover:bg-[#282e44] text-white text-xs font-semibold border border-[#2d344d] transition flex items-center gap-1.5 shrink-0"
        >
          <FileDown className="w-4 h-4 text-blue-400" />
          <span>Export to Calendar (.ics)</span>
        </button>
      </div>

      {/* Grade Curve Calculator Widget */}
      <div className="p-4 rounded-xl bg-[#13151f] border border-[#222637] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Final Exam Curve & Target Score Forecaster</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-400">Current Course Average (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={currentAverage}
              onChange={(e) => setCurrentAverage(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#181b28] border border-[#282d42] text-white px-3 py-1.5 rounded-lg font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Target Final Grade (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={targetGrade}
              onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#181b28] border border-[#282d42] text-white px-3 py-1.5 rounded-lg font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Remaining Exam Weight (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={finalWeight}
              onChange={(e) => setFinalWeight(parseFloat(e.target.value) || 1)}
              className="w-full bg-[#181b28] border border-[#282d42] text-white px-3 py-1.5 rounded-lg font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0e1017] border border-[#1b1f2e] flex items-center justify-between">
          <div className="text-xs">
            <span className="text-zinc-400">Score needed on the remaining exam to secure your target:</span>
          </div>
          <div className="text-right">
            <span className={`text-base font-bold font-mono ${requiredScore > 100 ? 'text-rose-400' : requiredScore <= 70 ? 'text-emerald-400' : 'text-blue-400'}`}>
              {requiredScore}%
            </span>
            <span className="text-[10px] text-zinc-500 block">
              {requiredScore > 100 ? 'Need extra credit' : requiredScore <= 70 ? 'Comfortable buffer' : 'Attainable target'}
            </span>
          </div>
        </div>
      </div>

      {/* Add New Assignment Form */}
      <form onSubmit={addAssignment} className="p-3.5 rounded-xl bg-[#141620] border border-[#212536] flex flex-wrap items-center gap-2 text-xs">
        <input
          type="text"
          placeholder="New assignment or quiz title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 min-w-[180px] bg-[#1a1d2b] border border-[#292f44] text-white px-3 py-1.5 rounded-lg focus:outline-none"
        />

        <select
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          className="bg-[#1a1d2b] border border-[#292f44] text-white px-2.5 py-1.5 rounded-lg focus:outline-none"
        >
          <option value="CS 106B">CS 106B</option>
          <option value="CHEM 33">CHEM 33</option>
          <option value="MATH 51">MATH 51</option>
          <option value="BIO 81">BIO 81</option>
        </select>

        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="bg-[#1a1d2b] border border-[#292f44] text-white px-2.5 py-1.5 rounded-lg focus:outline-none font-mono text-xs"
        />

        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="Weight %"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="w-16 bg-[#1a1d2b] border border-[#292f44] text-white px-2 py-1.5 rounded-lg text-center font-mono focus:outline-none"
          />
          <span className="text-zinc-500">%</span>
        </div>

        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Assignments List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
          <span>Tracked Deadlines ({assignments.length})</span>
          <span>{assignments.filter(a => a.completed).length} Completed</span>
        </div>

        <div className="divide-y divide-[#1f2334] rounded-xl bg-[#11131c] border border-[#202436] overflow-hidden">
          {assignments.map((item) => (
            <div
              key={item.id}
              className={`p-3 flex items-center justify-between gap-3 text-xs transition ${item.completed ? 'bg-[#0f1118]/60 opacity-60' : 'hover:bg-[#161824]'}`}
            >
              <div className="flex items-center gap-3 truncate">
                <button
                  onClick={() => toggleComplete(item.id)}
                  className="text-zinc-400 hover:text-white transition shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-600" />
                  )}
                </button>

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white truncate">{item.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                      {item.course}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" /> Due {item.dueDate}
                    </span>
                    <span>•</span>
                    <span>{item.weight}% of Course Grade</span>
                    {item.currentScore && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">Scored: {item.currentScore}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteAssignment(item.id)}
                className="p-1 rounded text-zinc-500 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
