import { BrowserRouter } from 'react-router-dom';
import './styles/app.css';
import AuthWrapper  from './AuthWrapper';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>      
    </div>
  );
}

export default App;
