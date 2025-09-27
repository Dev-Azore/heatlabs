/** LabCard component - displays a Lab summary and links to lab detail page */
import Link from 'next/link';
export default function LabCard({ lab }: any) {
  return (<Link href={`/dashboard/labs/${lab.slug}`}><a className="block p-4 rounded bg-slate-800 hover:shadow"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center"><span>🔬</span></div><div><h3 className="font-semibold">{lab.title}</h3><p className="text-slate-400 text-sm mt-1">{lab.description}</p></div></div></a></Link>);
}
