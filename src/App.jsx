import { Languages, Copy, ArrowUpAZ, LoaderCircle } from "lucide-react";
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
    setLoading(true);

    if (!form.lang || form.lang === "Chose Language") {
      toast.error("Please select a language!");
      return;
    }

    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: ` ${form.lang}- ${form.text}`,
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
    const input = e.target;
    const name = input.name;
    const value = input.value;
    setForm({
      ...form,
      [name]: value,
    });
  };
  return (
    <div className="bg-slate-900 min-h-screen py-16">
      <div className="w-10/12 grid grid-cols-2 gap-12 mx-auto">
        <div className="p-8 bg-slate-800 border border-slate-700 border-2 rounded-xl">
          <h1 className="text-4xl font-bold text-amber-500 mb-6">Translator</h1>
          <form className="space-y-6" onSubmit={translateNow}>
            <textarea
              name="text"
              placeholder="Enter your write here"
              value={form.text}
              onChange={handleChange}
              required
              className="p-3 text-white bg-slate-900 w-full rounded-xl focus:outline-none focus:border focus:border-amber-700 placeholder-amber-100"
            ></textarea>
            <select
              name="lang"
              onChange={handleChange}
              className="p-3 text-white bg-slate-900 w-full rounded-xl focus:outline-none focus:border focus:border-amber-700 placeholder-amber-100"
            >
              <option value="Chose Language">Chose language</option>
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
              <option value="spenish">Spenish</option>
              <option value="bhojpuri">Bhojpuri</option>
              <option value="sanskrit">Sanskrit</option>
            </select>
            {loading ? (
              <button
                disabled
                className="bg-gray-300 rounded-lg text-white py-3 px-3 flex items-center gap-1 font-medium focus:scale-90 duration-100"
              >
                <LoaderCircle className="animate-spin" />
                Loading...
              </button>
            ) : (
              <button className="bg-amber-500 rounded-lg text-white py-3 px-3 flex items-center gap-1 font-medium focus:scale-90 duration-100">
                <Languages />
                Translate
              </button>
            )}
          </form>
        </div>
        <div className="relative p-8 bg-slate-800 border border-slate-700 border-2 rounded-xl">
          <p className="mt-5 text-white/80">{result}</p>
          <Copy
            className="absolute top-5 right-5 text-amber-500 cursor-pointer hover:scale-110 duration-300"
            onClick={copy}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
