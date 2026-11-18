import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { parkingSpotService } from '../services/parkingSpotService';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import SpotListItem from '../components/SpotListItem';
import AddressSearch from '../components/map/AddressSearch';
import KrakowMap from '../components/map/KrakowMap';
import Icon from '../components/Icon';
import { distanceKm, formatDistance, hasCoordinates } from '../utils/geo';
import {
  defaultTimeWindow, formatDayLabel, hoursBetween, isTime, minutesToTime, timeToMinutes, toDateInput,
} from '../utils/time';
import { plural } from '../utils/plural';
import dragonHero from '../assets/dragon-hero.png';
import logo from '../assets/logo-header.png';
import '../styles/home.css';

const PERKS = [
  { icon: 'car', title: 'Lokalnie w Krakowie', text: 'Prywatne miejsca w Twojej okolicy' },
  { icon: 'bolt', title: 'Szybka rezerwacja', text: 'W kilka kliknięć' },
  { icon: 'shield', title: 'Bezpiecznie', text: 'Zweryfikowani użytkownicy' },
  { icon: 'leaf', title: 'Korzystnie dla wszystkich', text: 'Dodatkowy dochód i mniej korków' },
];

const STEPS = [
  { icon: 'search', title: 'Znajdź miejsce', text: 'Wpisz adres, wybierz dzień i godziny. Pokażemy wolne miejsca w okolicy razem z ceną.' },
  { icon: 'calendar', title: 'Zarezerwuj', text: 'Sprawdź szczegóły i zarezerwuj miejsce na wybrany czas. Koszt widzisz od razu.' },
  { icon: 'card', title: 'Zapłać i parkuj', text: 'Płacisz online przez Przelewy24, a miejsce czeka na Ciebie.' },
];

const HOST_POINTS = [
  'Sam ustalasz cenę za godzinę',
  'Decydujesz, kiedy miejsce jest dostępne',
  'Wypłaty za każdą zakończoną rezerwację',
];

