import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPOC.css';

type Tier = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Basic access with limited features',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 100,
    description: 'Full access for individuals',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 200,
    description: 'Advanced features for teams',
  },
];

const PaymentPOC = () => {
  const navigate = useNavigate();

  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'success' | 'cancelled' | 'error'
  >('idle');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.payhere) return;

    window.payhere.onCompleted = function (orderId: string) {
      console.log('Payment completed:', orderId);
      setPaymentStatus('success');
      setIsLoading(false);
    };

    window.payhere.onDismissed = function () {
      console.log('Payment dismissed');
      setPaymentStatus('cancelled');
      setIsLoading(false);
    };

    window.payhere.onError = function (error: string) {
      console.error('PayHere error:', error);
      setPaymentStatus('error');
      setIsLoading(false);
    };
  }, []);

  const startPayment = async (tier: Tier) => {
    if (tier.price === 0) return;

    setIsLoading(true);
    setPaymentStatus('idle');

    const orderId = `POC_${tier.id}_${Date.now()}`;
    const amount = tier.price.toFixed(2);
    const currency = 'LKR';

    try {
      const response = await fetch('http://localhost:5000/payhere-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          amount,
          currency,
        }),
      });

      const { hash } = await response.json();

      const payment = {
        sandbox: true,
        merchant_id: '1233563',
        return_url: 'http://localhost:3000/poc/payment-success',
        cancel_url: 'http://localhost:3000/poc/payment-cancel',
        notify_url: 'http://localhost:5000/payhere-notify',

        order_id: orderId,
        items: `${tier.name} Subscription`,
        amount,
        currency,
        hash,

        first_name: 'Test',
        last_name: 'User',
        email: 'test@test.com',
        phone: '0771234567',
        address: 'Colombo',
        city: 'Colombo',
        country: 'Sri Lanka',
      };

      window.payhere.startPayment(payment);
    } catch (err) {
      console.error(err);
      setPaymentStatus('error');
      setIsLoading(false);
    }
  };

  return (
    <div className="poc-page">
      <header className="poc-page-header">
        <button className="back-button" onClick={() => navigate('/poc-hub')}>
          ← Back to POC Hub
        </button>
        <h1>Payment POC (PayHere Sandbox)</h1>
        <p className="page-subtitle">
          Test subscription payments using PayHere sandbox
        </p>
      </header>

      <div className="poc-content">
        <div className="tiers-grid">
          {TIERS.map((tier) => (
            <div key={tier.id} className="tier-card">
              <h2>{tier.name}</h2>
              <p className="tier-price">
                {tier.price === 0 ? 'Free' : `$${tier.price}`}
              </p>
              <p className="tier-description">{tier.description}</p>

              {tier.price === 0 ? (
                <button className="tier-button disabled">
                  Current Plan
                </button>
              ) : (
                <button
                  className="tier-button"
                  disabled={isLoading}
                  onClick={() => startPayment(tier)}
                >
                  {isLoading ? 'Processing…' : 'Buy Now'}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="payment-status">
          {paymentStatus === 'success' && (
            <p className="status success">
              Payment completed successfully.
            </p>
          )}
          {paymentStatus === 'cancelled' && (
            <p className="status cancelled">
              Payment was cancelled.
            </p>
          )}
          {paymentStatus === 'error' && (
            <p className="status error">
              Payment failed. Check console logs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPOC;
