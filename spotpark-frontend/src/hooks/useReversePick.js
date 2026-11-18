import { useCallback, useRef } from 'react';
import { geocodingService } from '../services/geocodingService';

/**
 * Returns pick({ lat, lng }) which immediately reports a pending selection,
 * then resolves the address. Stale responses (user clicked again) are ignored.
 */
export function useReversePick(onPick) {
  const requestId = useRef(0);

  return useCallback(async (point) => {
    const id = ++requestId.current;
    onPick({ ...point, address: 'Szukam adresu…', pending: true });

    let address = `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;
    try {
      address = await geocodingService.reverse(point.lat, point.lng);
    } catch {
      // keep coordinates as a fallback label
    }
    if (id === requestId.current) onPick({ ...point, address });
  }, [onPick]);
}
