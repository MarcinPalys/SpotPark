import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top when the page (pathname) changes; hash links handle their own scrolling. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
