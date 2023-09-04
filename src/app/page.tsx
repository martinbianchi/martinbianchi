import { RubikCube } from "@/components/RubikCube/RubikCube";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h2>Software Engineer</h2>
        <h1>Martin Bianchi</h1>
        <h3>React, Next.js, NodeJs</h3>
      </div>
      <RubikCube />
    </main>
  );
}
