// Hook and Haul demo: receives answers from the demo page and writes them to this Google Sheet.
// One row per person. If the same person saves again, their row is updated, not duplicated.
// Setup steps are in README.md.

const SHEET_NAME = 'Answers';
const MAX_COLUMNS = 200;
const MAX_CELL_LENGTH = 5000;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!data.responseId) return reply({ ok: false, error: 'missing responseId' });

    const answers = flatten(data);
    answers.receivedAt = new Date().toISOString();

    const sheet = getSheet();
    let header = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : ['receivedAt', 'responseId'];
    Object.keys(answers).forEach(function (key) {
      if (header.indexOf(key) < 0 && header.length < MAX_COLUMNS) header.push(key);
    });
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    sheet.setFrozenRows(1);

    const row = header.map(function (key) {
      return answers[key] === undefined ? '' : String(answers[key]).slice(0, MAX_CELL_LENGTH);
    });

    const lastRow = sheet.getLastRow();
    const idColumn = header.indexOf('responseId') + 1;
    let targetRow = lastRow + 1;
    if (lastRow > 1) {
      const ids = sheet.getRange(2, idColumn, lastRow - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (ids[i][0] === answers.responseId) { targetRow = i + 2; break; }
      }
    }
    sheet.getRange(targetRow, 1, 1, header.length).setValues([row]);
    return reply({ ok: true, row: targetRow });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return reply({ ok: true, service: 'Hook and Haul answers' });
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
}

// {features: {plan: 'Need it'}} becomes {'features.plan': 'Need it'}
function flatten(value, prefix, out) {
  out = out || {};
  Object.keys(value).forEach(function (key) {
    const item = value[key];
    const name = prefix ? prefix + '.' + key : key;
    if (item && typeof item === 'object' && !Array.isArray(item)) flatten(item, name, out);
    else if (item !== undefined && item !== null && item !== '') out[name] = item;
  });
  return out;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
