import { useState, useEffect } from 'react';
import { reservationService } from '../services/reservationService';
import { parkingSpotService } from '../services/parkingSpotService';
import { userService } from '../services/userService';

const STATUS_LABELS = { 0: 'Pending', 1: 'Confirmed', 2: 'Cancelled', 3: 'Completed' };
const STATUS_CLASSES = { 0: 'badge-warning', 1: 'badge-success', 2: 'badge-error', 3: 'badge-info' };

export default function DashboardPage() {
  const [tab, setTab] = useState('reservations');

  return (
    <div className="container page">
      <h1>Dashboard</h1>
      <div className="tabs">
        <button className={`tab ${tab === 'reservations' ? 'tab-active' : ''}`} onClick={() => setTab('reservations')}>My Reservations</button>
        <button className={`tab ${tab === 'spots' ? 'tab-active' : ''}`} onClick={() => setTab('spots')}>My Spots</button>
        <button className={`tab ${tab === 'profile' ? 'tab-active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
      </div>

      {tab === 'reservations' && <ReservationsTab />}
      {tab === 'spots' && <MySpotsTab />}
      {tab === 'profile' && <ProfileTab />}
    </div>
  );
}

function ReservationsTab() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    reservationService.getMy()
      .then(setReservations)
      .catch(() => setError('Failed to load reservations.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await reservationService.cancel(id);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 2 } : r));
    } catch {
      alert('Failed to cancel reservation.');
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (reservations.length === 0) return <div className="empty-state"><p>No reservations yet.</p></div>;

  return (
    <div className="list">
      {reservations.map(r => (
        <div key={r.id} className="list-item">
          <div className="list-item-main">
            <h3>{r.parkingSpotTitle}</h3>
            <p className="list-item-sub">{r.parkingSpotAddress}</p>
            <p className="list-item-dates">
              {new Date(r.startDate).toLocaleString()} – {new Date(r.endDate).toLocaleString()}
            </p>
            <p className="list-item-cost"><strong>{r.totalCost} PLN</strong></p>
          </div>
          <div className="list-item-actions">
            <span className={`badge ${STATUS_CLASSES[r.status]}`}>{STATUS_LABELS[r.status]}</span>
            {r.status === 1 && (
              <button className="btn btn-outline btn-sm" onClick={() => handleCancel(r.id)}>Cancel</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MySpotsTab() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    parkingSpotService.getMy()
      .then(setSpots)
      .catch(() => setError('Failed to load your spots.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this parking spot?')) return;
    try {
      await parkingSpotService.remove(id);
      setSpots(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('Failed to delete spot.');
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (spots.length === 0) return <div className="empty-state"><p>You haven't listed any spots yet.</p></div>;

  return (
    <div className="list">
      {spots.map(s => (
        <div key={s.id} className="list-item">
          <div className="list-item-main">
            <h3>{s.title}</h3>
            <p className="list-item-sub">{s.address}</p>
            <p className="list-item-cost">{s.pricePerHour} PLN/h</p>
          </div>
          <div className="list-item-actions">
            <span className={`badge ${s.isAvailable ? 'badge-success' : 'badge-error'}`}>
              {s.isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <button className="btn btn-outline btn-sm danger" onClick={() => handleDelete(s.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getProfile()
      .then(data => { setProfile(data); setForm({ firstName: data.firstName, lastName: data.lastName }); })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const updated = await userService.updateProfile(form);
      setProfile(updated);
      setSuccess(true);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="profile-section">
      <p className="profile-email">{profile.email}</p>
      {success && <div className="alert alert-success">Profile updated!</div>}
      <form onSubmit={handleSave} className="auth-form">
        <div className="form-row">
          <div className="form-group">
            <label>First name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
