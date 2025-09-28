/**
 * Landing Page (Server Component)
 * --------------------------------
 * - Fetches latest labs from Supabase (server-side).
 * - Displays hero, features, labs preview, education, business, and stats sections.
 * - Animations are handled by client components (AnimatedHeading, AnimatedParagraph, AnimatedBlock).
 * - Navbar & Footer come from layout.tsx, not duplicated here.
 */

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import LabCard from "@/components/LabCard";

// ✅ Import client-only animation wrappers
import AnimatedHeading from "@/components/AnimatedHeading";
import AnimatedParagraph from "@/components/AnimatedParagraph";
import AnimatedBlock from "@/components/AnimatedBlock";

export default async function Home() {
  // ✅ Fetch latest 4 labs from Supabase
  const { data: labs } = await supabase
    .from("labs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  // ✅ Map labs with sector icons
  const heatLabs =
    labs?.map((lab: any) => ({
      ...lab,
      icon:
        lab.title.includes("Health")
          ? "🩺"
          : lab.title.includes("Education")
          ? "📚"
          : lab.title.includes("Agriculture")
          ? "🌾"
          : "💻",
    })) || [];

  return (
    <div className="bg-slate-900 text-slate-100">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="container mx-auto px-6 text-center">
          {/* Animated main heading */}
          <AnimatedHeading>
            Anyone Can Learn Practical Skills with HEAT Labs
          </AnimatedHeading>

          {/* Animated tagline */}
          <AnimatedParagraph delay={0.2}>
            Hands-on training through real-world scenarios in Health, Education,
            Agriculture, and Technology.
          </AnimatedParagraph>

          {/* Animated CTA row */}
          <AnimatedBlock delay={0.4}>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              {/* Dummy email input (visual only) */}
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-3 rounded-md bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {/* CTA → Signup */}
              <Link
                href="/auth/signup"
                className="px-5 py-3 rounded-md bg-amber-500 font-semibold hover:bg-amber-600 transition"
              >
                Join for FREE
              </Link>
            </div>
          </AnimatedBlock>

          {/* Animated "Beginner Friendly" label */}
          <AnimatedParagraph delay={0.6} small>
            Beginner Friendly
          </AnimatedParagraph>
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section id="learn" className="py-20 bg-slate-800">
        <div className="container mx-auto px-6">
          <AnimatedHeading as="h2">
            Learn and Practice Through Interactive Labs
          </AnimatedHeading>

          <div className="grid md:grid-cols-2 gap-8 text-center">
            {[
              ["Learn by Doing", "Hands-on labs to build real-world skills."],
              ["Guided Learning", "Step-by-step help for all skill levels."],
              ["Real-World Training", "Simulate systems in HEAT sectors."],
              ["Engaging Lessons", "Fun, interactive experiences for all."],
            ].map(([title, desc], i) => (
              <AnimatedBlock key={i} delay={i * 0.1}>
                <div className="p-6 bg-slate-700 rounded-lg">
                  <h3 className="font-bold mb-2">{title}</h3>
                  <p className="text-slate-400">{desc}</p>
                </div>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LABS PREVIEW ---------------- */}
      <section id="labs" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <AnimatedHeading as="h2">
            Hands-on Labs for All Skill Levels
          </AnimatedHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heatLabs.map((lab: any, i: number) => (
              <AnimatedBlock key={lab.id} delay={i * 0.1}>
                <LabCard lab={lab} locked />
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- EDUCATION SECTION ---------------- */}
      <section id="for-education" className="py-20 bg-slate-800 text-center">
        <div className="container mx-auto px-6">
          <AnimatedHeading as="h2">
            Practical Training for Your Students
          </AnimatedHeading>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Assign interactive labs to students. Manage progress via the admin
            dashboard.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ---------------- BUSINESS SECTION ---------------- */}
      <section id="for-business" className="py-20 bg-slate-900 text-center">
        <div className="container mx-auto px-6">
          <AnimatedHeading as="h2">
            Practical Training for Your Team
          </AnimatedHeading>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Empower your workforce with HEAT Labs’ offline solutions.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ---------------- STATS SECTION ---------------- */}
      <section className="py-12 bg-slate-800">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            ["4", "Sectors"],
            ["1000+", "Students"],
            ["Offline", "Access"],
          ].map(([value, label], i) => (
            <AnimatedBlock key={i} delay={i * 0.1}>
              <div className="p-4">
                <h3 className="text-3xl font-bold text-amber-500">{value}</h3>
                <p className="text-slate-400">{label}</p>
              </div>
            </AnimatedBlock>
          ))}
        </div>
      </section>
    </div>
  );
}
