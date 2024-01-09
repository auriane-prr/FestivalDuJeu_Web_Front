import { BrowserRouter} from 'react-router-dom';
import AuthWrapper from './AuthWrapper';
import { RenderMenu, RenderRoutes } from './renderNavigation';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <RenderMenu />
        <RenderRoutes />
      </AuthWrapper>
    </BrowserRouter>
  );
}

export default App;
