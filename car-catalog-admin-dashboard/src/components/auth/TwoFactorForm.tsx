import React, { useState } from 'react';
import { Button, Input } from '@/components/common';

interface TwoFactorFormData {
  code: string;
}

interface TwoFactorFormProps {
  email: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
  loading?: boolean;
}

const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
  email,
  onSubmit,
  onBack,
  loading = false
}) => {
  const [formData, setFormData] = useState<TwoFactorFormData>({
    code: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.code);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Two-Factor Authentication
      </h2>
      
      <p className="text-gray-600 text-center mb-6">
        We've sent a verification code to {email}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="code"
          placeholder="Enter 6-digit code"
          value={formData.code}
          onChange={handleChange}
          maxLength={6}
          className="text-center text-xl tracking-widest"
          required
        />

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={loading}
            className="flex-1"
          >
            Back
          </Button>
          
          <Button
            type="submit"
            disabled={loading || formData.code.length !== 6}
            className="flex-1"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 text-sm"
          onClick={() => {/* Implementar reenvío de código */}}
        >
          Didn't receive the code? Resend
        </button>
      </div>
    </div>
  );
};

export default TwoFactorForm;