import React from 'react';
import Header from '@/widgets/Header';
import NotFound from '@/widgets/NotFound';
import Footer from '@/widgets/Footer';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Header />
      <NotFound />
      <Footer />
    </>
  );
};

export default NotFoundPage;