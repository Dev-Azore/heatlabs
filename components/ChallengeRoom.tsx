/** ChallengeRoom layout component - left: instructions, right: interactive module area */
export default function ChallengeRoom({ moduleData, children }: any) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <aside className="md:col-span-1 p-4 bg-slate-800 rounded">
        <h2 className="text-xl font-semibold">{moduleData.title}</h2>
        <p className="text-slate-400 mt-2">{moduleData.content}</p>
        <div className="mt-6"><h3 className="font-semibold">Hints</h3><p className="text-slate-400 text-sm">Hints are included in content for MVP.</p></div>
      </aside>
      <section className="md:col-span-2">
        <div className="p-4 bg-slate-900 rounded min-h-[360px]">{children}</div>
      </section>
    </div>
  );
}
