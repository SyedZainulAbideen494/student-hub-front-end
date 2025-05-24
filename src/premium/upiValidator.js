import React, { useState } from 'react';
import axios from 'axios';

export default function ValidateVPA() {
  const [vpa, setVpa] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!vpa) {
      alert('Please enter a VPA');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data } = await axios.post('http://localhost:8080/validate-vpa', { vpa });
      setResult(data);
    } catch (err) {
      setResult({ error: 'Validation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Validate UPI VPA</h2>
      <input
        type="text"
        placeholder="Enter VPA (e.g. gauravkumar@upi)"
        value={vpa}
        onChange={(e) => setVpa(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />
      <button onClick={handleValidate} disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Validating...' : 'Validate'}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          {result.error && <p style={{ color: 'red' }}>Error: {result.error}</p>}
          {result.vpa && (
            <p>
              VPA <b>{result.vpa}</b> is <b>{result.valid ? 'valid ✅' : 'invalid ❌'}</b>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
