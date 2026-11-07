import { createRoot } from 'react-dom/client';
import { LandingPageView } from './views/LandingPageView';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<LandingPageView />);
}
