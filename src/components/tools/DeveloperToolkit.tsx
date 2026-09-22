import React, { useState, useEffect } from 'react';
import {
  Code,
  Check,
  Copy,
  Terminal,
  FileJson,
  Fingerprint,
  Binary,
  Link2,
  Clock,
  Palette,
  FileEdit,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Sparkles
} from 'lucide-react';

export const DeveloperToolkit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'json' | 'uuid' | 'base64' | 'url' | 'timestamp' | 'hexrgb' | 'notes' | 'game-debug' | 'game-logic'
  >('json');

  // JSON Formatter State
  const [jsonInput, setJsonInput] = useState<string>('{\n  "app": "NEXA",\n  "version": 2.5,\n  "features": ["AI", "Tools", "Finance"]\n}');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);

  // UUID State
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);
  const [uuidCount, setUuidCount] = useState<number>(1);
  const [uuidCopied, setUuidCopied] = useState(false);

  // Base64 State
  const [base64Input, setBase64Input] = useState<string>('Hello from NEXA Developer Toolkit!');
  const [base64Output, setBase64Output] = useState<string>('');
  const [base64Error, setBase64Error] = useState<string | null>(null);
  const [base64Copied, setBase64Copied] = useState(false);

  // URL Encoder State
  const [urlInput, setUrlInput] = useState<string>('https://nexa.com.in/search?q=developer tools&category=ai');
  const [urlOutput, setUrlOutput] = useState<string>('');
  const [urlCopied, setUrlCopied] = useState(false);

  // Timestamp State
  const [timestampInput, setTimestampInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));
  const [timestampResult, setTimestampResult] = useState<{ local: string; utc: string; epochSec: number; epochMs: number }>({
    local: '',
    utc: '',
    epochSec: 0,
    epochMs: 0
  });

  // HEX / RGB State
  const [hexInput, setHexInput] = useState<string>('#06B6D4');
  const [rgbInput, setRgbInput] = useState<{ r: number; g: number; b: number }>({ r: 6, g: 182, b: 212 });
  const [hexRgbCopied, setHexRgbCopied] = useState(false);

  // Developer Notes State
  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem('nexa_dev_notes') || '// NEXA Developer Scratchpad\n// Auto-saved to local browser storage\n\n// TODO: Test APK binary signature\n// API endpoint: /api/ai/chat\n';
  });

  // ----------------------------------------------------
  // GAME 1: Code Debug Challenge State & Data
  // ----------------------------------------------------
  const debugChallenges = [
    {
      id: 1,
      language: 'TypeScript',
      title: 'Off-by-One Array Index Bug',
      code: `function getLastElement<T>(arr: T[]): T | undefined {\n  // BUG: accessing incorrect index\n  return arr[arr.length];\n}`,
      question: 'Why does this function return `undefined` for non-empty arrays?',
      options: [
        { id: 'a', text: 'Arrays are 1-indexed, so arr.length is out of bounds.', correct: false },
        { id: 'b', text: 'Arrays are 0-indexed; the last element is at arr.length - 1.', correct: true },
        { id: 'c', text: 'T must extend object to allow indexing.', correct: false },
        { id: 'd', text: 'TypeScript prevents accessing arrays using bracket notation.', correct: false }
      ],
      explanation: 'Arrays in JavaScript and TypeScript are zero-indexed. An array of length N has valid indices 0 through N-1. Accessing index `arr.length` returns `undefined`.'
    },
    {
      id: 2,
      language: 'JavaScript',
      title: 'Closure in Asynchronous Loop',
      code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Prints: 3, 3, 3`,
      question: 'How do you fix this so it prints 0, 1, 2?',
      options: [
        { id: 'a', text: 'Change `var i` to `let i` to create block-scoped bindings for each iteration.', correct: true },
        { id: 'b', text: 'Increase the timeout duration to 500ms.', correct: false },
        { id: 'c', text: 'Replace console.log with process.stdout.write.', correct: false },
        { id: 'd', text: 'Use a while loop instead of a for loop.', correct: false }
      ],
      explanation: 'Using `var` hoists the variable to function scope. When setTimeout fires, the loop has already completed and `i` is 3. Replacing `var` with `let` provides block scope per iteration.'
    },
    {
      id: 3,
      language: 'JavaScript',
      title: 'Accidental Mutation of State',
      code: `const updateScore = (player, points) => {\n  player.score += points;\n  return player;\n};`,
      question: 'Why is mutating `player` directly problematic in React/functional workflows?',
      options: [
        { id: 'a', text: 'It creates a memory leak in the V8 garbage collector.', correct: false },
        { id: 'b', text: 'React compares object references; in-place mutations may fail to trigger re-renders.', correct: true },
        { id: 'c', text: 'JavaScript objects are immutable by default.', correct: false },
        { id: 'd', text: 'Functions cannot return modified objects.', correct: false }
      ],
      explanation: 'In React, state updates must be immutable so reference checks (`prev !== next`) detect changes and re-render. You should return `{ ...player, score: player.score + points }`.'
    },
    {
      id: 4,
      language: 'Python',
      title: 'Mutable Default Argument',
      code: `def append_to(element, target_list=[]):\n    target_list.append(element)\n    return target_list`,
      question: 'What happens when `append_to(1)` is called twice?',
      options: [
        { id: 'a', text: 'It returns [1] both times because the default list is reset.', correct: false },
        { id: 'b', text: 'It raises a TypeError.', correct: false },
        { id: 'c', text: 'The second call returns [1, 1] because default lists are created once at definition time.', correct: true },
        { id: 'd', text: 'The list is garbage collected after the first return.', correct: false }
      ],
      explanation: 'In Python, default arguments are evaluated only once when the function is defined. A mutable default like `[]` retains state across multiple function calls. Use `target_list=None` instead.'
    }
  ];

  const [currentDebugIdx, setCurrentDebugIdx] = useState(0);
  const [debugSelected, setDebugSelected] = useState<string | null>(null);
  const [debugAnswered, setDebugAnswered] = useState(false);
  const [debugScore, setDebugScore] = useState(0);

  // ----------------------------------------------------
  // GAME 2: Logic Builder State & Data
  // ----------------------------------------------------
  const logicChallenges = [
    {
      id: 1,
      title: 'Boolean De Morgan Laws',
      problem: 'Which of the following expressions is logically equivalent to `!(A && B)` in programming logic?',
      options: [
        { id: 'a', text: '!A && !B', correct: false },
        { id: 'b', text: '!A || !B', correct: true },
        { id: 'c', text: 'A || B', correct: false },
        { id: 'd', text: '!A && B', correct: false }
      ],
      explanation: "De Morgan's First Law states that the negation of a conjunction (NOT (A AND B)) is logically equivalent to the disjunction of the negations (NOT A OR NOT B)."
    },
    {
      id: 2,
      title: 'Bitwise XOR Operations',
      problem: 'Given the bitwise expression `X ^ X ^ Y`, what is the evaluated result?',
      options: [
        { id: 'a', text: '0', correct: false },
        { id: 'b', text: 'X', correct: false },
        { id: 'c', text: 'Y', correct: true },
        { id: 'd', text: 'X + Y', correct: false }
      ],
      explanation: 'Bitwise XOR is commutative and self-inverse: `X ^ X = 0`, and `0 ^ Y = Y`. This property is commonly used to find the unique unpaired number in an array.'
    },
    {
      id: 3,
      title: 'Binary Search Step Count',
      problem: 'What is the maximum number of comparisons binary search needs to find an element in a sorted array of 1,024 elements?',
      options: [
        { id: 'a', text: '10', correct: true },
        { id: 'b', text: '32', correct: false },
        { id: 'c', text: '512', correct: false },
        { id: 'd', text: '1,024', correct: false }
      ],
      explanation: 'Binary search operates in O(log2 N) time. For N = 1,024, log2(1024) = 10 comparisons.'
    },
    {
      id: 4,
      title: 'Recursive Fibonacci Time Complexity',
      problem: 'What is the time complexity of the naive recursive Fibonacci implementation `fib(n) = fib(n-1) + fib(n-2)` without memoization?',
      options: [
        { id: 'a', text: 'O(N)', correct: false },
        { id: 'b', text: 'O(N log N)', correct: false },
        { id: 'c', text: 'O(2^N)', correct: true },
        { id: 'd', text: 'O(N^2)', correct: false }
      ],
      explanation: 'Each call spawns two sub-calls, forming a binary recursion tree of depth N, leading to an exponential O(2^N) operational complexity.'
    }
  ];

  const [currentLogicIdx, setCurrentLogicIdx] = useState(0);
  const [logicSelected, setLogicSelected] = useState<string | null>(null);
  const [logicAnswered, setLogicAnswered] = useState(false);
  const [logicScore, setLogicScore] = useState(0);

  // Auto-save dev notes
  useEffect(() => {
    localStorage.setItem('nexa_dev_notes', notes);
  }, [notes]);

  // Initial timestamp conversion
  useEffect(() => {
    handleConvertTimestamp(timestampInput);
  }, []);

  // ----------------------------------------------------
  // Utility Handlers
  // ----------------------------------------------------
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  const handleValidateJson = () => {
    try {
      JSON.parse(jsonInput);
      setJsonError('Valid JSON! Syntax structure is well-formed.');
    } catch (err: any) {
      setJsonError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleGenerateUuid = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      list.push(crypto.randomUUID());
    }
    setGeneratedUuids(list);
  };

  const handleEncodeBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(base64Input)));
      setBase64Output(encoded);
      setBase64Error(null);
    } catch (err: any) {
      setBase64Error(`Encoding error: ${err.message}`);
    }
  };

  const handleDecodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setBase64Output(decoded);
      setBase64Error(null);
    } catch (err: any) {
      setBase64Error(`Decoding error: Malformed Base64 string (${err.message})`);
    }
  };

  const handleEncodeUrl = () => {
    try {
      setUrlOutput(encodeURIComponent(urlInput));
    } catch (e: any) {
      setUrlOutput(`URL encode error: ${e.message}`);
    }
  };

  const handleDecodeUrl = () => {
    try {
      setUrlOutput(decodeURIComponent(urlInput));
    } catch (e: any) {
      setUrlOutput(`URL decode error: ${e.message}`);
    }
  };

  const handleConvertTimestamp = (val: string) => {
    setTimestampInput(val);
    const num = Number(val);
    if (isNaN(num)) return;

    // Detect if seconds or milliseconds
    const date = num > 1e11 ? new Date(num) : new Date(num * 1000);
    setTimestampResult({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      epochSec: Math.floor(date.getTime() / 1000),
      epochMs: date.getTime()
    });
  };

  const handleConvertDate = (val: string) => {
    setDateInput(val);
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      setTimestampResult({
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        epochSec: Math.floor(date.getTime() / 1000),
        epochMs: date.getTime()
      });
      setTimestampInput(Math.floor(date.getTime() / 1000).toString());
    }
  };

  const handleHexChange = (hex: string) => {
    setHexInput(hex);
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        setRgbInput({ r, g, b });
      }
    }
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    setRgbInput({ r, g, b });
    const toHex = (n: number) => {
      const clamped = Math.max(0, Math.min(255, n || 0));
      return clamped.toString(16).padStart(2, '0').toUpperCase();
    };
    setHexInput(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Game 1 Handlers
  const handleSelectDebugAnswer = (id: string) => {
    if (debugAnswered) return;
    setDebugSelected(id);
    setDebugAnswered(true);
    const curr = debugChallenges[currentDebugIdx];
    const isCorrect = curr.options.find((o) => o.id === id)?.correct;
    if (isCorrect) {
      setDebugScore((s) => s + 10);
    }
  };

  const handleNextDebug = () => {
    if (currentDebugIdx < debugChallenges.length - 1) {
      setCurrentDebugIdx((i) => i + 1);
      setDebugSelected(null);
      setDebugAnswered(false);
    }
  };

  const handleResetDebug = () => {
    setCurrentDebugIdx(0);
    setDebugSelected(null);
    setDebugAnswered(false);
    setDebugScore(0);
  };

  // Game 2 Handlers
  const handleSelectLogicAnswer = (id: string) => {
    if (logicAnswered) return;
    setLogicSelected(id);
    setLogicAnswered(true);
    const curr = logicChallenges[currentLogicIdx];
    const isCorrect = curr.options.find((o) => o.id === id)?.correct;
    if (isCorrect) {
      setLogicScore((s) => s + 10);
    }
  };

  const handleNextLogic = () => {
    if (currentLogicIdx < logicChallenges.length - 1) {
      setCurrentLogicIdx((i) => i + 1);
      setLogicSelected(null);
      setLogicAnswered(false);
    }
  };

  const handleResetLogic = () => {
    setCurrentLogicIdx(0);
    setLogicSelected(null);
    setLogicAnswered(false);
    setLogicScore(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Terminal className="w-3.5 h-3.5" />
            OFFICIAL DEVELOPER TOOLKIT
          </div>
          <h2 className="text-2xl font-black text-white">NEXA Developer Suite</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            7 working offline engineering utilities + 2 interactive programming games.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        <button
          onClick={() => setActiveTab('json')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'json'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          JSON Formatter
        </button>

        <button
          onClick={() => setActiveTab('uuid')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'uuid'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          UUID v4
        </button>

        <button
          onClick={() => setActiveTab('base64')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'base64'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          Base64
        </button>

        <button
          onClick={() => setActiveTab('url')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'url'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          URL Encode
        </button>

        <button
          onClick={() => setActiveTab('timestamp')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'timestamp'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Timestamp
        </button>

        <button
          onClick={() => setActiveTab('hexrgb')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'hexrgb'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          HEX / RGB
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          Dev Notes
        </button>

        <div className="h-6 w-px bg-slate-800 mx-1 shrink-0"></div>

        <button
          onClick={() => setActiveTab('game-debug')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'game-debug'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-500/30'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-purple-400" />
          Game: Debug Challenge
        </button>

        <button
          onClick={() => setActiveTab('game-logic')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'game-logic'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-amber-950/40 text-amber-300 hover:text-white border border-amber-500/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Game: Logic Builder
        </button>
      </div>

      {/* A. JSON Formatter / Validator */}
      {activeTab === 'json' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-cyan-400" />
              JSON Formatter, Minifier & Validator
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleFormatJson}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                Format (2-Space)
              </button>
              <button
                onClick={handleMinifyJson}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Minify (1-Line)
              </button>
              <button
                onClick={handleValidateJson}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Validate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Input JSON</label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:border-cyan-500 outline-none resize-y"
                placeholder="Paste JSON string here..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-400 uppercase">Formatted Result</label>
                {jsonOutput && (
                  <button
                    onClick={() => copyToClipboard(jsonOutput, setJsonCopied)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    {jsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {jsonCopied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={jsonOutput}
                rows={10}
                className="w-full p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 font-mono text-xs text-cyan-300 outline-none resize-y"
                placeholder="Result will appear here..."
              />
            </div>
          </div>

          {jsonError && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                jsonError.startsWith('Valid')
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}
            >
              {jsonError.startsWith('Valid') ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{jsonError}</span>
            </div>
          )}
        </div>
      )}

      {/* B. UUID Generator */}
      {activeTab === 'uuid' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              RFC 4122 Compliant UUID v4 Generator
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <span>Count:</span>
                <select
                  value={uuidCount}
                  onChange={(e) => setUuidCount(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 outline-none"
                >
                  <option value={1}>1 UUID</option>
                  <option value={5}>5 UUIDs</option>
                  <option value={10}>10 UUIDs</option>
                </select>
              </div>
              <button
                onClick={handleGenerateUuid}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Generate UUID v4
              </button>
            </div>
          </div>

          {generatedUuids.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Generated Values:</span>
                <button
                  onClick={() => copyToClipboard(generatedUuids.join('\n'), setUuidCopied)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono cursor-pointer"
                >
                  {uuidCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {uuidCopied ? 'Copied All' : 'Copy All'}
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 space-y-1.5">
                {generatedUuids.map((id, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <span>{id}</span>
                    <button
                      onClick={() => copyToClipboard(id, setUuidCopied)}
                      className="text-xs text-slate-500 group-hover:text-cyan-400 p-1 cursor-pointer"
                      title="Copy Single"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-xs text-slate-500">
              Click "Generate UUID v4" to produce secure pseudo-random unique identifiers.
            </div>
          )}
        </div>
      )}

      {/* C. Base64 Encoder / Decoder */}
      {activeTab === 'base64' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Binary className="w-5 h-5 text-cyan-400" />
              Base64 UTF-8 Encoder & Decoder
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEncodeBase64}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                Encode to Base64
              </button>
              <button
                onClick={handleDecodeBase64}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Decode from Base64
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Input String</label>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                rows={6}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:border-cyan-500 outline-none resize-y"
                placeholder="Enter plain text to encode or Base64 string to decode..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-400 uppercase">Output Result</label>
                {base64Output && (
                  <button
                    onClick={() => copyToClipboard(base64Output, setBase64Copied)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    {base64Copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {base64Copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={base64Output}
                rows={6}
                className="w-full p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 font-mono text-xs text-cyan-300 outline-none resize-y"
                placeholder="Result will appear here..."
              />
            </div>
          </div>

          {base64Error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{base64Error}</span>
            </div>
          )}
        </div>
      )}

      {/* D. URL Encoder / Decoder */}
      {activeTab === 'url' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-cyan-400" />
              URL String Encoder & Decoder (URI Component)
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEncodeUrl}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                URL Encode
              </button>
              <button
                onClick={handleDecodeUrl}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
              >
                URL Decode
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">Input String or URL</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-400 uppercase">Converted Result</label>
                {urlOutput && (
                  <button
                    onClick={() => copyToClipboard(urlOutput, setUrlCopied)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    {urlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {urlCopied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 break-all">
                {urlOutput || 'Click Encode or Decode to see result.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E. Timestamp Converter */}
      {activeTab === 'timestamp' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Unix Epoch Timestamp Converter
            </h3>
            <button
              onClick={() => handleConvertTimestamp(Math.floor(Date.now() / 1000).toString())}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono border border-slate-700"
            >
              Populate Current Time
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Timestamp → Human Date</h4>
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400">Unix Timestamp (seconds or ms):</label>
                <input
                  type="text"
                  value={timestampInput}
                  onChange={(e) => handleConvertTimestamp(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Date / Time Picker → Timestamp</h4>
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400">Pick Date & Time:</label>
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => handleConvertDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Local Time:</span>
              <span className="text-white font-semibold">{timestampResult.local || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">UTC Time (GMT):</span>
              <span className="text-cyan-300">{timestampResult.utc || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Epoch Seconds:</span>
              <span className="text-amber-300">{timestampResult.epochSec}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Epoch Milliseconds:</span>
              <span className="text-purple-300">{timestampResult.epochMs}</span>
            </div>
          </div>
        </div>
      )}

      {/* F. HEX / RGB Converter */}
      {activeTab === 'hexrgb' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              HEX & RGB Color Converter
            </h3>
            <button
              onClick={() => copyToClipboard(hexInput, setHexRgbCopied)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              {hexRgbCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {hexRgbCopied ? 'Copied' : 'Copy HEX'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Swatch */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div
                className="w-24 h-24 rounded-2xl shadow-xl border-2 border-white/20 transition-colors"
                style={{ backgroundColor: hexInput }}
              />
              <span className="font-mono font-bold text-sm text-white">{hexInput}</span>
              <span className="font-mono text-xs text-slate-400">rgb({rgbInput.r}, {rgbInput.g}, {rgbInput.b})</span>
            </div>

            {/* HEX Input */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">HEX Color</label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#06B6D4"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-white focus:border-cyan-500 outline-none"
              />
              <p className="text-[11px] text-slate-400">Supports 3 or 6 digit hex codes with or without #.</p>
            </div>

            {/* RGB Inputs */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">RGB Values (0 - 255)</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-rose-400 font-mono">Red</span>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgbInput.r}
                    onChange={(e) => handleRgbChange(Number(e.target.value), rgbInput.g, rgbInput.b)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono">Green</span>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgbInput.g}
                    onChange={(e) => handleRgbChange(rgbInput.r, Number(e.target.value), rgbInput.b)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-blue-400 font-mono">Blue</span>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgbInput.b}
                    onChange={(e) => handleRgbChange(rgbInput.r, rgbInput.g, Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* G. Developer Notes */}
      {activeTab === 'notes' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-cyan-400" />
                Developer Scratchpad & Notes
              </h3>
              <p className="text-xs text-slate-400">Auto-saved to local browser storage.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Clear local developer notes?')) {
                    setNotes('');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold border border-slate-700"
              >
                Clear Notes
              </button>
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={12}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:border-cyan-500 outline-none leading-relaxed resize-y"
            placeholder="Write quick snippets, endpoint notes, or schema definitions here..."
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Characters: {notes.length} | Lines: {notes.split('\n').length}</span>
            <span className="text-emerald-400">● Synced with localStorage</span>
          </div>
        </div>
      )}

      {/* GAME 1: Code Debug Challenge */}
      {activeTab === 'game-debug' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-300 mb-1">
                <Award className="w-3.5 h-3.5" />
                DEVELOPMENT GAME 1
              </div>
              <h3 className="text-xl font-bold text-white">Code Debug Challenge</h3>
              <p className="text-xs text-slate-400">Identify the defect in real source code snippets and select the correct architectural fix.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Score</span>
                <p className="text-xl font-bold text-purple-400 font-mono">{debugScore} pts</p>
              </div>
              <button
                onClick={handleResetDebug}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
                title="Reset Game"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question / Challenge Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Challenge {currentDebugIdx + 1} of {debugChallenges.length}</span>
              <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                {debugChallenges[currentDebugIdx].language}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              <pre className="whitespace-pre">{debugChallenges[currentDebugIdx].code}</pre>
            </div>

            <h4 className="text-sm font-bold text-white">
              {debugChallenges[currentDebugIdx].question}
            </h4>

            {/* Multiple Choices */}
            <div className="grid grid-cols-1 gap-2.5">
              {debugChallenges[currentDebugIdx].options.map((opt) => {
                const isSelected = debugSelected === opt.id;
                let btnStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';
                if (debugAnswered) {
                  if (opt.correct) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !opt.correct) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-900/50 border-slate-800/50 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectDebugAnswer(opt.id)}
                    disabled={debugAnswered}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-[11px] font-mono">
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {debugAnswered && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase font-mono">
                  <HelpCircle className="w-4 h-4" />
                  Explanation
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {debugChallenges[currentDebugIdx].explanation}
                </p>

                <div className="flex justify-end pt-2">
                  {currentDebugIdx < debugChallenges.length - 1 ? (
                    <button
                      onClick={handleNextDebug}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Next Challenge →
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-emerald-400 font-mono">All debug challenges complete!</span>
                      <button
                        onClick={handleResetDebug}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                      >
                        Play Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 2: Logic Builder */}
      {activeTab === 'game-logic' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                DEVELOPMENT GAME 2
              </div>
              <h3 className="text-xl font-bold text-white">Logic Builder</h3>
              <p className="text-xs text-slate-400">Test algorithmic reasoning, boolean logic, bitwise algebra, and computational complexity.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Score</span>
                <p className="text-xl font-bold text-amber-400 font-mono">{logicScore} pts</p>
              </div>
              <button
                onClick={handleResetLogic}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
                title="Reset Game"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Problem Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Problem {currentLogicIdx + 1} of {logicChallenges.length}</span>
              <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                {logicChallenges[currentLogicIdx].title}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white leading-relaxed">
              {logicChallenges[currentLogicIdx].problem}
            </div>

            {/* Multiple Choices */}
            <div className="grid grid-cols-1 gap-2.5">
              {logicChallenges[currentLogicIdx].options.map((opt) => {
                const isSelected = logicSelected === opt.id;
                let btnStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';
                if (logicAnswered) {
                  if (opt.correct) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !opt.correct) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-900/50 border-slate-800/50 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectLogicAnswer(opt.id)}
                    disabled={logicAnswered}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-[11px] font-mono">
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {logicAnswered && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase font-mono">
                  <HelpCircle className="w-4 h-4" />
                  Algorithmic Explanation
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {logicChallenges[currentLogicIdx].explanation}
                </p>

                <div className="flex justify-end pt-2">
                  {currentLogicIdx < logicChallenges.length - 1 ? (
                    <button
                      onClick={handleNextLogic}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Next Problem →
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-emerald-400 font-mono">All logic challenges solved!</span>
                      <button
                        onClick={handleResetLogic}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                      >
                        Play Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
