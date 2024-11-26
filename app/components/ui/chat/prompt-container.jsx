import Image from 'next/image';

const PromptContainer = () => {
    return (
        <div className="flex h-[97vh] w-full flex-col">
            {/* Prompt Messages */}
            <div
                className="flex-1 overflow-y-auto bg-slate-300 text-sm leading-6 text-slate-900 shadow-md dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7"
            >
                <div className="flex flex-row px-4 py-8 sm:px-6">
                    <Image
                        className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
                        src="/favicon.ico"
                        alt="User Avatar"
                        width={32}
                        height={32}
                    />
                    <div className="flex max-w-3xl items-center">
                        <p>Explain quantum computing in simple terms</p>
                    </div>
                </div>
                {/* Additional content here */}
            </div>
            {/* Prompt message input */}
            <form
                className="flex w-full items-center rounded-b-md border-t border-slate-300 bg-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
            >
                <label htmlFor="chat" className="sr-only">Enter your prompt</label>
                <textarea
                    id="chat-input"
                    rows="1"
                    className="mx-2 flex min-h-full w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-400 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                    placeholder="Enter your prompt"
                ></textarea>
                <button
                    className="inline-flex hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-600 sm:p-2"
                    type="submit"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default PromptContainer;
