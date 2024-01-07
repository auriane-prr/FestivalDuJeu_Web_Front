import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthWrapper from './AuthWrapper';
import FormInscription from './components/login&register/form_register';
import './styles/App.css';
import AdminAccueil from './pages/admin/AdminAccueil';
import PageFestival from './pages/admin/pageFestival';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/inscription" element={<FormInscription />} />
        <Route path="/admin" element={<AdminAccueil />} />
        <Route path="/admin/festival" element={<PageFestival />} />
        <Route path="/*" element={<AuthWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
