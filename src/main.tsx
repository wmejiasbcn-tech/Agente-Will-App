import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installMicDiagProbe } from './voice/micDiagnostics';
import { installWillCompatProbe } from './utils/browserCompat';

installMicDiagProbe();
installWillCompatProbe();
createRoot(document.getElementById('root')!).render(<App />);
