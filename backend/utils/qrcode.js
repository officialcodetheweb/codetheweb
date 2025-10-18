const QRCode = require('qrcode');
async function generateDataUri(text) { return QRCode.toDataURL(text, { errorCorrectionLevel: 'H' }); }
module.exports = { generateDataUri };
