import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Certificate = ({ username, language, completedAt, certificateId }) => {
  const certRef = useRef(null);

  const formattedDate = completedAt
    ? new Date(completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = async () => {
    if (!certRef.current) return;
    
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${username}_${language}_Certificate.pdf`);
    } catch (error) {
      console.error("Error generating certificate PDF:", error);
      alert("Failed to download certificate.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div 
        ref={certRef}
        style={{
          width: '800px',
          height: '560px',
          padding: '40px',
          background: 'linear-gradient(135deg, #f8f7ff 0%, #e0e7ff 100%)',
          border: '16px solid var(--primary)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          textAlign: 'center',
          fontFamily: 'serif',
          color: '#1e1b4b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '12px', color: '#6b7280' }}>
          ID: {certificateId || 'PENDING'}
        </div>
        
        <h1 style={{ fontSize: '48px', margin: '0 0 20px', color: 'var(--primary-dark)' }}>
          Certificate of Completion
        </h1>
        
        <p style={{ fontSize: '20px', margin: '0 0 10px' }}>This is to certify that</p>
        
        <h2 style={{ fontSize: '40px', margin: '10px 0 30px', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', display: 'inline-block' }}>
          {username}
        </h2>
        
        <p style={{ fontSize: '20px', margin: '0 0 20px' }}>has successfully completed the 180-day</p>
        <h3 style={{ fontSize: '32px', margin: '0 0 40px', color: 'var(--accent)' }}>
          {language} Pronunciation Mastery
        </h3>
        
        <p style={{ fontSize: '16px', margin: 0, fontStyle: 'italic' }}>
          Awarded on {formattedDate}
        </p>
        
        <div style={{ position: 'absolute', bottom: '40px', right: '60px', textAlign: 'center' }}>
          <div style={{ borderBottom: '1px solid #000', width: '150px', marginBottom: '5px' }}></div>
          <span style={{ fontSize: '14px' }}>LangLearn Director</span>
        </div>
      </div>
      
      <button onClick={handleDownload} className="btn btn-primary">
        Download PDF Certificate
      </button>
    </div>
  );
};

export default Certificate;
