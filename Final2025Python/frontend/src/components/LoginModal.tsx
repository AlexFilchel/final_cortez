import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './LoginModal.module.css';

interface Props {
  onClose: () => void;
}

function LoginModal({ onClose }: Props) {
  const { loginWithId, loginWithEmail, loading, error } = useAuth();
  const [mode, setMode] = useState<'id' | 'email'>('email');
  const [form, setForm] = useState({
    id: '',
    name: '',
    lastname: '',
    email: '',
    telephone: '',
  });
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    try {
      if (mode === 'id') {
        await loginWithId(Number(form.id));
        setFeedback('Sesión iniciada con tu ID de cliente');
      } else {
        await loginWithEmail({
          name: form.name,
          lastname: form.lastname,
          email: form.email,
          telephone: form.telephone,
        });
        setFeedback('Listo, ya puedes comprar con tu cuenta');
      }
      setTimeout(onClose, 600);
    } catch (err) {
      setFeedback('No pudimos validar tus datos');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Tu cuenta</h3>
          <button onClick={onClose} aria-label="Cerrar" className={styles.close}>
            ×
          </button>
        </div>

        <div className={styles.toggle}>
          <button className={mode === 'email' ? styles.active : ''} onClick={() => setMode('email')}>
            Nuevo o por correo
          </button>
          <button className={mode === 'id' ? styles.active : ''} onClick={() => setMode('id')}>
            Ya tengo ID
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'id' ? (
            <input
              type="number"
              placeholder="ID de cliente"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              required
            />
          ) : (
            <>
              <div className={styles.inline}>
                <input
                  placeholder="Nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  placeholder="Apellido"
                  value={form.lastname}
                  onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                placeholder="Teléfono +52 5512345678"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                required
              />
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}
          {feedback && <p className={styles.success}>{feedback}</p>}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