const LIST_LIMIT = 4;
const NEARBY_RADIUS_KM = 2;

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null); // { address, lat, lng, pending? }
  const [date, setDate] = useState(() => toDateInput());
  const [{ start, end }, setTimes] = useState(() => defaultTimeWindow());
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const addressRef = useRef(null);
  const dateRef = useRef(null);
  const offersRef = useRef(null);

  useEffect(() => {
    parkingSpotService.getAll()
      .then(setSpots)
      .catch(() => setError('Nie udało się pobrać miejsc parkingowych. Spróbuj ponownie później.'))
      .finally(() => setLoading(false));
  }, []);

  // Navbar links like "/#jak-to-dziala" — scroll to the section (or to the top for "/").
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.key, location.hash]);

  const isNearbyMode = Boolean(selected && !selected.pending);
  const ranked = isNearbyMode
    ? spots
      .filter(hasCoordinates)
      .map(s => ({ spot: s, distance: distanceKm(selected, { lat: s.latitude, lng: s.longitude }) }))
      .filter(x => x.distance <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
    : spots.map(s => ({ spot: s, distance: null }));
  const visible = showAll ? ranked : ranked.slice(0, LIST_LIMIT);

  const timesValid = isTime(start) && isTime(end) && timeToMinutes(end) > timeToMinutes(start);
  const hours = timesValid ? hoursBetween(start, end) : 0;
  const reserveQuery = timesValid ? `?start=${date}T${start}&end=${date}T${end}` : '';

  // After typing: restore cleared fields and make sure the end is after the start.
  const normalizeTimes = () => {
    setTimes(({ start: s, end: e }) => {
      const fallback = defaultTimeWindow();
      const start = isTime(s) ? s : fallback.start;
      let end = isTime(e) ? e : fallback.end;
      if (timeToMinutes(end) <= timeToMinutes(start)) {
        end = minutesToTime(Math.min(timeToMinutes(start) + 120, 23 * 60 + 59));
      }
      return { start, end };
    });
  };

  const scrollToOffers = () => offersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleSearch = (e) => {
    e.preventDefault();
    addressRef.current?.submit();
    scrollToOffers();
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title">
              Zaparkuj wygodnie <br />
              <span>w Krakowie</span>
            </h1>
            <p className="hero-lead">Wynajmij wolne miejsce na kilka godzin. Szybko, lokalnie, bez stresu.</p>
          </div>
          <img src={dragonHero} alt="" className="hero-art" width="640" height="513" />
        </div>

        <div className="container">
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-field hero-field-location">
              <AddressSearch
                ref={addressRef}
                variant="field"
                label="Lokalizacja"
                selectedAddress={selected?.address}
                onSelect={setSelected}
              />
            </div>

            <div className="hero-field" onClick={() => dateRef.current?.showPicker?.()}>
              <Icon name="calendar" size={22} className="hero-field-icon" />
              <div className="hero-field-text">
                <label htmlFor="hero-date">Data</label>
                <span className="hero-field-value">{formatDayLabel(date)}</span>
              </div>
              <Icon name="chevronDown" size={18} className="hero-field-chevron" />
              <input
                id="hero-date"
                ref={dateRef}
                type="date"
                className="hero-date-input"
                value={date}
                min={toDateInput()}
                onChange={(e) => e.target.value && setDate(e.target.value)}
              />
            </div>

            <div className="hero-field">
              <Icon name="clock" size={22} className="hero-field-icon" />
              <div className="hero-field-text">
                <span className="hero-field-label">Godziny</span>
                <span className="hero-field-value hero-times">
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => setTimes(t => ({ ...t, start: e.target.value }))}
                    onBlur={normalizeTimes}
                    aria-label="Godzina rozpoczęcia"
                    required
                  />
                  <span>–</span>
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => setTimes(t => ({ ...t, end: e.target.value }))}
                    onBlur={normalizeTimes}
                    aria-label="Godzina zakończenia"
                    required
                  />
                </span>
              </div>
            </div>

            <button type="submit" className="btn hero-submit">
              <Icon name="search" size={22} strokeWidth={2.2} /> Szukaj parkingu
            </button>
          </form>

          <ul className="hero-perks">
            {PERKS.map(p => (
              <li key={p.title}>
                <Icon name={p.icon} size={28} strokeWidth={1.6} className="hero-perk-icon" />
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OFFERS + MAP */}
      <section className="offers" id="oferty" ref={offersRef}>
        <div className="container">
          <div className="offers-head">
            <div>
              <h2><Icon name="pin" size={28} strokeWidth={2.2} className="offers-head-icon" />
                {isNearbyMode ? 'Miejsca w pobliżu' : 'Dostępne miejsca blisko Ciebie'}
              </h2>
              {isNearbyMode && (
                <p>
                  {ranked.length} {plural(ranked.length, ['miejsce', 'miejsca', 'miejsc'])} w promieniu{' '}
                  {NEARBY_RADIUS_KM} km od: <strong>{selected.address}</strong>
                </p>
              )}
            </div>
            {isNearbyMode ? (
              <button className="link-button" onClick={() => setSelected(null)}>
                Pokaż wszystkie oferty <Icon name="arrowRight" size={16} />
              </button>
            ) : ranked.length > LIST_LIMIT && (
              <button className="link-button" onClick={() => setShowAll(v => !v)}>
                {showAll ? 'Pokaż mniej' : 'Zobacz wszystkie oferty'} <Icon name="arrowRight" size={16} />
              </button>
            )}
          </div>

          <div className="offers-layout">
            <div className="offers-list">
              {loading && <div className="spinner-wrapper"><div className="spinner" /></div>}
              {error && <div className="alert alert-error">{error}</div>}
              {!loading && !error && visible.length === 0 && (
                <div className="offers-empty">
                  <Icon name="parking" size={36} strokeWidth={1.5} />
                  <p>
                    {isNearbyMode
                      ? `Brak miejsc w promieniu ${NEARBY_RADIUS_KM} km od wybranego adresu.`
                      : 'Nie ma jeszcze żadnych ofert.'}
                  </p>
                  <Link to="/parking-spots/new" className="btn btn-outline btn-sm">Dodaj pierwsze miejsce</Link>
                </div>
              )}
              {visible.map(({ spot, distance }) => (
                <SpotListItem
                  key={spot.id}
                  spot={spot}
                  distanceLabel={distance != null ? formatDistance(distance) : null}
                  hours={hours}
                  reserveQuery={reserveQuery}
                  active={hoveredId === spot.id}
                  onHover={setHoveredId}
                  favorite={isFavorite(spot.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            <div className="offers-map">
              <KrakowMap spots={spots} selected={selected} onPick={setSelected} activeId={hoveredId} />
              <span className="map-city-label">Kraków</span>
              {selected && (
                <div className="map-chip">
                  <Icon name="pin" size={16} />
                  <span>{selected.address}</span>
                  <button onClick={() => setSelected(null)} aria-label="Wyczyść wybraną lokalizację">
                    <Icon name="close" size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-white" id="jak-to-dziala">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Jak to działa</span>
            <h2>Trzy kroki do pewnego miejsca</h2>
          </div>
          <ol className="steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="step">
                <div className="step-top">
                  <span className="icon-tile"><Icon name={step.icon} size={24} /></span>
                  <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SHARE YOUR SPOT */}
      <section className="section" id="udostepnij">
        <div className="container">
          <div className="host">
            <div className="host-text">
              <span className="eyebrow eyebrow-light">Dla gospodarzy</span>
              <h2>Udostępnij swoje miejsce i zarabiaj, gdy stoi puste</h2>
              <p>
                Garaż, podjazd albo miejsce pod blokiem? Dodaj ofertę w kilka minut,
                a kierowcy z okolicy znajdą ją na mapie.
              </p>
              <ul className="host-points">
                {HOST_POINTS.map(point => (
                  <li key={point}>
                    <span className="check"><Icon name="check" size={14} strokeWidth={2.5} /></span> {point}
                  </li>
                ))}
              </ul>
              <div className="host-actions">
                <Link to="/parking-spots/new" className="btn btn-light btn-lg">
                  <Icon name="plus" size={18} /> Dodaj miejsce
                </Link>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-ghost-light btn-lg">Załóż konto</Link>
                )}
              </div>
            </div>
            <div className="host-card" aria-hidden="true">
              <div className="host-card-row"><span className="host-card-label">Miejsce</span><span>Garaż, ul. Dietla</span></div>
              <div className="host-card-row"><span className="host-card-label">Cena</span><span>6 zł / h</span></div>
              <div className="host-card-row"><span className="host-card-label">Dostępność</span><span>pn–pt, 8:00–17:00</span></div>
              <div className="host-card-total">
                <span><Icon name="wallet" size={18} /> Przykładowy zarobek</span>
                <strong>~ 1 200 zł / mies.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <img src={logo} alt="SpotPark" className="footer-logo" width="492" height="160" />
            <p>Wynajem prywatnych miejsc parkingowych w Krakowie.</p>
          </div>
          <nav className="footer-links">
            <Link to="/">Znajdź parking</Link>
            <Link to="/#udostepnij">Udostępnij miejsce</Link>
            <Link to="/#jak-to-dziala">Jak to działa</Link>
            <Link to="/regulamin">Regulamin</Link>
            {isAuthenticated ? <Link to="/dashboard">Mój panel</Link> : <Link to="/login">Zaloguj się</Link>}
          </nav>
          <p className="footer-copy">© {new Date().getFullYear()} SpotPark · Mapa © OpenStreetMap, CARTO</p>
        </div>
      </footer>
    </div>
  );
}
