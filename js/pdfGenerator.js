/**
 * PlacedOrPanic - Client-Side Placement Scorecard PDF Generator
 * Uses pure HTML5 canvas / jsPDF integration to render a certified
 * Placement Assessment Certificate & Scorecard.
 */

const PDFCertificateGenerator = {
  downloadCertificate(results, profile) {
    const candidateName = (profile && profile.name && profile.name.trim()) 
      ? profile.name.trim() 
      : 'Engineering Candidate';
    const college = (profile && profile.college && profile.college.trim()) 
      ? profile.college.trim() 
      : 'Campus Placement Drive';

    const isPlaced = results.verdict === 'PLACED';
    const verdictText = isPlaced ? 'STATUS: PLACED (OFFER READY)' : (results.verdict === 'BORDERLINE' ? 'STATUS: BORDERLINE' : 'STATUS: PANIC DRILL REQUIRED');
    const verdictColor = isPlaced ? '#10b981' : (results.verdict === 'BORDERLINE' ? '#f59e0b' : '#ef4444');

    // Generate high-resolution canvas certificate
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1100);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(0.5, '#eef4fb');
    bgGrad.addColorStop(1, '#e2eaf5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1100);

    // Decorative Borders
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1540, 1040);

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1510, 1010);

    // Header Badge
    ctx.fillStyle = '#4f46e5';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PLACED OR PANIC ASSESSMENT ENGINE', 800, 120);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 20px monospace';
    ctx.fillText('VERIFIED PLACEMENT READINESS SCORECARD', 800, 160);

    // Divider Line
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(300, 190);
    ctx.lineTo(1300, 190);
    ctx.stroke();

    // Candidate Salutation
    ctx.fillStyle = '#475569';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('This document certifies that', 800, 245);

    // Candidate Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(candidateName.toUpperCase(), 800, 320);

    // College / Institution
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`Institution / Department: ${college}`, 800, 370);

    ctx.fillStyle = '#475569';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Has successfully completed the timed technical assessment module:`, 800, 425);

    // Topic Name Box
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 15;
    ctx.fillRect(450, 460, 700, 70);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(450, 460, 700, 70);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(results.topicName, 800, 508);

    // Metric Triple Pods
    const metrics = [
      { label: 'TOTAL SCORE', val: `${results.rawScore} / ${results.maxScore}`, sub: `Accuracy: ${results.accuracy}%` },
      { label: 'TIME UTILIZED', val: results.formattedTimeTaken, sub: 'Timed Screen Session' },
      { label: 'QUESTIONS', val: `${results.correctCount} / ${results.totalQuestions} Correct`, sub: `${results.incorrectCount} Incorrect • ${results.unansweredCount} Unanswered` }
    ];

    const startX = 220;
    const cardWidth = 360;
    const gap = 40;
    const cardY = 575;

    metrics.forEach((m, idx) => {
      const x = startX + idx * (cardWidth + gap);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(150, 168, 192, 0.25)';
      ctx.shadowBlur = 10;
      ctx.fillRect(x, cardY, cardWidth, 160);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(x, cardY, cardWidth, 160);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(m.label, x + cardWidth / 2, cardY + 45);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(m.val, x + cardWidth / 2, cardY + 95);

      ctx.fillStyle = '#10b981';
      ctx.font = '600 16px sans-serif';
      ctx.fillText(m.sub, x + cardWidth / 2, cardY + 135);
    });

    // Big Verdict Stamp
    ctx.save();
    ctx.translate(800, 840);
    ctx.fillStyle = verdictColor;
    ctx.strokeStyle = verdictColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(-320, -40, 640, 80);
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(verdictText, 0, 10);
    ctx.restore();

    // Footer Credentials
    const testDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#64748b';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Issued: ${testDate} | Engine: PlacedOrPanic v1.0`, 100, 1000);

    ctx.textAlign = 'right';
    ctx.fillText(`Host: placedorpanic.vercel.app | Auth ID: POP-${Date.now().toString(36).toUpperCase()}`, 1500, 1000);

    // Trigger Download
    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const sanitizedCandidate = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `PlacedOrPanic_Scorecard_${sanitizedCandidate}.png`;
    link.href = imageUri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
