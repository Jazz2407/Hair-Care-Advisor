export const calculateRecommendation = (answers, imageAnalysis, products) => {
  let score = 0;
  const likelyCauses = [];
  const recommendedProducts = [];

  if (answers.familyHistory === 'Yes') { score += 2; likelyCauses.push("Genetics"); }
  if (answers.stressLevel === 'High') { score += 1; likelyCauses.push("High Stress"); }
  if (answers.dietType === 'High Processed/Fast Food' || answers.sleepQuality === 'Poor (< 5 hours)') { score += 1; likelyCauses.push("Lifestyle/Diet"); }
  if (imageAnalysis && imageAnalysis.recessionScore > 5) { score += 3; }

  let severity = 'mild';
  if (score >= 3 && score <= 5) severity = 'moderate';
  if (score >= 6) severity = 'advanced';

  if (answers.dandruff === 'Yes' || answers.dandruff === 'Occasionally') recommendedProducts.push(products[0]);
  if (answers.scalpOiliness === 'Oily' || answers.scalpOiliness === 'Dry') recommendedProducts.push(products[2]);
  if (severity === 'advanced' || severity === 'moderate') recommendedProducts.push(products[1]);
  if (likelyCauses.length === 0) likelyCauses.push("Environmental Factors");

  return { severity, recommendedPlan: recommendedProducts, causes: likelyCauses };
};