/**
 * Medical360 Export & Print Service
 * Provides PDF export, print preview formatting, and CSV downloading.
 */

export interface ExportColumn {
  header: string;
  key: string;
  format?: (value: any, row: any) => string;
}

/**
 * Opens a styled Medical360 print preview window for instantaneous printing or Saving as PDF.
 */
export function printOrExportPdf(
  reportTitle: string,
  columns: ExportColumn[],
  data: any[],
  subtitle?: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print or export PDF.');
    return;
  }

  const generatedDate = new Date().toLocaleString();
  const rowCount = data.length;

  const tableHeaders = columns
    .map((col) => `<th style="padding: 10px 12px; text-align: left; background: #065f46; color: #ffffff; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #047857;">${col.header}</th>`)
    .join('');

  const tableRows = data
    .map((row, idx) => {
      const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const cells = columns
        .map((col) => {
          let val = row[col.key];
          if (col.format) {
            val = col.format(val, row);
          } else if (val === null || val === undefined) {
            val = '—';
          } else if (typeof val === 'object') {
            val = JSON.stringify(val);
          }
          return `<td style="padding: 9px 12px; font-size: 12px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${val}</td>`;
        })
        .join('');
      return `<tr style="background: ${bg};">${cells}</tr>`;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle} - Medical360 Export</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm;
          }
          * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          body {
            margin: 0;
            padding: 20px;
            color: #0f172a;
            background: #ffffff;
            font-size: 12px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #065f46;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .logo {
            display: flex;
            align-items: center;
          }
          .logo img {
            height: 48px;
            width: auto;
            object-fit: contain;
          }
          .meta {
            text-align: right;
            font-size: 11px;
            color: #64748b;
          }
          .title-section {
            margin-bottom: 16px;
          }
          .title-section h1 {
            margin: 0 0 4px 0;
            font-size: 20px;
            color: #0f172a;
          }
          .title-section p {
            margin: 0;
            color: #64748b;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .footer {
            margin-top: 24px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #94a3b8;
          }
          @media print {
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; font-size: 13px;">Print Preview • ${rowCount} record(s)</span>
          <div>
            <button onclick="window.print()" style="background: #065f46; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; margin-right: 8px;">
              🖨️ Print / Save as PDF
            </button>
            <button onclick="window.close()" style="background: #e2e8f0; color: #334155; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">
              Close
            </button>
          </div>
        </div>

        <div class="header">
          <div class="logo">
            <img src="/assets/logo.png" alt="Medical 360" />
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${generatedDate}</div>
            <div><strong>Total Records:</strong> ${rowCount}</div>
          </div>
        </div>

        <div class="title-section">
          <h1>${reportTitle}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>

        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <div>Medical360 Healthcare Concierge • Mauritius • Confidential Clinical Document</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          // Automatically trigger print on window load
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Exports data to a standard comma-separated values (.CSV) spreadsheet.
 */
export function exportToCsv(
  filename: string,
  columns: ExportColumn[],
  data: any[]
) {
  if (data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headerLine = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(',');

  const rows = data.map((row) => {
    return columns
      .map((col) => {
        let val = row[col.key];
        if (col.format) {
          val = col.format(val, row);
        } else if (val === null || val === undefined) {
          val = '';
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const csvContent = '\uFEFF' + [headerLine, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convenience helper to export patient inquiries list to CSV spreadsheet.
 */
export function exportInquiriesToCsv(inquiries: any[], specialties: any[] = []) {
  const getSpecialtyName = (id: string) => specialties.find((s: any) => s.id === id)?.name || id;
  const columns: ExportColumn[] = [
    { header: 'Patient Name', key: 'firstName', format: (_, r) => `${r.firstName} ${r.lastName}` },
    { header: 'Specialty', key: 'specialtyId', format: (val) => getSpecialtyName(val) },
    { header: 'Service', key: 'serviceName' },
    { header: 'Urgency', key: 'urgency', format: (val) => String(val).toUpperCase() },
    { header: 'Status', key: 'status', format: (val) => String(val).replace(/_/g, ' ') },
    { header: 'Country', key: 'countryOfResidence' },
    { header: 'Phone', key: 'phone' },
    { header: 'Email', key: 'email' },
    { header: 'Created', key: 'createdAt' },
  ];
  exportToCsv('medical360_inquiries_report', columns, inquiries);
}

/**
 * Convenience helper to print or save a formatted PDF report of patient inquiries.
 */
export function printInquiriesPdf(inquiries: any[], specialties: any[] = []) {
  const getSpecialtyName = (id: string) => specialties.find((s: any) => s.id === id)?.name || id;
  const columns: ExportColumn[] = [
    { header: 'Patient', key: 'firstName', format: (_, r) => `${r.firstName} ${r.lastName}` },
    { header: 'Specialty', key: 'specialtyId', format: (val) => getSpecialtyName(val) },
    { header: 'Urgency', key: 'urgency', format: (val) => String(val).toUpperCase() },
    { header: 'Status', key: 'status', format: (val) => String(val).replace(/_/g, ' ') },
    { header: 'Country', key: 'countryOfResidence' },
    { header: 'Phone', key: 'phone' },
    { header: 'Received', key: 'createdAt', format: (val) => new Date(val).toLocaleDateString() },
  ];
  printOrExportPdf(
    'Medical 360 — Patient Inquiries Report',
    columns,
    inquiries,
    `Total Inquiries: ${inquiries.length} · Clinical Concierge Export`
  );
}

/**
 * Convenience helper to print or save a single inquiry dossier PDF.
 */
export function printInquiryPdf(inquiry: any, specialtyName?: string) {
  const columns: ExportColumn[] = [
    { header: 'Field', key: 'label' },
    { header: 'Details', key: 'value' },
  ];
  const data = [
    { label: 'Patient Name', value: `${inquiry.firstName} ${inquiry.lastName}` },
    { label: 'Email', value: inquiry.email },
    { label: 'Phone', value: inquiry.phone },
    { label: 'Country of Residence', value: inquiry.countryOfResidence },
    { label: 'Specialty Requested', value: specialtyName || inquiry.specialtyId },
    { label: 'Service / Procedure', value: inquiry.serviceName || 'General Consultation' },
    { label: 'Urgency Level', value: String(inquiry.urgency).toUpperCase() },
    { label: 'Current Status', value: String(inquiry.status).replace(/_/g, ' ').toUpperCase() },
    { label: 'Preferred Destination', value: inquiry.preferredCountry || 'Any' },
    { label: 'Clinical Description', value: inquiry.description || '—' },
    { label: 'Submission Timestamp', value: new Date(inquiry.createdAt).toLocaleString() },
  ];
  printOrExportPdf(
    `Patient Dossier — ${inquiry.firstName} ${inquiry.lastName}`,
    columns,
    data,
    `Inquiry ID: ${inquiry.id}`
  );
}
