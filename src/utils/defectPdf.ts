import jsPDF from "jspdf";

interface DefectPdfItem {
  location: string;
  midCategory: string;
  guideItems: string[];
  isUrgent: boolean;
  photoDataUrls: string[];
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
  const dateStr = formatDateTime(now);
  const fileDate = formatFileDate(now);
  const fileName = `하자접수_${unitNumber.replace(/\s/g, "")}_${fileDate}.pdf`;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  const checkPage = (needed: number) => {
    if (y + needed > 280) { doc.addPage(); y = margin; }
  };

  drawHeader(doc, pageW, "입주ON 하자 접수 확인서", `접수번호: ${receiptNo}`);
  y = 44;
  drawInfoSection(doc, margin, pageW, y, [
    [`단지명: ${complexName}`, `접수일시: ${dateStr}`],
    [`동·호수: ${unitNumber}`, `입주민: ${residentName}`],
  ]);
  y += 14;
  drawDivider(doc, margin, pageW, y); y += 6;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    checkPage(40);
    y = drawDefectItem(doc, item, i, margin, contentW, pageW, y, checkPage);
    if (i < items.length - 1) { doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.2); doc.line(margin, y, pageW - margin, y); y += 6; }
  }

  drawFooter(doc, margin, pageW, y, checkPage);
  doc.save(fileName);
}

// --- List PDF ---

export interface DefectListItem {
  receiptNo: string;
  location: string;
  guide: string;
  isUrgent: boolean;
  photoCount: number;
  status: string;
}

interface DefectListPdfOptions {
  complexName: string;
  unitNumber: string;
  residentName: string;
  items: DefectListItem[];
}

export async function generateDefectListPdf(options: DefectListPdfOptions): Promise<void> {
  const { complexName, unitNumber, residentName, items } = options;
  const now = new Date();
  const dateStr = formatDateTime(now);
  const fileDate = formatFileDate(now);
  const fileName = `하자접수내역_${unitNumber.replace(/\s/g, "")}_${fileDate}.pdf`;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  const checkPage = (needed: number) => {
    if (y + needed > 280) { doc.addPage(); y = margin; }
  };

  drawHeader(doc, pageW, "입주ON 하자 접수 전체 내역서", `총 ${items.length}건`);
  y = 44;

  drawInfoSection(doc, margin, pageW, y, [
    [`단지명: ${complexName}`, `출력일시: ${dateStr}`],
    [`동·호수: ${unitNumber}`, `입주민: ${residentName}`],
    [`총 접수건수: ${items.length}건`, ""],
  ]);
  y += 20;
  drawDivider(doc, margin, pageW, y); y += 6;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    checkPage(36);

    // Item header bar
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, y, contentW, 8, 1, 1, "F");
    doc.setFontSize(11);
    doc.setTextColor(59, 130, 246);
    doc.text(`접수번호: ${item.receiptNo}`, margin + 3, y + 5.5);
    if (item.isUrgent) {
      doc.setTextColor(220, 38, 38);
      doc.text("긴급", pageW - margin - 3, y + 5.5, { align: "right" });
    }
    y += 12;

    // Status color
    const statusColors: Record<string, [number, number, number]> = {
      "미배정": [59, 130, 246],
      "접수완료": [59, 130, 246],
      "처리중": [234, 138, 0],
      "완료": [22, 163, 74],
    };

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const details = [
      `위치: ${item.location}`,
      `점검 항목: ${item.guide}`,
      `긴급여부: ${item.isUrgent ? "긴급" : "일반"}`,
      `사진: ${item.photoCount}장`,
    ];
    for (const line of details) {
      checkPage(6);
      doc.text(line, margin + 3, y);
      y += 5;
    }

    // Status badge
    checkPage(8);
    const color = statusColors[item.status] || [100, 100, 100];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(9);
    doc.text(`처리상태: ${item.status}`, margin + 3, y);
    y += 7;

    // Divider between items
    if (i < items.length - 1) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageW - margin, y);
      y += 6;
    }
  }

  drawFooter(doc, margin, pageW, y, checkPage);
  doc.save(fileName);
}

// --- Shared helpers ---

function formatDateTime(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatFileDate(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function drawHeader(doc: jsPDF, pageW: number, title: string, subtitle: string) {
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageW, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(title, pageW / 2, 16, { align: "center" });
  doc.setFontSize(10);
  doc.text(subtitle, pageW / 2, 28, { align: "center" });
}

function drawInfoSection(doc: jsPDF, margin: number, pageW: number, y: number, lines: string[][]) {
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  for (const [left, right] of lines) {
    doc.text(left, margin, y);
    if (right) doc.text(right, pageW / 2 + 10, y);
    y += 6;
  }
}

function drawDivider(doc: jsPDF, margin: number, pageW: number, y: number) {
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
}

function drawDefectItem(doc: jsPDF, item: DefectPdfItem, idx: number, margin: number, contentW: number, pageW: number, y: number, checkPage: (n: number) => void): number {
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentW, 8, 1, 1, "F");
  doc.setFontSize(11);
  doc.setTextColor(59, 130, 246);
  doc.text(`하자 항목 ${idx + 1}`, margin + 3, y + 5.5);
  if (item.isUrgent) {
    doc.setTextColor(220, 38, 38);
    doc.text("긴급", pageW - margin - 3, y + 5.5, { align: "right" });
  }
  y += 12;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  for (const line of [`위치: ${item.location}`, `카테고리: ${item.midCategory}`, `점검 항목: ${item.guideItems.join(", ")}`, `긴급여부: ${item.isUrgent ? "긴급" : "일반"}`]) {
    checkPage(6); doc.text(line, margin + 3, y); y += 5;
  }

  if (item.photoDataUrls.length > 0) {
    checkPage(30);
    doc.text("첨부 사진:", margin + 3, y); y += 4;
    let x = margin + 3;
    for (const dataUrl of item.photoDataUrls) {
      if (x + 26 > pageW - margin) { x = margin + 3; y += 28; checkPage(30); }
      try { doc.addImage(dataUrl, "JPEG", x, y, 25, 25); } catch { /* skip */ }
      x += 28;
    }
    y += 28;
  }
  y += 2;
  return y;
}

function drawFooter(doc: jsPDF, margin: number, pageW: number, y: number, checkPage: (n: number) => void) {
  checkPage(20);
  y += 6;
  drawDivider(doc, margin, pageW, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("* 본 확인서는 하자 접수 증빙용 서류입니다.", margin, y);
  y += 5;
  doc.text("입주ON 입주지원센터", pageW / 2, y, { align: "center" });
}
