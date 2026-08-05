import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, HelpCircle, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ExtractedData } from "@/lib/document-parser";
import { type Language } from "@/lib/skavs-brain";

type Props = {
  data: ExtractedData;
  language: Language;
  onConfirm: () => void;
  onCancel: () => void;
};

const FIELD_LABELS: Record<string, { en: string; zu: string }> = {
  firstName: { en: "First Name", zu: "Igama Lokuqala" },
  lastName: { en: "Surname", zu: "Isibongo" },
  middleName: { en: "Middle Name", zu: "Igama Laphakathi" },
  idNumber: { en: "ID Number", zu: "Inombolo ye-ID" },
  dob: { en: "Date of Birth", zu: "Usuku Lokuzalwa" },
  gender: { en: "Gender", zu: "Ubulili" },
  citizenship: { en: "Citizenship", zu: "Ubuzwe" },
  nationality: { en: "Nationality", zu: "Inhlangano" },
  email: { en: "Email", zu: "I-imeyili" },
  mobileNumber: { en: "Phone Number", zu: "Inombolo Yocingo" },
  province: { en: "Province", zu: "Isifundazwe" },
  postalCode: { en: "Postal Code", zu: "Ikhodi Yeposi" },
  prevSchoolName: { en: "Previous School", zu: "Isikole Esidlule" },
  gradePassed: { en: "Grade Passed", zu: "Ibanga Elidlulile" },
  averagePercentage: { en: "Average %", zu: "Iphesenti Eliphakathi" },
};

const CONFIDENCE_CONFIG = {
  high: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", border: "border-green-200", label: { en: "Confident", zu: "Ngiqinisile" } },
  medium: { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200", label: { en: "Check this", zu: "Hlola lokhu" } },
  low: { icon: HelpCircle, color: "text-red-400", bg: "bg-red-50", border: "border-red-200", label: { en: "Uncertain", zu: "Angiqinisekile" } },
};

export function ExtractedFieldsReview({ data, language, onConfirm, onCancel }: Props) {
  const ignore = new Set(["confidence", "rawText"]);
  const entries = Object.entries(data).filter(([k, v]) => !ignore.has(k) && v !== undefined) as [string, string][];

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (field: string, current: string) => {
    setEditingField(field);
    setEditValue(current);
  };

  if (entries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md border overflow-hidden ml-9"
      style={{ borderColor: "#D4AF3730" }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b" style={{ borderColor: "#D4AF3730", background: "#FFFBEB" }}>
        <p className="text-xs font-bold text-[#002147]">
          {language === "en"
            ? `📄 Found ${entries.length} fields — verify before applying`
            : `📄 Ngithole amasimu angu-${entries.length} — qinisekisa ngaphambi kokufaka`}
        </p>
      </div>

      {/* Fields */}
      <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto">
        {entries.map(([field, value]) => {
          const conf = (data.confidence[field] ?? "low") as "high" | "medium" | "low";
          const cfg = CONFIDENCE_CONFIG[conf];
          const Icon = cfg.icon;
          const label = FIELD_LABELS[field]?.[language] ?? field;
          const isEditing = editingField === field;

          return (
            <div key={field} className={`px-3 py-2 flex items-center gap-2 ${cfg.bg}`}>
              <Icon className={`w-3.5 h-3.5 shrink-0 ${cfg.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 leading-none">{label}</p>
                {isEditing ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-6 text-xs py-0 px-1.5"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        (data as unknown as Record<string, string>)[field] = editValue;
                        setEditingField(null);
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-gray-800 truncate mt-0.5">{value}</p>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => handleEdit(field, value)}
                  className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-100">
        <Button
          onClick={onConfirm}
          size="sm"
          className="flex-1 h-7 text-xs"
          style={{ background: "#002147" }}
        >
          {language === "en" ? "✅ Apply to form" : "✅ Faka eformeni"}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="flex-1 h-7 text-xs"
        >
          {language === "en" ? "🔄 Try another" : "🔄 Zama olunye"}
        </Button>
      </div>
    </motion.div>
  );
}
