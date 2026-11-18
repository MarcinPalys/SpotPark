import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parkingSpotService } from '../services/parkingSpotService';
import { StorageFullError } from '../services/localSpotStore';
import PhotoUpload from '../components/PhotoUpload';
import { useAuth } from '../context/AuthContext';
import AddressSearch from '../components/map/AddressSearch';
import LocationPicker from '../components/map/LocationPicker';
import Icon from '../components/Icon';
import '../styles/add-spot.css';

const AMENITIES = ['Garaż', 'Zadaszone', 'Monitoring', 'Brama / szlaban', 'Ładowarka EV', 'Dostęp 24/7'];
const PRICE_PRESETS = [4, 6, 8, 10];
const TITLE_MAX = 80;
const DESCRIPTION_MAX = 500;
// Rough estimate used only for the earnings hint.
const EST_HOURS_PER_DAY = 6;
const EST_DAYS_PER_MONTH = 22;

export default function AddParkingSpotPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [location, setLocation] = useState(null); // { address, lat, lng, pending? }
  const [address, setAddress] = useState('');
  const [prevLocation, setPrevLocation] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]); // { id, url }
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Pre-fill the editable address whenever a new location is resolved.
  if (location !== prevLocation) {
    setPrevLocation(location);
    if (location && !location.pending) setAddress(location.address);
    if (!location) setAddress('');
  }

  const priceValue = Number(price.replace(',', '.'));
  const errors = {};
  if (!location || location.pending) errors.location = 'Wskaż miejsce na mapie albo wyszukaj adres.';
  if (location && !location.pending && !address.trim()) errors.address = 'Podaj adres, który zobaczą kierowcy.';
  if (title.trim().length < 5) errors.title = 'Tytuł musi mieć co najmniej 5 znaków.';
  if (!(priceValue >= 1 && priceValue <= 200)) errors.price = 'Podaj cenę od 1 do 200 zł za godzinę.';
  const isValid = Object.keys(errors).length === 0;
  const showError = (field) => submitted && errors[field];

  const toggleAmenity = (name) =>
    setAmenities((list) => (list.includes(name) ? list.filter((a) => a !== name) : [...list, name]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setSaveError('');
    if (!isValid) {
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const fullDescription = [
      description.trim(),
      amenities.length ? `Udogodnienia: ${amenities.join(', ')}` : '',
    ].filter(Boolean).join('\n\n');

    const payload = {
      title: title.trim(),
      description: fullDescription,
      address: address.trim(),
      latitude: location.lat,
      longitude: location.lng,
      pricePerHour: Math.round(priceValue * 100) / 100,
    };

    if (!isAuthenticated) {
      try {
        const spot = parkingSpotService.createLocal({ ...payload, imageUrls: photos.map((p) => p.url) });
        navigate(`/parking-spots/${spot.id}`, { state: { justCreated: true } });
      } catch (err) {
        setSaveError(err instanceof StorageFullError
          ? 'Pamięć przeglądarki jest pełna. Usuń część zdjęć albo starsze ogłoszenia i spróbuj ponownie.'
          : 'Nie udało się zapisać miejsca w przeglądarce.');
      }
      return;
    }

    setSaving(true);
    try {
      // The API has no image upload yet, so photos are not sent to the server.
      const spot = await parkingSpotService.create(payload);
      navigate(`/parking-spots/${spot.id}`, { state: { justCreated: true } });
    } catch (err) {
      setSaveError(err.response?.status === 401
        ? 'Twoja sesja wygasła. Zaloguj się ponownie, aby opublikować miejsce.'
        : 'Nie udało się zapisać miejsca. Sprawdź, czy serwer działa, i spróbuj ponownie.');
    } finally {
      setSaving(false);
    }
  };

  const monthlyEstimate = priceValue > 0
    ? Math.round(priceValue * EST_HOURS_PER_DAY * EST_DAYS_PER_MONTH)
    : null;

  return (
    <div className="add-spot">
      <div className="container">
        <header className="add-spot-header">
          <Link to="/" className="back-link"><Icon name="arrowRight" size={16} className="flip" /> Wróć do mapy</Link>
          <span className="eyebrow">Dla gospodarzy</span>
          <h1>Wystaw swoje miejsce parkingowe</h1>
          <p>Uzupełnij kilka krótkich kroków. Zajmie Ci to około dwóch minut.</p>
        </header>

        {!isAuthenticated && (
          <div className="notice">
            <Icon name="shield" size={20} />
            <p>
              <strong>Nie jesteś zalogowany.</strong> Na razie ogłoszenie zapisze się tylko w tej
              przeglądarce i będzie widoczne na Twojej mapie.{' '}
              <Link to="/login">Zaloguj się</Link>, aby opublikować je dla wszystkich kierowców.
            </p>
          </div>
        )}

        <form className="add-spot-grid" onSubmit={handleSubmit} noValidate>
          <div className="add-spot-steps">
            {/* STEP 1 */}
            <section className="form-step">
              <div className="form-step-head">
                <span className="form-step-number">1</span>
                <div>
                  <h2>Lokalizacja</h2>
                  <p>Wyszukaj adres albo kliknij na mapie. Pinezkę możesz przeciągnąć.</p>
                </div>
              </div>

              <AddressSearch selectedAddress={location?.address} onSelect={setLocation} />
              <div className={`picker-wrapper${showError('location') ? ' has-error' : ''}`}>
                <LocationPicker value={location} onPick={setLocation} />
                {!location && (
                  <div className="picker-hint"><Icon name="pin" size={16} /> Kliknij na mapie, aby postawić pinezkę</div>
                )}
              </div>
              {showError('location') && <p className="field-error">{errors.location}</p>}

              {location && (
                <div className="field">
                  <label htmlFor="address">Adres widoczny w ogłoszeniu</label>
                  <input
                    id="address"
                    type="text"
                    value={location.pending ? 'Szukam adresu…' : address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={location.pending}
                    placeholder="np. ul. Dietla 50, Kazimierz"
                  />
                  <span className="field-hint">Możesz doprecyzować, np. dopisać numer bramy lub poziom garażu.</span>
                  {showError('address') && <p className="field-error">{errors.address}</p>}
                </div>
              )}
            </section>

            {/* STEP 2 */}
            <section className="form-step">
              <div className="form-step-head">
                <span className="form-step-number">2</span>
                <div>
                  <h2>Opis miejsca</h2>
                  <p>Krótki tytuł i kilka słów, które pomogą kierowcy podjąć decyzję.</p>
                </div>
              </div>

              <div className="field">
                <label htmlFor="title">Tytuł ogłoszenia</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  maxLength={TITLE_MAX}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="np. Miejsce w garażu podziemnym przy Rondzie Mogilskim"
                  aria-invalid={Boolean(showError('title'))}
                />
                <span className="field-counter">{title.length}/{TITLE_MAX}</span>
                {showError('title') && <p className="field-error">{errors.title}</p>}
              </div>

              <div className="field">
                <span className="field-label">Udogodnienia</span>
                <div className="chips">
                  {AMENITIES.map((name) => {
                    const active = amenities.includes(name);
                    return (
                      <button
                        type="button"
                        key={name}
                        className={`chip${active ? ' chip-active' : ''}`}
                        aria-pressed={active}
                        onClick={() => toggleAmenity(name)}
                      >
                        {active && <Icon name="check" size={14} strokeWidth={2.5} />}
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="field">
                <label htmlFor="description">Opis <span className="optional">(opcjonalnie)</span></label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  maxLength={DESCRIPTION_MAX}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jak dojechać, jak szerokie jest miejsce, czy jest ograniczenie wysokości…"
                />
                <span className="field-counter">{description.length}/{DESCRIPTION_MAX}</span>
              </div>
            </section>

            {/* STEP 3 */}
            <section className="form-step">
              <div className="form-step-head">
                <span className="form-step-number">3</span>
                <div>
                  <h2>Zdjęcia <span className="optional">(opcjonalnie)</span></h2>
                  <p>Pokaż wjazd albo samo miejsce. Ułatwisz kierowcy jego znalezienie.</p>
                </div>
              </div>
              <PhotoUpload photos={photos} onChange={setPhotos} />
              {isAuthenticated && photos.length > 0 && (
                <p className="field-hint">
                  Serwer nie obsługuje jeszcze zdjęć, więc ogłoszenie zostanie opublikowane bez nich.
                </p>
              )}
            </section>

            {/* STEP 4 */}
            <section className="form-step">
              <div className="form-step-head">
                <span className="form-step-number">4</span>
                <div>
                  <h2>Cena</h2>
                  <p>Ile kierowca zapłaci za godzinę parkowania.</p>
                </div>
              </div>

              <div className="field">
                <label htmlFor="price">Cena za godzinę</label>
                <div className="price-input">
                  <input
                    id="price"
                    type="text"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^\d.,]/g, ''))}
                    placeholder="0"
                    aria-invalid={Boolean(showError('price'))}
                  />
                  <span>zł / h</span>
                </div>
                <div className="chips">
                  {PRICE_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p}
                      className={`chip${priceValue === p ? ' chip-active' : ''}`}
                      onClick={() => setPrice(String(p))}
                    >
                      {p} zł
                    </button>
                  ))}
                </div>
                {showError('price') && <p className="field-error">{errors.price}</p>}
              </div>
            </section>
          </div>

          {/* SUMMARY */}
          <aside className="add-spot-summary">
            <div className="summary-card">
              <span className="summary-label">Podgląd ogłoszenia</span>
              <div className="preview">
                {photos[0] && <img src={photos[0].url} alt="" className="preview-photo" />}
                <div className="preview-head">
                  <h3 className={title.trim() ? '' : 'placeholder'}>
                    {title.trim() || 'Tytuł Twojego ogłoszenia'}
                  </h3>
                  <span className="badge badge-success">Dostępne</span>
                </div>
                <p className={`preview-address${address.trim() ? '' : ' placeholder'}`}>
                  <Icon name="pin" size={15} />
                  {location?.pending ? 'Szukam adresu…' : address.trim() || 'Adres miejsca'}
                </p>
                {amenities.length > 0 && (
                  <div className="preview-tags">
                    {amenities.map((a) => <span key={a}>{a}</span>)}
                  </div>
                )}
                <div className="preview-price">
                  <strong>{priceValue > 0 ? `${priceValue.toLocaleString('pl-PL')} zł` : '— zł'}</strong>
                  <span> / godz.</span>
                </div>
              </div>

              {monthlyEstimate != null && (
                <div className="estimate">
                  <Icon name="wallet" size={18} />
                  <p>
                    Możesz zarobić ok. <strong>{monthlyEstimate.toLocaleString('pl-PL')} zł / mies.</strong>
                    <span>przy {EST_HOURS_PER_DAY} h dziennie przez {EST_DAYS_PER_MONTH} dni</span>
                  </p>
                </div>
              )}

              {saveError && <div className="alert alert-error">{saveError}</div>}

              <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={saving}>
                {saving ? 'Zapisywanie…' : 'Wystaw miejsce'}
              </button>
              <p className="summary-footnote">
                {isAuthenticated
                  ? 'Ogłoszenie od razu pojawi się na mapie dla wszystkich kierowców.'
                  : 'Zapis lokalny. Po zalogowaniu ogłoszenia trafią na serwer.'}
              </p>
              <p className="summary-footnote">
                Wystawiając miejsce, akceptujesz <Link to="/regulamin">Regulamin</Link>.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
