import React, {useState} from 'react';
import RegistrationForm from './components/RegistrationForm';
import TicketPage from './components/TicketPage';
import PaymentButton from './components/PaymentButton';

function App() {
  const [registrant, setRegistrant] = useState(null);
  const [paid, setPaid] = useState(false);

  return (
    <div style={{maxWidth:800, margin:'20px auto', padding:20}}>
      {!registrant && <RegistrationForm onRegistered={r => setRegistrant(r)} />}
      {registrant && !paid && (
        <>
          <h3>Confirm & Pay</h3>
          <p>Name: {registrant.full_name}</p>
          <PaymentButton registrant={registrant} amount={20} onPaid={() => setPaid(true)} />
        </>
      )}
      {registrant && paid && <TicketPage registrant={registrant} />}
    </div>
  );
}

export default App;
