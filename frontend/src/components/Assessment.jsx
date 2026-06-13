import { useState, useEffect } from 'react';
import styles from './Assessment.module.css';
import ImageUpload from './ImageUpload'; 

const QUESTIONS = [
  { id: 'ageRange', label: 'What is your age range?', options: ['Under 18', '18-24', '25-34', '35-44', '45+'] },
  { id: 'gender', label: 'What is your gender?', options: ['Male', 'Female', 'Other'] },
  { id: 'hairFallDuration', label: 'How long have you been experiencing hair fall?', options: ['Less than 6 months', '6-12 months', '1-5 years', 'More than 5 years'] },
  { id: 'dandruff', label: 'Do you experience dandruff?', options: ['Yes', 'No', 'Occasionally'] },
  { id: 'familyHistory', label: 'Is there a family history of hair loss?', options: ['Yes', 'No'] },
  { id: 'stressLevel', label: 'What is your current stress level?', options: ['Low', 'Moderate', 'High'] },
  { id: 'dietType', label: 'How would you describe your diet?', options: ['Balanced', 'Vegetarian', 'Vegan', 'High Processed/Fast Food'] },
  { id: 'sleepQuality', label: 'How is your sleep quality?', options: ['Excellent (7+ hours)', 'Fair (5-6 hours)', 'Poor (< 5 hours)'] },
  { id: 'scalpOiliness', label: 'How oily is your scalp?', options: ['Dry', 'Normal', 'Oily'] },
  { id: 'recessionConcern', label: 'Are you concerned about a receding hairline?', options: ['Yes, definitely', 'Slightly', 'No'] }
];

export default function Assessment({ onNavigate }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploadingPhase, setIsUploadingPhase] = useState(false); 
  
  // NEW: State to track if we are currently fetching saved data from the backend
  const [isRestoring, setIsRestoring] = useState(true);

  // 1. Fetch Autosaved data on component mount
  useEffect(() => {
    fetch('/api/autosave')
      .then(res => res.json())
      .then(data => {
        if (data.answers && Object.keys(data.answers).length > 0) {
          setAnswers(data.answers);
          // Calculate how many questions were answered to jump to the right step
          const answeredCount = Object.keys(data.answers).length;
          // Ensure we don't go past the last question if they already finished it
          setStep(Math.min(answeredCount, QUESTIONS.length - 1)); 
        }
        setIsRestoring(false);
      })
      .catch(err => {
        console.error("Failed to restore autosave:", err);
        setIsRestoring(false);
      });
  }, []);

  // 2. Autosave whenever the 'answers' state changes
  useEffect(() => {
    // Only save if we have finished restoring and actually have answers to save
    if (!isRestoring && Object.keys(answers).length > 0) {
      fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      }).catch(err => console.error("Failed to autosave progress:", err));
    }
  }, [answers, isRestoring]);

  const handleSelect = (e) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: e.target.value });
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsUploadingPhase(true); 
    }
  };

  const submitFinalAssessment = async (mockImageAnalysis) => {
    setLoading(true);
    try {
      const assessRes = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, imageAnalysis: mockImageAnalysis })
      });
      const data = await assessRes.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      alert("Something went wrong connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent UI flashing while restoring the saved data
  if (isRestoring) {
    return (
      <div className={styles.container} style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', marginTop: '20px' }}>Restoring previous progress...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center' }}>
        <h2 className={styles.question}>Analyzing your profile...</h2>
        <div style={{ color: 'var(--text-muted)' }}>Cross-referencing your answers with our clinical database.</div>
      </div>
    );
  }

  if (results) {
    return (
      <div className={styles.container}>
        <h2 className={styles.question} style={{ marginBottom: '20px' }}>Your Custom Plan</h2>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>
          <p style={{ margin: '0 0 10px 0' }}><strong>User Summary:</strong> {results.answers.gender}, {results.answers.ageRange}, experiencing hair fall for {results.answers.hairFallDuration}.</p>
          <p style={{ margin: 0 }}><strong>Image Analysis:</strong> Density is {results.imageAnalysis.hairDensity}, scalp health {results.imageAnalysis.scalpHealth.replace('_', ' ')}.</p>
        </div>

        <p style={{ color: 'var(--text-muted)' }}>Risk Level: <strong style={{ color: '#60a5fa', textTransform: 'capitalize' }}>{results.severity}</strong></p>
        
        <p style={{ marginBottom: '10px' }}><strong>Causes:</strong> {results.causes.join(', ')}</p>
        
        <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>Recommended Plan (3 to 6 months)</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
          {results.recommendedPlan.map((prod, i) => (
            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>{prod.name}</span><strong style={{ color: '#60a5fa' }}>₹{prod.price}</strong>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onNavigate('clinics')} style={{ flex: 1 }}>
            Book Consultation
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => window.location.reload()} style={{ flex: 1 }}>
            Retake
          </button>
        </div>
      </div>
    );
  }

  if (isUploadingPhase) {
    return (
      <ImageUpload 
        onBack={() => setIsUploadingPhase(false)} 
        onAnalysisComplete={submitFinalAssessment} 
      />
    );
  }

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
      </div>
      
      <div key={step}>
        <div className={styles.question}>{currentQ.label}</div>
        <select className={styles.select} value={answers[currentQ.id] || ''} onChange={handleSelect}>
          <option value="" disabled>Select an option...</option>
          {currentQ.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className={styles.buttonContainer}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setStep(step - 1)} disabled={step === 0}>Back</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNext} disabled={!answers[currentQ.id]}>
          {step === QUESTIONS.length - 1 ? 'Upload Image' : 'Continue'}
        </button>
      </div>
    </div>
  );
}