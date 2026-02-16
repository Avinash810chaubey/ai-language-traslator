import { Languages, Copy, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const App = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_KEY;

  const [form, setForm] = useState({
    text: "",
    lang: "",
  });

  const [result, setResult] = useState("");

  const translateNow = async (e) => {
    e.preventDefault();

    if (!form.lang || form.lang === "Chose Language") {
      toast.error("Please select a language!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: ` ${form.lang}: ${form.text}`,
              },
            ],
          },
        ],
      };

      const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_URL}`,
        payload
      );

      const answer = data.candidates[0].content.parts[0].text;
      setResult(answer);
    } catch (error) {
      console.log(error);
      toast.error("Error in translation!");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = result;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    toast.success("Copied!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen py-8 sm:py-12 lg:py-16 px-4">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        
        {/* Left Card */}
        <div className="p-5 sm:p-6 lg:p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-lg">
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-500 mb-6">
            Translator
          </h1>

          <form className="space-y-5" onSubmit={translateNow}>
            
            <textarea
              name="text"
              placeholder="Enter your text here..."
              value={form.text}
              onChange={handleChange}
              required
              className="p-3 text-white bg-slate-900 w-full rounded-xl min-h-[140px] sm:min-h-[180px] focus:outline-none focus:border focus:border-amber-700 placeholder-amber-100"
            />

            <select
              name="lang"
              onChange={handleChange}
              className="p-3 text-white bg-slate-900 w-full rounded-xl focus:outline-none focus:border focus:border-amber-700"
            >
              <option value="">Choose language</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Bhojpuri">Bhojpuri</option>
              <option value="Sanskrit">Sanskrit</option>
            </select>

            {loading ? (
              <button
                disabled
                className="w-full bg-gray-400 rounded-lg text-white py-3 flex items-center justify-center gap-2 font-medium"
              >
                <LoaderCircle className="animate-spin" size={18} />
                Translating...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 rounded-lg text-white py-3 flex items-center justify-center gap-2 font-medium transition duration-200"
              >
                <Languages size={18} />
                Translate
              </button>
            )}
          </form>
        </div>

        {/* Right Card */}
        <div className="relative p-5 sm:p-6 lg:p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-lg min-h-[200px]">
          
          <p className="text-white/80 whitespace-pre-wrap break-words">
            {result || "Your translation will appear here..."}
          </p>

          {result && (
            <Copy
              className="absolute top-4 right-4 text-amber-500 cursor-pointer hover:scale-110 transition"
              onClick={copy}
            />
          )}
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default App;
