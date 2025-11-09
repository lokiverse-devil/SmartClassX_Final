import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDemoData } from './utils/demoData.ts'
import { AuthProvider } from './hooks/useAuth.tsx';

// Initialize demo data
initializeDemoData();

createRoot(document.getElementById("root")!).render(
<AuthProvider>
    <App />
</AuthProvider>);
