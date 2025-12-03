import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

function AuthModal({ open, onClose }: Props) {
  const { loginOrRegister, loading } = useAuth();
  const [form, setForm] = useState({ name: '', lastname: '', email: '', telephone: '' });
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await loginOrRegister(form);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="auth-modal__backdrop" role="dialog" aria-modal="true">
      <div className="auth-modal">
        <div className="auth-modal__header">
          <h3>Iniciar sesión</h3>
          <button onClick={onClose} aria-label="Cerrar">✖️</button>
        </div>
        <p className="auth-modal__description">
          Usa tu correo para registrar o recuperar tu perfil. Solo necesitas ingresar tus datos una vez.
        </p>
        <form className="auth-modal__form" onSubmit={handleSubmit}>
          <div className="auth-modal__grid">
            <label>
              Nombre
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex"
              />
            </label>
            <label>
              Apellido
              <input
                required
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                placeholder="Gamer"
              />
            </label>
          </div>
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
          </label>
          <label>
            Teléfono
            <input
              required
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              placeholder="+525512345678"
            />
          </label>
          {error && <div className="auth-modal__error">{error}</div>}
          <button type="submit" className="auth-modal__submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
