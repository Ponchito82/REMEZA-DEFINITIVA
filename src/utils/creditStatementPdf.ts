/**
 * Estado de cuenta en PDF, formal: logo, REMEZA y lineas delgadas en morado; el resto en negro. Se arma a mano (PDF 1.4 con
 * Inter incrustada, la misma tipografia de la app) para no depender de un modulo nativo; se entrega en base64.
 */
import { buildStatementLines } from "./creditStatements";
import type { CreditStatement } from "./creditStatements";
import type { Language } from "../types/app";
import { remezaGlyph } from "../components/ui/remezaGlyph";
import { pdfFonts } from "./pdfFontData";

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 40;
const BANK_ADDRESS = ["101 Eisenhower Parkway", "Roseland, NJ 07068", "New Jersey"];
type PdfColor = number | [number, number, number];
const PURPLE: PdfColor = [0.255, 0.078, 0.843];
const fillOp = (c: PdfColor) => (typeof c === "number" ? `${c} g` : `${c.join(" ")} rg`);
const DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS: Record<Language, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

const money = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const longDate = (ms: number, language: Language) => {
  const d = new Date(ms);
  return `${d.getDate()} ${MONTHS[language][d.getMonth()]} ${d.getFullYear()}`;
};

const shortDate = (ms: number, language: Language) => {
  const d = new Date(ms);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[language][d.getMonth()]}`;
};

type Weight = boolean | "semibold";
const weightKey = (w: Weight) => (w === "semibold" ? "semibold" : w ? "bold" : "regular");
const fontRef = { regular: "F1", bold: "F2", semibold: "F3" } as const;

/** Ancho real del texto en Inter (widths por 1000 em, codigos 32-255). */
function textWidth(text: string, size: number, weight: Weight, spacing = 0): number {
  const w = pdfFonts[weightKey(weight)].widths;
  let total = 0;
  for (const ch of text) total += (w[ch.charCodeAt(0) - 32] ?? 556) * size / 1000 + spacing;
  return total;
}

function binaryFromBase64(b64: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const lookup: Record<string, number> = {};
  for (let i = 0; i < 64; i++) lookup[chars[i]] = i;
  let out = "";
  for (let i = 0; i < b64.length; i += 4) {
    const a = lookup[b64[i]], b = lookup[b64[i + 1]];
    const c = lookup[b64[i + 2]], d = lookup[b64[i + 3]];
    out += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== undefined) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d !== undefined) out += String.fromCharCode(((c & 3) << 6) | d);
  }
  return out;
}

/** Escapa un texto para una cadena literal PDF y lo pasa a WinAnsi (acentos y n). */
function pdfString(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (ch === "(" || ch === ")" || ch === "\\") out += `\\${ch}`;
    else if (code < 32) out += " ";
    else if (code < 256) out += ch;
    else out += "?";
  }
  return out;
}

function base64FromBinary(binary: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  for (let i = 0; i < binary.length; i += 3) {
    const a = binary.charCodeAt(i);
    const b = i + 1 < binary.length ? binary.charCodeAt(i + 1) : 0;
    const c = i + 2 < binary.length ? binary.charCodeAt(i + 2) : 0;
    out += chars[a >> 2] + chars[((a & 3) << 4) | (b >> 4)];
    out += i + 1 < binary.length ? chars[((b & 15) << 2) | (c >> 6)] : "=";
    out += i + 2 < binary.length ? chars[c & 63] : "=";
  }
  return out;
}

class PageWriter {
  private ops: string[] = [];
  /** Coordenada Y medida desde arriba de la pagina. */
  y = MARGIN;

  text(x: number, y: number, value: string, size = 10, bold: Weight = false, gray: PdfColor = 0, spacing = 0) {
    this.ops.push(
      `BT /${fontRef[weightKey(bold)]} ${size} Tf ${spacing} Tc ${fillOp(gray === PURPLE ? PURPLE : 0)} ${x.toFixed(2)} ${(PAGE_H - y).toFixed(2)} Td (${pdfString(value)}) Tj ET`,
    );
  }

  textRight(xRight: number, y: number, value: string, size = 10, bold: Weight = false, gray: PdfColor = 0) {
    this.text(xRight - textWidth(value, size, bold), y, value, size, bold, gray);
  }

  /** Linea delgada siempre en morado; el gris recibido se ignora. */
  line(x1: number, y1: number, x2: number, y2: number, _gray = 0, width = 0.5) {
    this.ops.push(
      `${(PURPLE as number[]).join(" ")} RG ${Math.min(width, 0.5)} w ${x1.toFixed(2)} ${(PAGE_H - y1).toFixed(2)} m ${x2.toFixed(2)} ${(PAGE_H - y2).toFixed(2)} l S`,
    );
  }

  rect(x: number, y: number, w: number, h: number, fillGray: number) {
    // Sin relleno: el encabezado de la tabla se delimita con lineas delgadas moradas.
    this.line(x, y, x + w, y);
    this.line(x, y + h, x + w, y + h);
  }

  /** Rellena un path SVG (solo M, C y Z) con el alto dado; (x, y) es la esquina superior izquierda. */
  glyph(d: string, x: number, y: number, height: number, gray: PdfColor) {
    const k = height / remezaGlyph.height;
    const pt = (px: string, py: string) =>
      `${(x + parseFloat(px) * k).toFixed(2)} ${(PAGE_H - (y + parseFloat(py) * k)).toFixed(2)}`;
    const out: string[] = [fillOp(gray)];
    const tokens = d.match(/[MCZ]|-?[0-9.]+/g) ?? [];
    for (let i = 0; i < tokens.length; ) {
      const cmd = tokens[i++];
      if (cmd === "M") {
        out.push(`${pt(tokens[i], tokens[i + 1])} m`);
        i += 2;
      } else if (cmd === "C") {
        out.push(`${pt(tokens[i], tokens[i + 1])} ${pt(tokens[i + 2], tokens[i + 3])} ${pt(tokens[i + 4], tokens[i + 5])} c`);
        i += 6;
      } else if (cmd === "Z") out.push("h");
    }
    out.push("f");
    this.ops.push(out.join(" "));
  }

  content(): string {
    return this.ops.join("\n");
  }
}

type PdfInput = {
  t: any;
  language: Language;
  holderName: string;
  /** Direccion registrada en el KYC, en una sola cadena separada por comas. */
  holderAddress?: string;
  creditLimitUsd: number;
  statement: CreditStatement;
};

/** Devuelve el PDF del estado de cuenta codificado en base64. */
export function buildStatementPdfBase64({ t, language, holderName, holderAddress, creditLimitUsd, statement }: PdfInput): string {
  const pages: PageWriter[] = [];
  let page = new PageWriter();
  pages.push(page);
  const right = PAGE_W - MARGIN;

  // Encabezado
  const logoH = 36;
  page.glyph(remezaGlyph.path, MARGIN, 34, logoH, PURPLE);
  const textX = MARGIN + logoH * (remezaGlyph.width / remezaGlyph.height) + 12;
  page.text(textX, 62, "remeza", 30, true, PURPLE);
  page.text(textX, 76, t.creditStmtDocTitle, 12, "semibold", 0.3);
  page.textRight(right, 54, holderName, 11, true);
  page.textRight(right, 70, "**** 1234", 10, false, 0.35);
  BANK_ADDRESS.forEach((l, i) => page.text(MARGIN, 90 + i * 11, l, 8.5, false, 0.35));
  // Direccion del titular: calle en la primera linea y el resto en la segunda.
  const addr = (holderAddress ?? "").trim();
  if (addr) {
    const cut = addr.indexOf(",");
    const lines = cut > 0 ? [addr.slice(0, cut).trim(), addr.slice(cut + 1).trim()] : [addr];
    lines.forEach((l, i) => page.textRight(right, 86 + i * 11, l, 8.5, false, 0.35));
  }
  page.line(MARGIN, 128, right, 128, 0.2, 1);

  // Datos del periodo
  const available = Math.max(0, creditLimitUsd - statement.closingUsd);
  const dueAt = statement.cutoffAt + 10 * DAY_MS;
  const info: [string, string][] = [
    [t.creditStmtPeriod, `${longDate(statement.periodStartAt, language)} - ${longDate(statement.cutoffAt, language)}`],
    [t.creditStmtCutoff, longDate(statement.cutoffAt, language)],
    [t.creditStmtDueDate, longDate(dueAt, language)],
  ];
  const limits: [string, string][] = [
    [t.creditStmtLimit, money(creditLimitUsd)],
    [t.creditStmtAvailable, money(available)],
    [t.creditStmtRateOrdinary, "0 %"],
    [t.creditStmtRateLate, "0 %"],
  ];
  let y = 150;
  info.forEach(([k, v]) => {
    page.text(MARGIN, y, k, 9, false, 0.4);
    page.text(MARGIN + 120, y, v, 10);
    y += 17;
  });
  let yr = 150;
  const colX = 330;
  limits.forEach(([k, v]) => {
    page.text(colX, yr, k, 8.5, false, 0.4);
    page.textRight(right, yr, v, 9.5, true);
    yr += 17;
  });

  // Resumen
  y = 232;
  page.text(MARGIN, y, t.creditStmtSummary, 12, true);
  page.line(MARGIN, y + 6, right, y + 6, 0.6);
  y += 24;
  const summary: [string, string][] = [
    [`+ ${t.creditStmtOpening}`, money(statement.openingUsd)],
    [`- ${t.creditStmtPayments}`, money(statement.paymentsUsd)],
    [`+ ${t.creditStmtPurchases}`, money(statement.purchasesUsd)],
    [`+ ${t.creditStmtInterest}`, money(0)],
    [`+ ${t.creditStmtServiceFee}`, money(statement.feesUsd)],
  ];
  summary.forEach(([k, v]) => {
    page.text(MARGIN, y, k, 10);
    page.textRight(right, y, v, 10);
    y += 16;
  });
  page.line(MARGIN, y - 6, right, y - 6, 0.3, 0.8);
  y += 6;
  page.text(MARGIN, y, t.creditStmtClosing, 11, true);
  page.textRight(right, y, money(statement.closingUsd), 11, true);

  // Movimientos
  y += 34;
  page.text(MARGIN, y, t.creditStmtMovements, 12, true);
  y += 12;
  const cols = { date: MARGIN + 6, card: MARGIN + 62, name: MARGIN + 112, charge: right - 70, credit: right - 6 };
  const drawHead = (p: PageWriter, top: number) => {
    p.rect(MARGIN, top - 12, right - MARGIN, 20, 0.92);
    p.text(cols.date, top + 1, t.creditStmtDate, 9, true);
    p.text(cols.card, top + 1, t.creditStmtCard, 9, true);
    p.text(cols.name, top + 1, t.creditStmtMerchant, 9, true);
    p.textRight(cols.charge, top + 1, t.creditStmtCharge, 9, true);
    p.textRight(cols.credit, top + 1, t.creditStmtCredit, 9, true);
  };
  y += 12;
  drawHead(page, y);
  y += 22;
  buildStatementLines(statement).forEach((line) => {
    if (y > PAGE_H - MARGIN - 50) {
      page = new PageWriter();
      pages.push(page);
      y = MARGIN + 24;
      drawHead(page, y);
      y += 22;
    }
    const isFee = line.kind === "fee";
    page.text(cols.date, y, shortDate(line.at, language), 9.5);
    page.text(cols.card, y, "*1234", 9.5);
    page.text(cols.name, y, t[line.nameKey] ?? line.nameKey, 9.5, isFee);
    if (line.kind === "payment") page.textRight(cols.credit, y, `-${money(line.amountUsd)}`, 9.5);
    else page.textRight(cols.charge, y, money(line.amountUsd), 9.5, isFee);
    page.line(MARGIN, y + 6, right, y + 6, 0.88, 0.5);
    y += 19;
  });

  // Nota al pie
  y += 14;
  if (y > PAGE_H - MARGIN - 20) {
    page = new PageWriter();
    pages.push(page);
    y = MARGIN + 24;
  }
  const note = t.creditStmtPdfNote as string;
  // Una sola linea: el cuerpo crece hasta donde cabe en el ancho util.
  const noteSize = Math.min(10, (right - MARGIN) / (note.length * 0.5));
  page.text(MARGIN, y, note, noteSize, false, 0.4);

  // Ensamblado del archivo
  const objects: string[] = [];
  const FIRST_PAGE = 12;
  const pageIds = pages.map((_, i) => FIRST_PAGE + i * 2);
  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`;
  (["regular", "bold", "semibold"] as const).forEach((key, i) => {
    const f = pdfFonts[key];
    const bin = binaryFromBase64(f.b64);
    objects[3 + i] =
      `<< /Type /Font /Subtype /TrueType /BaseFont /${f.name} /Encoding /WinAnsiEncoding /FirstChar 32 /LastChar 255 ` +
      `/Widths [${f.widths.join(" ")}] /FontDescriptor ${6 + i} 0 R >>`;
    objects[6 + i] =
      `<< /Type /FontDescriptor /FontName /${f.name} /Flags 32 /FontBBox [-200 ${f.descent} 1200 ${f.ascent}] /ItalicAngle 0 ` +
      `/Ascent ${f.ascent} /Descent ${f.descent} /CapHeight 727 /StemV 80 /FontFile2 ${9 + i} 0 R >>`;
    objects[9 + i] = `<< /Length ${bin.length} /Length1 ${bin.length} >>
stream
${bin}
endstream`;
  });
  pages.forEach((p, i) => {
    const pageId = FIRST_PAGE + i * 2;
    const content = p.content();
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${pageId + 1} 0 R >>`;
    objects[pageId + 1] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  let file = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = file.length;
    file += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = file.length;
  file += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) {
    file += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  file += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return base64FromBinary(file);
}
