import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

function formatDateTime(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatFileDate(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    "미배정": "#3B82F6",
    "접수완료": "#3B82F6",
    "처리중": "#EA8A00",
    "완료": "#16A34A",
  };
  return colors[status] || "#666";
}

async function renderHtmlToPdf(html: string, fileName: string): Promise<void> {
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed; left: -9999px; top: 0;
    width: 794px;
    font-family: 'Noto Sans KR', sans-serif;
    background: #fff; color: #333;
    padding: 0; margin: 0;
  `;
  container.innerHTML = html;
  document.body.appendChild(container);

  // Wait for fonts & images to load
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 300));

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ format: "a4", orientation: "portrait", unit: "mm" });
    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

function buildDefectPdfHtml(options: DefectPdfOptions): string {
  const { complexName, unitNumber, residentName, receiptNo, items } = options;
  const dateStr = formatDateTime(new Date());

  const itemsHtml = items.map((item, i) => {
    const photosHtml = item.photoDataUrls.length > 0
      ? `<div style="margin-top:8px;"><span style="font-size:12px;color:#555;">첨부 사진:</span>
         <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;">
           ${item.photoDataUrls.map(url => `<img src="${url}" style="width:100px;height:100px;object-fit:cover;border-radius:6px;border:1px solid #ddd;" />`).join("")}
         </div></div>`
      : "";

    return `
      <div style="background:#F5F7FA;border-radius:6px;padding:10px 14px;margin-bottom:4px;">
        <span style="font-size:14px;font-weight:700;color:#3B82F6;">하자 항목 ${i + 1}</span>
        ${item.isUrgent ? '<span style="float:right;color:#DC2626;font-weight:700;font-size:13px;">🚨 긴급</span>' : ""}
      </div>
      <div style="padding:6px 14px 14px;font-size:12px;line-height:1.8;color:#555;">
        <div>위치: ${item.location}</div>
        <div>카테고리: ${item.midCategory}</div>
        <div>점검 항목: ${item.guideItems.join(", ")}</div>
        <div>긴급여부: ${item.isUrgent ? "긴급" : "일반"}</div>
        ${photosHtml}
      </div>
    `;
  }).join('<hr style="border:none;border-top:1px solid #E5E7EB;margin:8px 0;" />');

  return `
    <div style="background:#3B82F6;color:#fff;text-align:center;padding:20px 0 16px;">
      <div style="font-size:22px;font-weight:700;">입주ON 하자 접수 확인서</div>
      <div style="font-size:12px;margin-top:6px;">접수번호: ${receiptNo}</div>
    </div>
    <div style="padding:16px 20px;font-size:12px;line-height:2;color:#444;">
      <div style="display:flex;justify-content:space-between;"><span>단지명: ${complexName}</span><span>접수일시: ${dateStr}</span></div>
      <div style="display:flex;justify-content:space-between;"><span>동·호수: ${unitNumber}</span><span>입주민: ${residentName}</span></div>
    </div>
    <hr style="border:none;border-top:1px solid #ccc;margin:0 20px;" />
    <div style="padding:12px 20px;">
      ${itemsHtml}
    </div>
    <hr style="border:none;border-top:1px solid #ccc;margin:0 20px;" />
    <div style="padding:12px 20px;font-size:10px;color:#999;text-align:center;line-height:1.8;">
      <div>* 본 확인서는 하자 접수 증빙용 서류입니다.</div>
      <div>입주ON 입주지원센터</div>
    </div>
  `;
}

function buildDefectListPdfHtml(options: DefectListPdfOptions): string {
  const { complexName, unitNumber, residentName, items } = options;
  const dateStr = formatDateTime(new Date());

  const itemsHtml = items.map((item, i) => `
    <div style="background:#F5F7FA;border-radius:6px;padding:10px 14px;margin-bottom:4px;">
      <span style="font-size:14px;font-weight:700;color:#3B82F6;">접수번호: ${item.receiptNo}</span>
      ${item.isUrgent ? '<span style="float:right;color:#DC2626;font-weight:700;font-size:13px;">🚨 긴급</span>' : ""}
    </div>
    <div style="padding:6px 14px 14px;font-size:12px;line-height:1.8;color:#555;">
      <div>위치: ${item.location}</div>
      <div>점검 항목: ${item.guide}</div>
      <div>긴급여부: ${item.isUrgent ? "긴급" : "일반"}</div>
      <div>사진: ${item.photoCount}장</div>
      <div style="color:${getStatusColor(item.status)};font-weight:600;">처리상태: ${item.status}</div>
    </div>
    ${i < items.length - 1 ? '<hr style="border:none;border-top:1px solid #E5E7EB;margin:8px 0;" />' : ""}
  `).join("");

  return `
    <div style="background:#3B82F6;color:#fff;text-align:center;padding:20px 0 16px;">
      <div style="font-size:22px;font-weight:700;">입주ON 하자 접수 전체 내역서</div>
      <div style="font-size:12px;margin-top:6px;">총 ${items.length}건</div>
    </div>
    <div style="padding:16px 20px;font-size:12px;line-height:2;color:#444;">
      <div style="display:flex;justify-content:space-between;"><span>단지명: ${complexName}</span><span>출력일시: ${dateStr}</span></div>
      <div style="display:flex;justify-content:space-between;"><span>동·호수: ${unitNumber}</span><span>입주민: ${residentName}</span></div>
      <div>총 접수건수: ${items.length}건</div>
    </div>
    <hr style="border:none;border-top:1px solid #ccc;margin:0 20px;" />
    <div style="padding:12px 20px;">
      ${itemsHtml}
    </div>
    <hr style="border:none;border-top:1px solid #ccc;margin:0 20px;" />
    <div style="padding:12px 20px;font-size:10px;color:#999;text-align:center;line-height:1.8;">
      <div>* 본 확인서는 하자 접수 증빙용 서류입니다.</div>
      <div>입주ON 입주지원센터</div>
    </div>
  `;
}

export async function generateDefectPdf(options: DefectPdfOptions): Promise<void> {
  const now = new Date();
  const fileDate = formatFileDate(now);
  const fileName = `하자접수_${options.unitNumber.replace(/\s/g, "")}_${fileDate}.pdf`;
  const html = buildDefectPdfHtml(options);
  await renderHtmlToPdf(html, fileName);
}

export async function generateDefectListPdf(options: DefectListPdfOptions): Promise<void> {
  const now = new Date();
  const fileDate = formatFileDate(now);
  const fileName = `하자접수내역_${options.unitNumber.replace(/\s/g, "")}_${fileDate}.pdf`;
  const html = buildDefectListPdfHtml(options);
  await renderHtmlToPdf(html, fileName);
}
