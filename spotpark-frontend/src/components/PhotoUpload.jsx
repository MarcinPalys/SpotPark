import { useRef, useState } from 'react';
import { compressImage } from '../utils/image';
import Icon from './Icon';

const MAX_FILE_MB = 15;

/**
 * Optional photo picker with drag & drop, client-side compression and thumbnails.
 * `photos` is an array of { id, url } (url is a JPEG data URL).
 */
export default function PhotoUpload({ photos, onChange, max = 3 }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const addFiles = async (fileList) => {
    setError('');
    const files = Array.from(fileList);
    const images = files.filter((f) => f.type.startsWith('image/'));
    const tooBig = images.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    const accepted = images.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024);
    const free = max - photos.length;

    const problems = [];
    if (images.length < files.length) problems.push('Można dodawać tylko pliki graficzne.');
    if (tooBig.length) problems.push(`Pliki większe niż ${MAX_FILE_MB} MB zostały pominięte.`);
    if (accepted.length > free) problems.push(`Możesz dodać maksymalnie ${max} zdjęcia.`);

    const toProcess = accepted.slice(0, Math.max(free, 0));
    if (toProcess.length) {
      setBusy(true);
      try {
        const added = await Promise.all(toProcess.map(async (file) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url: await compressImage(file),
        })));
        onChange([...photos, ...added]);
      } catch {
        problems.push('Nie udało się wczytać jednego ze zdjęć.');
      } finally {
        setBusy(false);
      }
    }
    if (problems.length) setError(problems.join(' '));
  };

  const remove = (id) => onChange(photos.filter((p) => p.id !== id));

  const canAdd = photos.length < max && !busy;

  return (
    <div className="photo-upload">
      {photos.length > 0 && (
        <ul className="photo-grid">
          {photos.map((photo, i) => (
            <li key={photo.id} className="photo-thumb">
              <img src={photo.url} alt={`Zdjęcie ${i + 1}`} />
              {i === 0 && <span className="photo-badge">Główne</span>}
              <button type="button" className="photo-remove" onClick={() => remove(photo.id)} aria-label="Usuń zdjęcie">
                <Icon name="close" size={14} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {canAdd && (
        <button
          type="button"
          className={`photo-drop${dragging ? ' photo-drop-active' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        >
          <span className="photo-drop-icon"><Icon name="camera" size={22} /></span>
          <span className="photo-drop-text">
            <strong>Dodaj zdjęcie</strong> albo przeciągnij je tutaj
          </span>
          <span className="photo-drop-hint">
            JPG, PNG lub WebP · do {max} zdjęć · zostało {max - photos.length}
          </span>
        </button>
      )}
      {busy && <p className="field-hint">Przetwarzanie zdjęć…</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
