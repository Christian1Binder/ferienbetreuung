import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export function Welcome() {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const [name, setName] = useState('');
  const [facility, setFacility] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name, facility);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg border-t-4 border-t-awo-red">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-awo-red rounded-lg mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 tracking-tighter">AWO</div>
          <h1 className="text-2xl font-bold text-gray-900">Willkommen</h1>
          <p className="text-gray-600 mt-2">Bitte geben Sie Ihre Daten ein, um die Schulung zu beginnen.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Ihr Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vorname Nachname"
            required
          />
          <Input
            label="Einrichtung (optional)"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            placeholder="z.B. AWO Hort Nürnberg"
          />

          <Button type="submit" className="w-full" size="lg">
            Starten
          </Button>
        </form>

        <div className="mt-8 text-center border-t pt-4 text-sm text-gray-500">
          <Link to="/admin/login" className="hover:text-awo-red hover:underline transition-colors">
            Admin Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
