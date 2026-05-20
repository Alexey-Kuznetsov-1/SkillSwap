import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from '@/contexts/AuthProvider';

import HomePage from '@/pages/HomePage/HomePage';
import SkillPage from '@/pages/SkillPage/SkillPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import CreatePage from '@/pages/CreatePage';
import FavoritesPage from '@/pages/FavoritesPage/FavoritesPage';
import ExamplePage from '@/pages/ExamplePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/skill/:id' element={<SkillPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/create' element={<CreatePage />} />
          <Route path='/favorites' element={<FavoritesPage />} />
          <Route path='/example' element={<ExamplePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
