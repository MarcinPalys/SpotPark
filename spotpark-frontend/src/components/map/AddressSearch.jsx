import { useEffect, useId, useImperativeHandle, useState } from 'react';
import { geocodingService } from '../../services/geocodingService';
import Icon from '../Icon';
import '../../styles/map.css';

/**
 * Address input with search-as-you-type suggestions, limited to Kraków.
 * Calls onSelect({ address, lat, lng }) when the user picks a suggestion,
 * or onSelect(null) when the field is cleared.
 * `selectedAddress` keeps the input in sync when a location is picked on the map.
 *
 * variant="field" renders a labelled field without its own button (for the hero search bar);
 * the parent can then call ref.current.submit() to pick the highlighted/first suggestion.
 */
export default function AddressSearch({ selectedAddress, onSelect, variant = 'box', label = 'Lokalizacja', placeholder, ref }) {
  const inputId = useId();
  const [input, setInput] = useState(selectedAddress ?? '');
  const [prevSelected, setPrevSelected] = useState(selectedAddress);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [error, setError] = useState('');

  // Sync the text field when the selection changes from outside (map click).
  if (selectedAddress !== prevSelected) {
    setPrevSelected(selectedAddress);
    setInput(selectedAddress ?? '');
    setOpen(false);
  }

  const query = input.trim();
  const shouldFetch = query.length >= 3 && input !== selectedAddress;

  useEffect(() => {
    if (!shouldFetch) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const results = await geocodingService.search(query, controller.signal);
        setSuggestions(results);
        setActive(-1);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setSuggestions([]);
          setError('Nie udało się pobrać podpowiedzi adresów.');
        }
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, shouldFetch]);

  const choose = (s) => {
    setOpen(false);
    setInput(s.address);
    onSelect({ address: s.address, lat: s.lat, lng: s.lng });
  };

  const visible = open && shouldFetch ? suggestions : [];

  const submit = () => {
    const pick = visible[active] ?? visible[0] ?? (shouldFetch ? suggestions[0] : null);
    if (pick) choose(pick);
    return Boolean(pick);
  };

  useImperativeHandle(ref, () => ({ submit }));

  const isField = variant === 'field';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // never submit a surrounding form
      submit();
      return;
    }
    if (!visible.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % visible.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i <= 0 ? visible.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // A <div> rather than a <form>, so the search can live inside other forms.
  return (
    <div className={`address-search${isField ? ' address-search-field' : ''}`} role="search">
      <div className="address-search-box">
        <Icon name={isField ? 'pin' : 'search'} size={isField ? 22 : 20} className="address-search-icon" />
        {isField && <label htmlFor={inputId} className="address-search-label">{label}</label>}
        <input
          id={inputId}
          type="text"
          placeholder={placeholder ?? (isField ? 'Ulica, osiedle lub miejsce' : 'Wpisz ulicę i numer, np. Floriańska 15')}
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          aria-label="Wyszukaj adres w Krakowie"
          aria-autocomplete="list"
          aria-expanded={visible.length > 0}
          autoComplete="off"
        />
        {input && (
          <button
            type="button"
            className="address-search-clear"
            onClick={() => { setInput(''); setSuggestions([]); onSelect(null); }}
            aria-label="Wyczyść"
          >
            <Icon name="close" size={16} />
          </button>
        )}
        {!isField && (
          <button type="button" className="btn btn-primary" aria-label="Szukaj" onClick={submit}>
            <Icon name="arrowRight" size={18} />
          </button>
        )}
      </div>

      {visible.length > 0 && (
        <ul className="address-suggestions" role="listbox">
          {visible.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'active' : ''}
              onMouseDown={(e) => { e.preventDefault(); choose(s); }}
              onMouseEnter={() => setActive(i)}
            >
              <Icon name="pin" size={18} className="suggestion-icon" />
              <div>
                <strong>{s.main}</strong>
                {s.secondary && <span>{s.secondary}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="address-search-error">{error}</p>}
    </div>
  );
}
