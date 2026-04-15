/** Escape a cell for RFC 4180-style CSV. */
function escCell(cell: string): string {
  return `"${String(cell).replace(/"/g, '""')}"`;
}

/** Trigger a UTF-8 CSV download in the browser. */
export function downloadCsv(filename: string, header: string[], rows: string[][]): void {
  const lines = [header.map(escCell).join(","), ...rows.map((r) => r.map(escCell).join(","))];
  const body = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
