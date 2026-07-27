// Core eligibility rules for PrimeCampus admissions.
// Kept in one file so the logic is easy to audit against the official criteria.

export const RULES = {
  ARTS_MIN_SSC_PERCENT: 45,
  SCIENCE_MIN_SSC_PERCENT: 60,
  ENTRY_TEST_PASS_SCORE: 15, // out of 30
  ENTRY_TEST_TOTAL: 30,
  ARTS_SEATS: 40,
  SCIENCE_SEATS: 60,
};

export type Stream = "Arts" | "Science";

/**
 * Checks basic (pre-test) eligibility based on SSC percentage alone.
 * Science applicants who pass this still need to clear the entry test.
 */
export function checkBasicEligibility(stream: Stream, sscPercentage: number): {
  eligible: boolean;
  reason: string;
} {
  if (stream === "Arts") {
    if (sscPercentage >= RULES.ARTS_MIN_SSC_PERCENT) {
      return { eligible: true, reason: "Meets Arts SSC threshold (45%)." };
    }
    return {
      eligible: false,
      reason: `SSC percentage (${sscPercentage}%) is below the 45% required for Arts.`,
    };
  }

  // Science
  if (sscPercentage >= RULES.SCIENCE_MIN_SSC_PERCENT) {
    return {
      eligible: true,
      reason: "Meets Science SSC threshold (60%). Entry test required next.",
    };
  }
  return {
    eligible: false,
    reason: `SSC percentage (${sscPercentage}%) is below the 60% required for Science.`,
  };
}

/**
 * Evaluates entry test results (Science stream only).
 */
export function checkEntryTest(englishScore: number, mathScore: number, physicsScore: number) {
  const total = englishScore + mathScore + physicsScore;
  const passed = total >= RULES.ENTRY_TEST_PASS_SCORE;
  return { total, passed };
}
