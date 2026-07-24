import './styles/index.css';
import { seedIfEmpty } from './services/seedService';

// ensure seed runs early
seedIfEmpty().catch(() => {
  // ignore
});
