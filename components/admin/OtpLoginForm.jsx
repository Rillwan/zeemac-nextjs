'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OtpLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cooldown, setCooldown] = useState(0); // seconds remaining

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function requestOtp(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setStep('otp');
        setInfo(data.devOtp ? `Dev mode — OTP: ${data.devOtp}` : 'Check your email for the code.');
        setCooldown(30);
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Incorrect code');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card w-full max-w-sm">
      <h1 className="text-xl font-extrabold text-brand-navy mb-1">Zeemac Admin</h1>
      <p className="text-sm text-slate-500 mb-6">
        {step === 'email' ? 'Sign in with your admin email' : `Enter the code sent to ${email}`}
      </p>

      {step === 'email' ? (
        <form onSubmit={requestOtp} className="space-y-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="admin@zeemacgroup.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send code'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <input
            type="text"
            name="otp"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm tracking-[0.3em] text-center focus:outline-none focus:border-brand"
          />
          {info && <p className="text-brand text-sm">{info}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? 'Verifying…' : 'Verify & sign in'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('email'); setOtp(''); setError(''); setInfo(''); }}
            className="text-xs text-slate-400 hover:text-brand w-full text-center"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
