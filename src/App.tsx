import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';


const App: React.FC = () => {
  
  const  roles = ["ROLE_USER", "ROLE_ADMIN"];

  return (
    <Routes>
      
      <Route path="/" element={<LoginPage />} />
      
      

    </Routes>
  );
};

export default App;