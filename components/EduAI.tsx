import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, X, Loader2, AlertCircle, Download, Table as TableIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EduAIProps {
  contextData: string;
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  role?: string;
  language?: 'en' | 'es';
}

const uiContent = {
  en: {
    headerTitle: "EDU AI",
    thinking: "EDU AI is thinking...",
    placeholder: "Ask about progress, goals...",
    poweredBy: "Powered by Gemini Enterprise",
    error: "Failed to generate response. Check console for details.",
    exportCSV: "Export CSV",
    exportData: "Export Data",
    dataTable: "Data Table",
    greetings: {
      default: "Hello! I'm EDU AI, your virtual assistant. I have access to the current student data. How can I help you today?",
      Teacher: "Hello! I'm EDU AI, your instructional virtual assistant. I have access to your classroom data. How can I help you differentiate instruction or analyze trends today?",
      Principal: "Hello! I'm EDU AI, your campus virtual assistant. I have access to Capital City High School's performance metrics. Ready to analyze cohort growth or identify instructional support needs?",
      "District Administrator": "Hello! I'm EDU AI, your district virtual assistant. I have access to district-wide enrollment, finance, and assessment data. How can I assist with strategic planning or compliance?",
      Parent: "Hello! I'm EDU AI, your family virtual assistant. I'm here to help you understand your child's progress, goals, and report cards. What questions do you have?",
      "Board Member": "Hello! I'm EDU AI, your governance support assistant. I have access to district-wide strategic goals, longitudinal trends, and equity data. How can I help you prepare for the next meeting or analyze gap closure?"
    }
  },
  es: {
    headerTitle: "Asistente EDU AI",
    thinking: "EDU AI está pensando...",
    placeholder: "Pregunte sobre el progreso, metas...",
    poweredBy: "Desarrollado por Gemini Enterprise",
    error: "Error al generar respuesta. Revise la consola.",
    exportCSV: "Exportar CSV",
    exportData: "Exportar Datos",
    dataTable: "Tabla de Datos",
    greetings: {
      default: "¡Hola! Soy EDU AI, su asistente virtual. Tengo acceso a los datos actuales del estudiante. ¿Cómo puedo ayudarle hoy?",
      Teacher: "¡Hola! Soy EDU AI, su asistente virtual de instrucción. ¿Cómo puedo ayudarle hoy?",
      Principal: "¡Hola! Soy EDU AI, su asistente virtual del campus. ¿Cómo puedo ayudarle hoy?",
      "District Administrator": "¡Hola! Soy EDU AI, su asistente virtual del distrito. ¿Cómo puedo ayudarle hoy?",
      Parent: "¡Hola! Soy EDU AI, su asistente virtual familiar. Estoy aquí para ayudarle a entender el progreso, las metas y las boletas de calificaciones de su hijo. ¿Qué preguntas tiene?",
      "Board Member": "¡Hola! Soy EDU AI, su asistente de gobernanza. ¿Cómo puedo ayudarle hoy?"
    }
  }
};

