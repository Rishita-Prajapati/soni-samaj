import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationFix = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default NavigationFix;