import fs from "fs/promises";
import path from "path";

export const metadata = {
  title: "AI - References",
  description: "References",
};

export default async function ReferencesPage() {
  const filePath = process.env.NEXT_PUBLIC_REFERENCE_FILE;

  if (!filePath) {
    throw new Error("NEXT_PUBLIC_REFERENCE_FILE is not defined");
  }

  const content = await fs.readFile(path.normalize(filePath), "utf-8");

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">References</h1>
      <pre className="whitespace-pre-wrap">{content}</pre>
    </main>
  );
}
