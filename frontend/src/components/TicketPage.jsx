import React from 'react';
export default function TicketPage({ registrant }) {
  if (!registrant) return null;
  return (
    <div>
      <h2>Registration Successful</h2>
      <p>{registrant.full_name}</p>
      <p>Registration ID: {registrant.registration_id}</p>
      {registrant.qr_code && <div><img src={registrant.qr_code} alt="QR" style={{width:200}}/></div>}
      <p>Show this QR at the venue for check-in.</p>
    </div>
  );
}
