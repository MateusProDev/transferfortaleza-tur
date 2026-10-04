import { google } from 'googleapis';

const SHEET_NAME = 'Leads';
const HEADER_ROW = [
  'Data',
  'Código',
  'Status',
  'GCLID',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Content',
  'UTM Term',
  'Landing Page',
  'Atualizado em',
  'Observação',
];

function getSheetClient() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = normalizePrivateKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY);
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    return null;
  }

  return google.sheets({
    version: 'v4',
    auth: new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    }),
  });
}
function normalizePrivateKey(value?: string) {
  if (!value) return undefined;

  let normalized = value.trim();

  try {
    const parsed = JSON.parse(normalized);
    if (typeof parsed === 'string') normalized = parsed;
    else if (parsed && typeof parsed.private_key === 'string') {
      normalized = parsed.private_key;
    }
  } catch {
    // The environment variable may contain only the PEM value.
  }

  normalized = normalized.replace(/^['"]|['"]$/g, '');
  normalized = normalized.replace(/\\n/g, '\n').replace(/\\r/g, '');

  return normalized.includes('-----BEGIN PRIVATE KEY-----')
    ? normalized
    : undefined;
}

export async function ensureHeaders() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) return;

    const sheets = getSheetClient();
    if (!sheets) {
      console.warn('[sheets] Credenciais do Google Sheets ausentes.');
      return;
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!1:1`,
    });

    const existingHeader = response.data.values?.[0] ?? [];

    if (!existingHeader.length || existingHeader.join('|') !== HEADER_ROW.join('|')) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:L1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [HEADER_ROW],
        },
      });
    }
  } catch (error) {
    console.error('[sheets] ensureHeaders error:', error);
  }
}

export async function appendLead(lead: Record<string, any>) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) return;

    const sheets = getSheetClient();
    if (!sheets) {
      console.warn('[sheets] Credenciais do Google Sheets ausentes.');
      return;
    }

    await ensureHeaders();

    const row = leadToRow(lead);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:L`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });
  } catch (error) {
    console.error('[sheets] appendLead error:', error);
  }
}

function leadToRow(lead: Record<string, any>) {
  return [
    lead.createdAt || new Date().toISOString(),
    lead.code || '',
    lead.status || 'visitou',
    lead.gclid || '',
    lead.utms?.utm_source || '',
    lead.utms?.utm_medium || '',
    lead.utms?.utm_campaign || '',
    lead.utms?.utm_content || '',
    lead.utms?.utm_term || '',
    lead.landingPage || '',
    lead.status_updated_at || lead.createdAt || new Date().toISOString(),
    lead.observacao || '',
  ];
}

export async function syncMissingLeads(leads: Record<string, any>[]) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheets = getSheetClient();

  if (!spreadsheetId || !sheets) {
    throw new Error('Credenciais do Google Sheets ausentes');
  }

  await ensureHeaders();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:L`,
  });
  const existingCodes = new Set(
    (response.data.values ?? [])
      .slice(1)
      .map((row) => String(row[1] || '').trim())
      .filter(Boolean)
  );
  const missingLeads = leads.filter((lead) => {
    const code = String(lead.code || '').trim();
    return code && !existingCodes.has(code);
  });

  if (missingLeads.length) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:L`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: missingLeads.map(leadToRow),
      },
    });
  }

  return {
    found: leads.length,
    inserted: missingLeads.length,
  };
}

export async function updateLeadStatus(code: string, status: string, updatedAt: string, observacao?: string) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId || !code) return;

    const sheets = getSheetClient();
    if (!sheets) {
      console.warn('[sheets] Credenciais do Google Sheets ausentes.');
      return;
    }

    await ensureHeaders();

    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:L`,
    });

    const rows = (readResponse.data.values ?? []) as string[][];
    if (!rows.length) return;

    const header = rows[0].map((cell: string) => String(cell).trim().toLowerCase());
    const codeIndex = header.indexOf('código');
    if (codeIndex === -1) return;

    const rowIndex = rows.findIndex((row: string[], idx: number) => {
      if (idx === 0) return false;
      return String(row[codeIndex] || '').trim() === String(code).trim();
    });

    if (rowIndex === -1) return;

    const targetRow = rows[rowIndex];
    const statusIndex = header.indexOf('status');
    const updatedAtIndex = header.indexOf('atualizado em');
    const observationIndex = header.indexOf('observação');

    if (statusIndex !== -1) targetRow[statusIndex] = status;
    if (updatedAtIndex !== -1) targetRow[updatedAtIndex] = updatedAt;
    if (observationIndex !== -1) targetRow[observationIndex] = observacao || targetRow[observationIndex] || '';

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A${rowIndex + 1}:L${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [targetRow],
      },
    });
  } catch (error) {
    console.error('[sheets] updateLeadStatus error:', error);
  }
}
