/**
 * Document parser — extracts structured learner data from uploaded PDFs and images.
 * Uses pdf.js for PDFs; plain text extraction for images (returns raw text for review).
 * No AI required — pattern-matching on SA documents (ID, birth certificate, school report).
 */

export type ExtractedData = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  idNumber?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  citizenship?: string;
  countryOfBirth?: string;
  mobileNumber?: string;
  email?: string;
  residentialAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  prevSchoolName?: string;
  gradePassed?: string;
  averagePercentage?: string;
  parentFirstName?: string;
  parentLastName?: string;
  parentPhone?: string;
  parentEmail?: string;
  confidence: Record<string, "high" | "medium" | "low">;
  rawText?: string;
};

/** Extract text from a PDF file using pdf.js */
async function extractPdfText(file: File): Promise<string> {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items
      .map((item: unknown) => (item as { str?: string }).str ?? "")
      .join(" ") + "\n";
  }
  return text;
}

/** Parse South African ID number (13 digits: YYMMDD GGGG S Z D) */
function parseSaId(text: string): {
  idNumber?: string;
  dob?: string;
  gender?: string;
  citizenship?: string;
} {
  const match = text.match(/\b(\d{2})(\d{2})(\d{2})\s*(\d{4})\s*([01])\s*\d\s*\d\b/);
  if (!match) return {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _full = match[0];

  const [, yy, mm, dd, seq, citizenDigit] = match;
  const year = parseInt(yy) <= 26 ? `20${yy}` : `19${yy}`;
  const idNumber = `${yy}${mm}${dd}${seq}${citizenDigit}${match[0].replace(/\s/g, "").slice(-2)}`;
  const genderSeq = parseInt(seq);
  const gender = genderSeq >= 5000 ? "Male" : "Female";
  const dob = `${year}-${mm}-${dd}`;
  const citizenship = citizenDigit === "0" ? "South African" : "Permanent Resident";

  return {
    idNumber: idNumber.replace(/\s/g, "").slice(0, 13),
    dob,
    gender,
    citizenship,
  };
}

/** Extract SA provinces from text */
function extractProvince(text: string): string | undefined {
  const provinces: Record<string, string> = {
    gauteng: "Gauteng",
    "kwazulu-natal": "KwaZulu-Natal",
    kwazulu: "KwaZulu-Natal",
    "western cape": "Western Cape",
    "eastern cape": "Eastern Cape",
    "northern cape": "Northern Cape",
    limpopo: "Limpopo",
    mpumalanga: "Mpumalanga",
    "north west": "North West",
    "free state": "Free State",
  };
  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(provinces)) {
    if (lower.includes(key)) return value;
  }
  return undefined;
}

/** Extract postal code (4 digits in SA context) */
function extractPostalCode(text: string): string | undefined {
  const match = text.match(/\b(\d{4})\b/);
  return match?.[1] ?? undefined;
}

/** Extract email address */
function extractEmail(text: string): string | undefined {
  const match = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  return match?.[0] ?? undefined;
}

/** Extract SA phone number */
function extractPhone(text: string): string | undefined {
  const match = text.match(/(?:\+27|0)[\s-]?(\d{2})[\s-]?(\d{3})[\s-]?(\d{4})/);
  if (!match) return undefined;
  return `0${match[1]}${match[2]}${match[3]}`;
}

/** Extract percentage / average mark */
function extractAveragePercentage(text: string): string | undefined {
  const match = text.match(/average[:\s]+(\d{1,3}(?:\.\d)?)\s*%?/i);
  if (match) return match[1] + "%";
  const match2 = text.match(/(\d{2,3})\s*%.*average/i);
  if (match2) return match2[1] + "%";
  return undefined;
}

