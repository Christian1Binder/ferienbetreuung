import { jsPDF } from 'jspdf';

export const generateCertificate = (userName: string, courseName: string, date: string) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // A4 Landscape: 297mm x 210mm

  // Background/Border
  doc.setLineWidth(2);
  doc.setDrawColor(226, 0, 26); // AWO Red #E2001A
  doc.rect(10, 10, 277, 190);

  // Logo Placeholder (Text for now)
  doc.setFontSize(30);
  doc.setTextColor(226, 0, 26);
  doc.setFont('helvetica', 'bold');
  doc.text('AWO', 20, 30);

  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text('Bezirksjugendwerk', 20, 36);
  doc.text('der AWO Mittelfranken', 20, 41);

  // Title
  doc.setFontSize(40);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('ZERTIFIKAT', 148.5, 80, { align: 'center' });

  // Content
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('Hiermit wird bestätigt, dass', 148.5, 100, { align: 'center' });

  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(userName, 148.5, 115, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('den Online-Kurs', 148.5, 130, { align: 'center' });

  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(courseName, 148.5, 145, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text('erfolgreich absolviert hat.', 148.5, 160, { align: 'center' });

  // Date and Signature line
  doc.setFontSize(12);
  doc.text(`Nürnberg, den ${date}`, 40, 180);

  doc.line(180, 180, 250, 180); // Signature line
  doc.text('Bezirksjugendwerk AWO', 180, 185);

  const fileName = `Zertifikat_${courseName.replace(/\s+/g, '_')}_${userName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
