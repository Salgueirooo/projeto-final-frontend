import { Routes, Route } from 'react-router-dom';
import InitPage from './pages/InitPage';
import SelectBakeryPage from './pages/ChooseBakeryPage';
import HomePage from './pages/HomePage';
import AuthenticatedLayout from './context/AuthenticatedLayout';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';

const App: React.FC = () => {

    return (
        <Routes>
          
            <Route path="/" element={<InitPage />} />
          
            <Route element={<AuthenticatedLayout />}>
                <Route path="/select-bakery" element={<SelectBakeryPage />} />
                <Route path="/statistics" element={<Statistics />}/>
                <Route path='/settings' element={<Settings />} />
                <Route path="/home/:bakeryId/:tab?" element={<HomePage />} />
            </Route>

        </Routes>
    );
};

export default App;