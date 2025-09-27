/** Footer with contact info provided by the user */
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div><h3 className="font-semibold text-white">HEAT Labs</h3><p className="text-sm mt-2">Empowering students through interactive learning experiences.</p></div>
        <div><h4 className="font-semibold">Contact</h4><p className="text-sm mt-2">Address: CBT Quarters, 700102, Kano State, Nigeria</p><p className="text-sm mt-1">GSM: (+234) 07061110002, (+234) 08103214013</p><p className="text-sm mt-1">Email: thetechtribe2025@gmail.com</p></div>
        <div><h4 className="font-semibold">Quick links</h4><ul className="text-sm mt-2 space-y-1"><li>About</li><li>Docs</li><li>Contact</li></ul></div>
      </div>
      <div className="text-center text-sm text-slate-600 mt-6">© HEAT Labs • The Tech Tribe</div>
    </footer>
  );
}
