import React, { useState } from 'react';
import Header from '../components/Header';
import Content from './Content';

function Home({ onLogout }) {
  const [selectedContent, setSelectedContent] = useState('POS');

  const handleNavSelect = (id) => {
    setSelectedContent(id);
  };

  return (
    <>
      <div className='h-[70px]'>
        <Header onNavSelect={handleNavSelect} onLogout={onLogout} />
      </div>
      <Content selectedContent={selectedContent} />
    </>
  );
}

export default Home;
