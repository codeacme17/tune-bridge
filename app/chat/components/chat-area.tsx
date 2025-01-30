import { useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { SendIcon, LinkIcon, LoaderCircleIcon } from "lucide-react";

export const ChatArea = () => {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage, loading } = useChat();

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setInputValue("");
    await sendMessage(inputValue);
  };

  return (
    <section className="h-48 relative">
      <div className="mb-4 w-full max-w-3xl rounded-lg bg-slate-200 dark:bg-slate-900">
        <div className="rounded-lg rounded-b-none border border-slate-300 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-800">
          <label htmlFor="prompt-input" className="sr-only">
            Enter your prompt
          </label>
          <textarea
            id="prompt-input"
            rows={4}
            className="w-full border-0 bg-slate-50 px-0 text-base text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
            placeholder="Enter your prompt"
            required
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between px-2 py-2">
          <button
            type="button"
            className="inline-flex cursor-pointer justify-center rounded-lg items-center p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-50"
          >
            <span className="sr-only">Attach file</span>
            <LinkIcon className="w-5" />
            <span className="px-2 text-sm">Attach a file</span>
          </button>
          <button
            type="submit"
            className="mr-1 inline-flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-slate-50 hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 sm:text-base"
            disabled={loading}
            onClick={handleSend}
          >
            Generate
            {loading ? (
              <LoaderCircleIcon className="w-5 animate-spin" />
            ) : (
              <SendIcon className="w-5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
