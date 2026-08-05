import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Star,
  Briefcase,
  CheckCircle,
  GraduationCap,
  Filter,
} from "lucide-react";
import { YEARBOOK_DATA, type Subject, type Grade } from "@/data/subjects";

const DIFFICULTY_CONFIG = {
  foundational: { label: "Foundational", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  moderate: { label: "Moderate", color: "bg-blue-100 text-blue-700 border-blue-200" },
  challenging: { label: "Challenging", color: "bg-orange-100 text-orange-700 border-orange-200" },
};

const CATEGORY_CONFIG = {
  compulsory: { label: "Compulsory", color: "bg-slate-100 text-slate-600 border-slate-200" },
  language: { label: "Language", color: "bg-purple-100 text-purple-700 border-purple-200" },
  elective: { label: "Elective", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
};

function SubjectCard({ subject, expanded, onToggle }: { subject: Subject; expanded: boolean; onToggle: () => void }) {
  const diffCfg = DIFFICULTY_CONFIG[subject.difficulty];
  const catCfg = CATEGORY_CONFIG[subject.category];

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      style={{ borderColor: expanded ? "#D4AF37" : "#e5e7eb" }}
      onClick={onToggle}
    >
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #002147 0%, #003a7a 100%)" }}
          >
            <span>{subject.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-mono text-gray-400 mb-0.5">{subject.code}</p>
                <h3 className="font-bold text-gray-900 leading-snug">{subject.name}</h3>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catCfg.color}`}>
                  {catCfg.label}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${diffCfg.color}`}>
                  {diffCfg.label}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">{subject.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1 flex-wrap">
            {subject.careers.slice(0, 3).map((c) => (
              <span key={c} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                {c}
              </span>
            ))}
            {subject.careers.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                +{subject.careers.length - 3} more
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ borderTop: "1px solid #D4AF3720" }}
          >
            <div className="px-5 pb-5 pt-4 grid md:grid-cols-3 gap-6">
              {/* Prerequisites */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <CheckCircle className="w-4 h-4 text-[#002147]" />
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Prerequisites</h4>
                </div>
                {subject.prerequisites.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No prerequisites — open to all learners</p>
                ) : (
                  <ul className="space-y-1.5">
                    {subject.prerequisites.map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-sm text-gray-700">
                        <ChevronRight className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Topics */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <BookOpen className="w-4 h-4 text-[#002147]" />
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Topics Covered</h4>
                </div>
                <ul className="space-y-1.5">
                  {subject.topics.map((t) => (
                    <li key={t} className="flex items-start gap-1.5 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assessment + Careers */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-4 h-4 text-[#002147]" />
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Assessment</h4>
                  </div>
                  <div className="space-y-2">
                    {subject.assessment.map((a) => (
                      <div key={a.component}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span className="truncate pr-2">{a.component}</span>
                          <span className="font-bold text-[#002147] shrink-0">{a.weight}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${a.weight}%`, background: "linear-gradient(90deg, #002147, #D4AF37)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Briefcase className="w-4 h-4 text-[#002147]" />
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Career Pathways</h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {subject.careers.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "#002147", color: "#D4AF37" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Yearbook() {
  const [selectedGrade, setSelectedGrade] = useState<number>(8);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "compulsory" | "elective" | "language">("all");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const grade = YEARBOOK_DATA.find((g) => g.grade === selectedGrade)!;

  const filtered = grade.subjects.filter((s) => {
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.topics.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      s.careers.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleSubject = (code: string) =>
    setExpandedSubject((prev) => (prev === code ? null : code));

  return (
    <div className="min-h-screen" style={{ background: "#F8F9FB" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600">
                <ArrowLeft className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#002147" }}
              >
                <GraduationCap className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 leading-none">Subject Yearbook</p>
                <p className="text-[11px] text-gray-500">Grades 8–12 · Hoye Secondary School</p>
              </div>
            </div>
          </div>
          <Link href="/apply">
            <Button size="sm" style={{ background: "#002147" }}>
              Apply Online
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero banner */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #002147 0%, #003a7a 60%, #002147 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 bg-yellow-400 translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 bg-yellow-400 -translate-x-16 translate-y-16" />

        <div className="container max-w-6xl mx-auto px-4 py-12 relative">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: "#D4AF3720", color: "#D4AF37", border: "1px solid #D4AF3740" }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              2027 Academic Year
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              Hoye Secondary School<br />
              <span style={{ color: "#D4AF37" }}>Subject Yearbook</span>
            </h1>
            <p className="text-blue-200 text-base leading-relaxed">
              Explore every subject offered at Hoye — from Grade 8 foundations to Matric. Each entry covers topics, prerequisites, assessment breakdown, and career pathways.
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Grade selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {YEARBOOK_DATA.map((g) => (
            <button
              key={g.grade}
              onClick={() => {
                setSelectedGrade(g.grade);
                setExpandedSubject(null);
              }}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedGrade === g.grade
                  ? "text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-200"
              }`}
              style={selectedGrade === g.grade ? { background: "#002147" } : {}}
            >
              {g.label}
              {g.grade === 12 && (
                <span className="ml-1.5 text-[10px] font-bold text-yellow-400">MATRIC</span>
              )}
            </button>
          ))}
        </div>

        {/* Grade overview card */}
        <motion.div
          key={selectedGrade}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border p-5 mb-6 flex items-start gap-4"
          style={{ borderColor: "#D4AF3740" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #D4AF37, #b8952d)" }}
          >
            📚
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{grade.label}</h2>
            <p className="text-gray-600 text-sm leading-relaxed mt-1">{grade.overview}</p>
            <div className="flex gap-3 mt-3">
              <div className="text-center">
                <p className="text-xl font-bold text-[#002147]">{grade.subjects.length}</p>
                <p className="text-[11px] text-gray-500">Subjects</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <p className="text-xl font-bold text-[#002147]">
                  {grade.subjects.filter((s) => s.category === "compulsory" || s.category === "language").length}
                </p>
                <p className="text-[11px] text-gray-500">Compulsory</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <p className="text-xl font-bold text-[#002147]">
                  {grade.subjects.filter((s) => s.category === "elective").length}
                </p>
                <p className="text-[11px] text-gray-500">Electives</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects, topics, or careers…"
              className="pl-9 border-gray-200 focus:border-[#002147]"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            {(["all", "compulsory", "language", "elective"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  categoryFilter === cat
                    ? "text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-200"
                }`}
                style={categoryFilter === cat ? { background: "#002147", borderColor: "#002147" } : {}}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {(search || categoryFilter !== "all") && (
          <p className="text-sm text-gray-500 mb-4">
            Showing {filtered.length} of {grade.subjects.length} subjects
          </p>
        )}

        {/* Subject cards */}
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((subject) => (
                <SubjectCard
                  key={subject.code}
                  subject={subject}
                  expanded={expandedSubject === subject.code}
                  onToggle={() => toggleSubject(subject.code)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-gray-400"
              >
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No subjects match your search</p>
                <p className="text-sm mt-1">Try a different keyword or clear the filters</p>
                <button
                  onClick={() => { setSearch(""); setCategoryFilter("all"); }}
                  className="mt-4 text-sm text-[#002147] font-medium underline underline-offset-2"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <div
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #002147 0%, #003a7a 100%)" }}
        >
          <div className="text-3xl mb-3">🎓</div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to apply?</h3>
          <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto">
            Now that you've explored your subject choices, start your application to join Hoye Secondary School for the 2027 intake.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/apply">
              <Button className="bg-yellow-400 text-[#002147] hover:bg-yellow-300 font-bold">
                Start Application
              </Button>
            </Link>
            <Link href="/track">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Track Existing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