/** Attempt to find a name block (First Last) from a line labelled "Name:" */
function extractName(text: string): { firstName?: string; lastName?: string; middleName?: string } {
  const fullNameMatch = text.match(/(?:full\s*name|name)[:\s]+([A-Z][a-z]+)\s+([A-Z][a-z]+)(?:\s+([A-Z][a-z]+))?/i);
  const surnameMatch = text.match(/surname[:\s]+([A-Z][a-z]+)/i);
  const firstNameMatch = text.match(/(?:first\s*name|forename|given\s*name)[:\s]+([A-Z][a-z]+)/i);

  if (fullNameMatch) {
    return {
      firstName: fullNameMatch[1],
      middleName: fullNameMatch[3] ? fullNameMatch[2] : undefined,
      lastName: fullNameMatch[3] ?? fullNameMatch[2],
    };
  }

  return {
    firstName: firstNameMatch?.[1] ?? undefined,
    lastName: surnameMatch?.[1] ?? undefined,
  };
}

/** Extract school name */
function extractSchool(text: string): string | undefined {
  const match = text.match(/(?:school|institution)[:\s]+([A-Z][^\n,]+)/i);
  return match?.[1]?.trim() ?? undefined;
}

/** Extract grade passed */
function extractGrade(text: string): string | undefined {
  const match = text.match(/grade\s+(?:passed|completed|achieved)?[:\s]*(\d{1,2})/i);
  if (match) return `Grade ${match[1]}`;
  return undefined;
}

/** Main extraction function */
export async function extractDataFromDocument(file: File): Promise<ExtractedData> {
  let rawText = "";

  if (file.type === "application/pdf") {
    rawText = await extractPdfText(file);
  } else if (file.type.startsWith("image/")) {
    // For images, return raw binary as text placeholder — enhancement point for OCR
    rawText = `[Image document: ${file.name}. Manual review required for image-based documents.]`;
  } else {
    // Try reading as plain text
    rawText = await file.text();
  }

  const confidence: Record<string, "high" | "medium" | "low"> = {};
  const idData = parseSaId(rawText);

  const result: ExtractedData = { confidence, rawText: rawText.slice(0, 2000) };

  if (idData.idNumber) {
    result.idNumber = idData.idNumber;
    confidence.idNumber = "high";
    result.dob = idData.dob;
    confidence.dob = "high";
    result.gender = idData.gender;
    confidence.gender = "high";
    result.citizenship = idData.citizenship;
    confidence.citizenship = "high";
    result.nationality = idData.citizenship === "South African" ? "South African" : undefined;
    if (result.nationality) confidence.nationality = "medium";
  }

  const names = extractName(rawText);
  if (names.firstName) { result.firstName = names.firstName; confidence.firstName = "medium"; }
  if (names.lastName) { result.lastName = names.lastName; confidence.lastName = "medium"; }
  if (names.middleName) { result.middleName = names.middleName; confidence.middleName = "medium"; }

  const email = extractEmail(rawText);
  if (email) { result.email = email; confidence.email = "high"; }

  const phone = extractPhone(rawText);
  if (phone) { result.mobileNumber = phone; confidence.mobileNumber = "high"; }

  const province = extractProvince(rawText);
  if (province) { result.province = province; confidence.province = "medium"; }

  const postalCode = extractPostalCode(rawText);
  if (postalCode) { result.postalCode = postalCode; confidence.postalCode = "low"; }

  const school = extractSchool(rawText);
  if (school) { result.prevSchoolName = school; confidence.prevSchoolName = "medium"; }

  const grade = extractGrade(rawText);
  if (grade) { result.gradePassed = grade; confidence.gradePassed = "medium"; }

  const avg = extractAveragePercentage(rawText);
  if (avg) { result.averagePercentage = avg; confidence.averagePercentage = "medium"; }

  return result;
}

/** Count how many fields were extracted */
export function countExtracted(data: ExtractedData): number {
  const ignore = new Set(["confidence", "rawText"]);
  return Object.entries(data).filter(([k, v]) => !ignore.has(k) && v !== undefined).length;
}
