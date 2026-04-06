import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface DefectPdfItem {
  location: string;
  midCategory: string;
  guideItems: string[];
  isUrgent: boolean;
  photoDataUrls: string[]; // base64 data URLs
}

interface DefectPdfOptions {
  complexName: string;
  unitNumber: string;
  residentName: string;
  receiptNo: string;
  items: DefectPdfItem[];
}

export async function generateDefectPdf(options: DefectPdfOptions): Promise<void> {
  const { complexName, unitNumber, residentName, receiptNo, items } = options;
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const fileDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const fileName = `하자접수_${unitNumber.replace(/\s/g, "")}_${fileDate}.pdf`;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  const checkPage = (needed: number) => {
    if (y + needed > 280) {
      doc.addPage();
      y = margin;
    }
  };

  // --- Header ---
  doc.setFillColor(59, 130, 246); // primary blue
  doc.rect(0, 0, pageW, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("입주ON 하자 접수 확인서", pageW / 2, 16, { align: "center" });
  doc.setFontSize(10);
  doc.text(`접수번호: ${receiptNo}`, pageW / 2, 28, { align: "center" });
  y = 44;

  // --- Info section ---
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  const infoLines = [
    [`단지명: ${complexName}`, `접수일시: ${dateStr}`],
    [`동·호수: ${unitNumber}`, `입주민: ${residentName}`],
  ];
  for (const [left, right] of infoLines) {
    doc.text(left, margin, y);
    doc.text(right, pageW / 2 + 10, y);
    y += 6;
  }

  // Divider
  y += 2;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // --- Defect items ---
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    checkPage(40);

    // Item header
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, y, contentW, 8, 1, 1, "F");
    doc.setFontSize(11);
    doc.setTextColor(59, 130, 246);
    doc.text(`하자 항목 ${i + 1}`, margin + 3, y + 5.5);
    if (item.isUrgent) {
      doc.setTextColor(220, 38, 38);
      doc.text("🚨 긴급", pageW - margin - 3, y + 5.5, { align: "right" });
    }
    y += 12;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    const details = [
      `위치: ${item.location}`,
      `카테고리: ${item.midCategory}`,
      `점검 항목: ${item.guideItems.join(", ")}`,
      `긴급여부: ${item.isUrgent ? "긴급" : "일반"}`,
    ];
    for (const line of details) {
      checkPage(6);
      doc.text(line, margin + 3, y);
      y += 5;
    }

    // Photos
    if (item.photoDataUrls.length > 0) {
      checkPage(30);
      doc.text("첨부 사진:", margin + 3, y);
      y += 4;
      let x = margin + 3;
      for (const dataUrl of item.photoDataUrls) {
        if (x + 26 > pageW - margin) {
          x = margin + 3;
          y += 28;
          checkPage(30);
        }
        try {
          doc.addImage(dataUrl, "JPEG", x, y, 25, 25);
        } catch {
          // skip if image fails
        }
        x += 28;
      }
      y += 28;
    }

    // Item divider
    y += 2;
    if (i < items.length - 1) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageW - margin, y);
      y += 6;
    }
  }

  // --- Footer ---
  checkPage(20);
  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("* 본 확인서는 하자 접수 증빙용 서류입니다.", margin, y);
  y += 5;
  doc.text("입주ON 입주지원센터", pageW / 2, y, { align: "center" });

  doc.save(fileName);
}
