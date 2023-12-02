import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthWrapper from './AuthWrapper';
import FormInscription from './components/form_register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/inscription" element={<FormInscription />} />
        <Route path="/*" element={<AuthWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
