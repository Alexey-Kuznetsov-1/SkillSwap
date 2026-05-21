// src/app/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from '@/pages/HomePage/HomePage';
import SkillPage from '@/pages/SkillPage/SkillPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import CreatePage from '@/pages/CreatePage';
import FavoritesPage from '@/pages/FavoritesPage/FavoritesPage';
import ExamplePage from '@/pages/ExamplePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import AboutPage from '@/pages/AboutPage/AboutPage';
import { AuthWrapper } from '@/features/auth/AuthWrapper';
import ContactsPage from '@/pages/ContactsPage/ContactsPage';
import BlogPage from '@/pages/BlogPage/BlogPage';
import PrivacyPage from '@/pages/PrivacyPage/PrivacyPage';
import TermsPage from '@/pages/TermsPage/TermsPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/skill/:id' element={<SkillPage />} />
        <Route
          path='/login'
          element={
            <AuthWrapper>
              <LoginPage />
            </AuthWrapper>
          }
        />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/favorites' element={<FavoritesPage />} />
        <Route path='/example' element={<ExamplePage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
