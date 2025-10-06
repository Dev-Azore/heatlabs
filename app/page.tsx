/**
 * Professional Interactive Landing Page (Server Component)
 * ------------------------------------------------------
 * - Modern, professional design with improved interactivity
 * - Updated color scheme and layout
 * - Enhanced learning paths and features sections
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
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-screen">
      {/* ---------------- PROFESSIONAL HERO SECTION ---------------- */}
      <section className="relative py-28 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Animated main heading */}
          <AnimatedHeading className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Master Practical Skills in{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              HEAT Sectors
            </span>
          </AnimatedHeading>

          {/* Animated tagline */}
          <AnimatedParagraph delay={0.2}>
            Advanced hands-on training through real-world simulations in <span className="text-blue-400">Health</span>,{" "}
            <span className="text-green-400">Education</span>, <span className="text-amber-400">Agriculture</span>, and{" "}
            <span className="text-purple-400">Technology</span>.
          </AnimatedParagraph>

          {/* Animated CTA Section */}
          <AnimatedBlock delay={0.4} className="mb-12">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/auth/signup"
                className="px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 border border-blue-400/20"
              >
                Join for Free
              </Link>
              <Link
                href="/auth/login"
                className="px-12 py-4 rounded-xl bg-slate-800/50 font-bold text-lg hover:bg-slate-700/50 transition-all transform hover:scale-105 border border-slate-600 hover:border-slate-500 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </AnimatedBlock>
        </div>
      </section>

      {/* ---------------- ENHANCED LEARNING PATHS ---------------- */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <AnimatedHeading as="h2" className="text-4xl font-bold text-center mb-16">
            Premier Learning Paths
          </AnimatedHeading>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Healthcare Fundamentals",
                description: "Master patient care, medical procedures, and healthcare systems",
                modules: 12,
                level: "Beginner",
                color: "blue",
                icon: "🩺"
              },
              {
                title: "Modern Education Tech",
                description: "Digital teaching tools, LMS platforms, and educational technology",
                modules: 10,
                level: "Intermediate", 
                color: "green",
                icon: "📚"
              },
              {
                title: "Smart Agriculture Systems",
                description: "IoT farming, sustainable practices, and agricultural technology",
                modules: 14,
                level: "Advanced",
                color: "amber",
                icon: "🌾"
              },
              {
                title: "Technology Innovation",
                description: "Software development, AI integration, and tech infrastructure",
                modules: 16,
                level: "Intermediate",
                color: "purple",
                icon: "💻"
              }
            ].map((path, i) => (
              <AnimatedBlock key={i} delay={i * 0.15}>
                <div className={`group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 h-full border border-slate-700 hover:border-${path.color}-500/50 transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-${path.color}-500/10`}>
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {path.icon}
                  </div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-4">{path.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{path.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`bg-${path.color}-500/20 text-${path.color}-300 px-4 py-2 rounded-full text-sm font-semibold`}>
                      {path.modules} Modules
                    </span>
                    <span className="bg-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-semibold">
                      {path.level}
                    </span>
                  </div>
                </div>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROFESSIONAL FEATURES SECTION ---------------- */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <AnimatedHeading as="h2" className="text-4xl font-bold text-center mb-16">
            Why Professionals Choose HEAT Labs
          </AnimatedHeading>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Industry-Standard Simulations",
                description: "Practice with real-world scenarios and professional tools used in HEAT sectors",
                icon: "🎯",
                color: "blue"
              },
              {
                title: "Expert-Led Curriculum", 
                description: "Learn from industry professionals and sector experts with years of experience",
                icon: "👨‍🏫",
                color: "purple"
              },
              {
                title: "Career-Focused Learning",
                description: "Build job-ready skills with projects that showcase your expertise to employers",
                icon: "💼",
                color: "green"
              },
              {
                title: "Flexible Learning Paths",
                description: "Customize your learning journey with modular courses and self-paced progression",
                icon: "🔄",
                color: "amber"
              }
            ].map((feature, i) => (
              <AnimatedBlock key={i} delay={i * 0.1}>
                <div className="group bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-500 hover:transform hover:-translate-y-2 backdrop-blur-sm">
                  <div className={`text-3xl mb-6 p-4 bg-${feature.color}-500/10 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LABS PREVIEW ---------------- */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          <AnimatedHeading as="h2" className="text-4xl font-bold text-center mb-16">
            Featured Interactive Labs
          </AnimatedHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {heatLabs.map((lab: any, i: number) => (
              <AnimatedBlock key={lab.id} delay={i * 0.1}>
                <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:-translate-y-3 backdrop-blur-sm">
                  <LabCard lab={lab} locked />
                </div>
              </AnimatedBlock>
            ))}
          </div>

          <AnimatedBlock delay={0.4} className="text-center mt-16">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800/50 text-white rounded-xl font-bold hover:bg-slate-700/50 transition-all duration-300 border border-slate-600 hover:border-blue-500/50 backdrop-blur-sm group"
            >
              Explore All Labs
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </AnimatedBlock>
        </div>
      </section>

      {/* ---------------- FINAL CTA SECTION ---------------- */}
      <section className="py-24 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-slate-900">
        <div className="container mx-auto px-6 text-center">
          <AnimatedBlock>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Ready to Advance Your Career?
              </h2>
              <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                Join thousands of professionals and students mastering practical skills with HEAT Labs' industry-leading simulations.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/auth/signup"
                  className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl border border-blue-400/20"
                >
                  Start Learning Free
                </Link>
                <Link
                  href="/auth/login"
                  className="px-12 py-4 bg-slate-800/50 text-white rounded-xl font-bold hover:bg-slate-700/50 transition-all transform hover:scale-105 border border-slate-600 hover:border-slate-500 backdrop-blur-sm"
                >
                  Sign In to Continue
                </Link>
              </div>
            </div>
          </AnimatedBlock>
        </div>
      </section>

      {/* ---------------- ENHANCED STATS SECTION ---------------- */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "4", label: "Core Sectors", color: "blue" },
              { value: "50+", label: "Expert Modules", color: "purple" },
              { value: "10K+", label: "Professionals", color: "green" },
              { value: "24/7", label: "Global Access", color: "amber" }
            ].map((stat, i) => (
              <AnimatedBlock key={i} delay={i * 0.1}>
                <div className="p-6">
                  <div className={`text-4xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent mb-3`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-lg font-medium">{stat.label}</div>
                </div>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}