const EduAI: React.FC<EduAIProps> = ({ contextData, isOpen, onClose, initialPrompt, role, language = 'en' }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to track if component has mounted to prevent initial transition flash
  const [isMounted, setIsMounted] = useState(false);

  const t = uiContent[language] || uiContent.en;

  useEffect(() => {
    // Enable transitions shortly after mount
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Generate Persona-Aware Greeting (Dynamic based on language)
  useEffect(() => {
    // Only update if it's the initial state (empty or just 1 previous greeting) to avoid overwriting conversation flow
    if (messages.length <= 1) {
      const greetingKey = (role && role in t.greetings) ? role as keyof typeof t.greetings : 'default';
      setMessages([{ role: 'model', text: t.greetings[greetingKey] }]);
    }
  }, [role, language]);

  // Handle initial prompt trigger for demos
  useEffect(() => {
    if (isOpen && initialPrompt) {
      const timer = setTimeout(() => {
        handleSend(initialPrompt);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialPrompt]);

  // Retry logic for API calls
  const generateContentWithRetry = async (ai: GoogleGenAI, model: string, contents: any[], retries = 3, delay = 1000): Promise<any> => {
    try {
      return await ai.models.generateContent({ model, contents });
    } catch (err: any) {
      if (retries > 0 && err.status === 429) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateContentWithRetry(ai, model, contents, retries - 1, delay * 2);
      }
      throw err;
    }
  };

  const handleSend = async (msgOverride?: string) => {
    const textToSend = msgOverride || input;
    if (!textToSend.trim()) return;

    let apiKey: string | undefined;
    try {
      // @ts-ignore - Replacements handled by vite.config.ts define
      apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    } catch (e) {
      console.warn("Could not access API key variables");
    }

    if (!apiKey) {
      setError(`API Key is missing. Please ensure GEMINI_API_KEY is allowed in your browser permissions or configured in deployment.`);
      return;
    }

    if (!msgOverride) setInput('');

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are EDU AI, an AI assistant for Lone Star Unified School District. 
      Your persona is a helpful virtual assistant for a ${role || 'user'}.
      You have access to real-time data.
      Language Requirement: Respond in ${language === 'es' ? 'Spanish' : 'English'}.
      
      Context Data: ${contextData}
      
      Chart Generation Rules:
      If the user asks for a visualization (chart, graph, trend), you MUST:
      1. Return a JSON object in a code block labeled \`json\`.
      2. The JSON must have this structure: { "type": "bar" | "line" | "pie", "data": [{ "name": "Label", "value": 10, "fill": "#hex" }], "title": "Chart Title", "xAxis": "label", "yAxis": "value" }.
      3. For comparison line charts, the data objects should contain multiple keys (e.g. { "name": "2024", "STAAR": 70, "NWEA": 75 }).
      4. Provide a brief textual summary AFTER the JSON block in ${language === 'es' ? 'Spanish' : 'English'}.
      5. Use brand colors: Primary: #BF5700, Secondary: #333F48.
      
      Formatting Rules:
      1. For tables, use Markdown.
      2. Use **bold** for emphasis.
      3. Keep text responses professional and concise.`;

      const response = await generateContentWithRetry(ai, 'gemini-2.0-flash', [
        { role: 'user', parts: [{ text: systemInstruction + "\n\nUser Query: " + textToSend }] }
      ]);

      const text = response.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'model', text }]);
      }
    } catch (err: any) {
      console.error(err);
      if (err.status === 429) {
        setError("I'm receiving too many requests right now. Please wait a moment and try again.");
      } else {
        setError(t.error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to download table data
  const downloadTableAsCSV = (tableData: string[][]) => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + tableData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "edu_ai_groups.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadChartData = (data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...data.map(row => headers.map(h => row[h]).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart Renderer
  // Ensure chart is only rendered when visible to avoid resizing errors
  const renderChart = (jsonString: string) => {
    try {
      const chartConfig = JSON.parse(jsonString);
      const { type, data, title, xAxis, yAxis } = chartConfig;

      // Only render charts if the sidebar is properly mounted
      if (!isMounted) return null;

      return (
        <div className="my-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-w-0 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-700 text-sm">{title}</h4>
            <button onClick={() => downloadChartData(data)} className="text-vt-blue text-xs flex items-center gap-1 hover:underline">
              <Download size={12} /> {t.exportData}
            </button>
          </div>
          <div className="h-48 w-full min-w-0" style={{ minWidth: 200, minHeight: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              {type === 'bar' ? (
                <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px' }} cursor={{ fill: '#f9fafb' }} />
                  <Bar dataKey="value" fill="#BF5700" radius={[4, 4, 0, 0]}>
                    {data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || '#BF5700'} />
                    ))}
                  </Bar>
                </BarChart>
              ) : type === 'pie' ? (
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#BF5700" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || '#BF5700'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  {/* Dynamically render lines based on data keys that are not 'name' or 'fill' */}
                  {data.length > 0 && Object.keys(data[0]).filter(k => k !== 'name' && k !== 'fill').length > 0 ? (
                    Object.keys(data[0]).filter(k => k !== 'name' && k !== 'fill').map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={['#BF5700', '#333F48', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    ))
                  ) : (
                    <Line type="monotone" dataKey="value" stroke="#BF5700" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      );
    } catch (e) {
      return <div className="text-xs text-red-500 bg-red-50 p-2 rounded">Error rendering chart.</div>;
    }
  };

  // Simple Markdown Parser for Tables, Lists, and Bold
  const renderMessageText = (text: string) => {
    // Extract JSON blocks for Charts
    const jsonBlockRegex = /```json\n([\s\S]*?)\n```/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = jsonBlockRegex.exec(text)) !== null) {
      // Text before JSON
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      // JSON Chart
      parts.push({ type: 'chart', content: match[1] });
      lastIndex = jsonBlockRegex.lastIndex;
    }
    // Remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return parts.map((part, partIdx) => {
      if (part.type === 'chart') {
        return <React.Fragment key={partIdx}>{renderChart(part.content)}</React.Fragment>;
      }

      const lines = part.content.split('\n');
      const elements: React.ReactNode[] = [];

      let inTable = false;
      let tableRows: string[][] = [];

      lines.forEach((line, index) => {
        // Detect Table Row
        if (line.trim().startsWith('|')) {
          if (!inTable) inTable = true;
          // Clean row
          const row = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
          // Skip separator lines (e.g. |---|---|)
          if (!row[0].match(/^-+$/)) {
            tableRows.push(row);
          }
        } else {
          // If we were in a table and now aren't, render the table
          if (inTable) {
            inTable = false;
            elements.push(
              <div key={`table-${index}`} className="my-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><TableIcon size={12} /> {t.dataTable}</span>
                  <button
                    onClick={() => downloadTableAsCSV(tableRows)}
                    className="text-xs text-vt-blue flex items-center gap-1 hover:underline font-medium"
                  >
                    <Download size={12} /> {t.exportCSV}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        {tableRows[0].map((header, i) => <th key={i} className="px-4 py-2 border-b font-bold">{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.slice(1).map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                          {row.map((cell, j) => <td key={j} className="px-4 py-2">{cell.replace(/\*\*/g, '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
            tableRows = [];
          }

          // Render Regular Text (with Bold and List support)
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            elements.push(
              <div key={index} className="ml-4 flex items-start gap-2 my-1 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-*]\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
              </div>
            );
          } else if (line.trim() !== '') {
            elements.push(
              <p key={index} className="mb-2 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
            );
          }
        }
      });

      // Edge case: Table at end of message
      if (inTable && tableRows.length > 0) {
        elements.push(
          <div key={`table-end-${partIdx}`} className="my-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><TableIcon size={12} /> {t.dataTable}</span>
              <button
                onClick={() => downloadTableAsCSV(tableRows)}
                className="text-xs text-vt-blue flex items-center gap-1 hover:underline font-medium"
              >
                <Download size={12} /> {t.exportCSV}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    {tableRows[0].map((header, i) => <th key={i} className="px-4 py-2 border-b font-bold">{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.slice(1).map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      {row.map((cell, j) => <td key={j} className="px-4 py-2">{cell.replace(/\*\*/g, '')}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      return <React.Fragment key={partIdx}>{elements}</React.Fragment>;
    });
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[60] flex flex-col border-l border-gray-200 transform ${isMounted ? 'transition-transform duration-300' : ''} ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
    >
      {/* Header */}
      <div className="bg-vt-blue p-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <Sparkles size={20} className="text-white" />
          <h2 className="font-semibold">{t.headerTitle}</h2>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-2xl shadow-sm ${msg.role === 'user'
                ? 'bg-vt-blue text-white rounded-br-none text-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
            >
              {msg.role === 'model' ? renderMessageText(msg.text) : msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center space-x-2">
              <Loader2 size={16} className="animate-spin text-vt-blue" />
              <span className="text-xs text-gray-500">{t.thinking}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2 bg-vt-grey rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-vt-blue transition border border-vt-borderGrey">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent outline-none text-sm text-vt-textGrey"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className={`p-1.5 rounded-full transition ${input ? 'bg-vt-blue text-white hover:bg-vt-darkBlue' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-400">{t.poweredBy}</span>
        </div>
      </div>
    </div>
  );
};

export default EduAI;