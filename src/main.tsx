import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installMicDiagProbe } from './voice/micDiagnostics';

installMicDiagProbe();
createRoot(document.getElementById('root')!).render(<App />);
