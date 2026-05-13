import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const data = await register(form);
      if (data.success) {
        navigate('/');
      } else {
        setErrors(data.errors?.length ? data.errors : [data.message || 'Registration failed']);
      }
    } catch {
      setErrors(['Something went wrong. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join SpotPark today</p>

        {errors.length > 0 && (
          <div className="alert alert-error">
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Jan"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Kowalski"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
