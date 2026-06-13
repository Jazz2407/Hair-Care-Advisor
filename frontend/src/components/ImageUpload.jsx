import { useState, useRef } from 'react';
import styles from './Assessment.module.css';

export default function ImageUpload({ onAnalysisComplete, onBack }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Invalid file type. Please upload a JPG or PNG image.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

 const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 👇 THE FIX: Hardcode the absolute URL to your port 5000 backend 👇
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      const mockAnalysisData = await response.json();
      onAnalysisComplete(mockAnalysisData);
    } catch (err) {
      console.error(err); // <-- Adding this so you can see any deeper errors in the console!
      setError('Failed to connect to the analysis engine. Try again.');
      setIsUploading(false);
    }
  };
  if (isUploading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center' }}>
        <h2 className={styles.question}>Analyzing Scalp Image...</h2>
        <div style={{ color: 'var(--text-muted)' }}>Running mock AI diagnostics...</div>
        <div style={{ marginTop: '20px', width: '40px', height: '40px', border: '4px solid var(--border-subtle)', borderTopColor: '#60a5fa', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.question}>Upload a photo of your scalp</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
        For the most accurate assessment, upload a clear picture of your crown or hairline.
      </p>

      <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />

      <div onClick={() => fileInputRef.current.click()} style={{ border: `2px dashed ${error ? '#ef4444' : 'var(--border-subtle)'}`, borderRadius: '12px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)', marginBottom: '20px', transition: 'all 0.2s' }}>
        {preview ? (
          <img src={preview} alt="Scalp preview" style={{ maxHeight: '150px', borderRadius: '8px', margin: '0 auto' }} />
        ) : (
          <div style={{ color: 'var(--text-main)' }}>
            <span style={{ fontSize: '2rem' }}>📸</span>
            <p style={{ marginTop: '10px', fontWeight: '500' }}>Click to select an image</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPG or PNG (Max 5MB)</p>
          </div>
        )}
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

      <div className={styles.buttonContainer}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onBack}>Back</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleUpload} disabled={!file}>Analyze Image</button>
      </div>
    </div>
  );
}