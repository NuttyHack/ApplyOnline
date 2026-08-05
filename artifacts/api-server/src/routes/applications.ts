import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, applicationsTable } from "@workspace/db";
import {
  SubmitApplicationBody,
  TrackApplicationParams,
  RecoverReferenceQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateRefNumber(gradeApplying: string): string {
  const year = new Date().getFullYear() + 1;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `HSS-${year}-${code}`;
}

// POST /applications — submit a new application
router.post("/applications", async (req, res): Promise<void> => {
  const parsed = SubmitApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid application body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;

  // Generate a unique reference number
  let refNumber = generateRefNumber(data.gradeApplying);
  // Retry if collision (extremely unlikely)
  const existing = await db
    .select({ id: applicationsTable.id })
    .from(applicationsTable)
    .where(eq(applicationsTable.refNumber, refNumber));
  if (existing.length > 0) {
    refNumber = generateRefNumber(data.gradeApplying);
  }

  const [application] = await db
    .insert(applicationsTable)
    .values({
      ...data,
      refNumber,
      age: data.age ?? null,
      totalSiblings: data.totalSiblings ?? null,
      preferredStartYear: data.preferredStartYear ?? null,
      yearPassedHighest: data.yearPassedHighest ?? null,
      currentAcademicYear: data.currentAcademicYear ?? null,
      numSubjectsPassed: data.numSubjectsPassed ?? null,
    } as unknown as typeof applicationsTable.$inferInsert)
    .returning();

  req.log.info({ refNumber, id: application.id }, "Application submitted");

  res.status(201).json({
    refNumber: application.refNumber,
    message: "Your application has been submitted successfully.",
  });
});

// GET /applications/track/:refNumber — track application status
router.get("/applications/track/:refNumber", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.refNumber) ? req.params.refNumber[0] : req.params.refNumber;
  const params = TrackApplicationParams.safeParse({ refNumber: raw });
  if (!params.success) {
    res.status(400).json({ error: "Invalid reference number format" });
    return;
  }

  const [application] = await db
    .select({
      refNumber: applicationsTable.refNumber,
      firstName: applicationsTable.firstName,
      lastName: applicationsTable.lastName,
      gradeApplying: applicationsTable.gradeApplying,
      status: applicationsTable.status,
      submittedAt: applicationsTable.submittedAt,
      updatedAt: applicationsTable.updatedAt,
    })
    .from(applicationsTable)
    .where(eq(applicationsTable.refNumber, params.data.refNumber));

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json({
    refNumber: application.refNumber,
    firstName: application.firstName,
    lastName: application.lastName,
    gradeApplying: application.gradeApplying,
    status: application.status,
    submittedAt: application.submittedAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  });
});

// GET /applications/recover — recover reference by ID + phone
router.get("/applications/recover", async (req, res): Promise<void> => {
  const parsed = RecoverReferenceQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "idNumber and phone are required" });
    return;
  }

  const { idNumber, phone } = parsed.data;

  const [application] = await db
    .select({
      refNumber: applicationsTable.refNumber,
    })
    .from(applicationsTable)
    .where(eq(applicationsTable.idNumber, idNumber));

  if (!application) {
    res.status(404).json({ error: "Application not found with the provided details" });
    return;
  }

  // Verify phone matches guardian or learner phone
  const [full] = await db
    .select({
      refNumber: applicationsTable.refNumber,
      guardianPhone: applicationsTable.guardianPhone,
      mobileNumber: applicationsTable.mobileNumber,
    })
    .from(applicationsTable)
    .where(eq(applicationsTable.idNumber, idNumber));

  const normalise = (p: string | null | undefined) => (p || "").replace(/\s/g, "");
  const phoneNorm = normalise(phone);

  if (
    normalise(full?.guardianPhone) !== phoneNorm &&
    normalise(full?.mobileNumber) !== phoneNorm
  ) {
    res.status(404).json({ error: "Application not found with the provided details" });
    return;
  }

  res.json({ refNumber: full.refNumber });
});

export default router;
