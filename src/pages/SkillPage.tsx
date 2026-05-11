import React from 'react';
import { useParams } from 'react-router-dom';

const SkillPage: React.FC = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Карточка навыка</h1>
      <p>ID навыка: {id}</p>
    </div>
  );
};

export default SkillPage;