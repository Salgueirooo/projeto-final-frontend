import { Routes, Route } from 'react-router-dom';
import InitPage from './pages/InitPage';
import RegisterForm from './components/registerForm';
import Security from './context/SecurityContext';
import SelectBakeryPage from './pages/SelectBakeryPage';

const App: React.FC = () => {
  
    const  roles = ["ROLE_ADMIN", "ROLE_CONFECTIONER", "ROLE_COUNTER_EMPLOYEE", "ROLE_CLIENT"];

    return (
        <Routes>
          
            <Route path="/" element={<InitPage />} />

            <Route path="/select-bakery" element={
                <Security allowedRoles={roles} >
                    <SelectBakeryPage />
                </Security>
            }/>
          

        </Routes>
    );
};

export default App;