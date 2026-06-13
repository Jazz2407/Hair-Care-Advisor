import { calculateRecommendation } from './logic.js';

const mockProducts = [
  { id: 1, name: "Ketoconazole" }, { id: 2, name: "Minoxidil" }, { id: 3, name: "Serum" }
];

test('Moderate severity with stress and dandruff', () => {
  const answers = { stressLevel: 'High', dandruff: 'Yes' };
  const imageAnalysis = { recessionScore: 6 }; // 1 + 3 = 4 (Moderate)
  
  const result = calculateRecommendation(answers, imageAnalysis, mockProducts);
  
  expect(result.severity).toBe('moderate');
  expect(result.causes).toContain("High Stress");
  expect(result.recommendedPlan.some(p => p.name === "Ketoconazole")).toBeTruthy();
});

test('Mild severity with no major symptoms', () => {
  const answers = { stressLevel: 'Low', dandruff: 'No' };
  const result = calculateRecommendation(answers, null, mockProducts);
  expect(result.severity).toBe('mild');
  expect(result.causes).toContain("Environmental Factors");
});