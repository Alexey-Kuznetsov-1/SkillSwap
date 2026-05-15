import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';  // ← ДОБАВИТЬ ЭТУ СТРОКУ
import HomePage from '@/pages/HomePage/HomePage';
import SkillPage from '@/pages/SkillPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CreatePage from '@/pages/CreatePage';
import FavoritesPage from '@/pages/FavoritesPage';
import ExamplePage from '@/pages/ExamplePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/skill/:id' element={<SkillPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/favorites' element={<FavoritesPage />} />
        <Route path='/example' element={<ExamplePage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
