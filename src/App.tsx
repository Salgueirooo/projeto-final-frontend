import { Routes, Route } from 'react-router-dom';
import InitPage from './pages/InitPage';
import RegisterForm from './components/RegisterForm';
import Security from './context/SecurityContext';
import SelectBakeryPage from './pages/ChooseBakeryPage';
import HomePage from './pages/HomePage';

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

            <Route path="/home" element={
                <Security allowedRoles={roles} >
                    <HomePage />
                </Security>
            }/>
          

        </Routes>
    );
};

export default App;