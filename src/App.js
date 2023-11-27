import { BrowserRouter } from 'react-router-dom';
// import './styles/app.css';
import AuthWrapper  from './AuthWrapper';


function App() {
  return (
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>   
  );
}

export default App;
