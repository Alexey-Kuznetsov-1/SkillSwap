import { useState, useEffect } from 'react';
import Header from '../widgets/Header';
import reactLogo from '@/assets/react.svg';
import viteLogo from '@/assets/vite.svg';
import { getMockDbState, getSkillById } from '@/api';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import { RadioGroup } from '@/shared/ui/RadioGroup/RadioGroup';
import { Tag } from '@/shared/ui/Tag/Tag';
// import { ModalUI } from '@/shared/ui/Modal/Modal';
// import { Icon } from '@/shared/ui/Icon';
// import { Button } from '@/stories/Button';

const ExamplePage: React.FC = () => {
  const [count, setCount] = useState(0);
  const [skillDescription, setSkillDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isSubcategorySelected, setIsSubcategorySelected] = useState(false);

  const options = [
    { value: 'all', label: 'Всё' },
    { value: 'learn', label: 'Хочу научиться' },
    { value: 'teach', label: 'Могу научить' },
  ];

  useEffect(() => {
    void (async () => {
      try {
        const dbState = await getMockDbState();
        console.log('Загруженные данные mock-db-store:', dbState);
        const skill = await getSkillById(1);
        console.log('Результат getSkillById(1):', skill);
      } catch (error) {
        console.error('Ошибка при чтении данных API:', error);
      }
    })();
  }, []);

  return (
    <>
      <Header isLoggedIn={false} />
      <main style={{ padding: '20px' }}>
        <div className='hero'>
          <img
            src={viteLogo}
            className='base'
            width='170'
            height='179'
            alt=''
          />
          <img src={reactLogo} className='framework' alt='React logo' />
          <img src={viteLogo} className='vite' alt='Vite logo' />
        </div>
        <div>
          <h1>Песочница для тестирования компонентов</h1>
          <p>Здесь собраны все компоненты для проверки</p>
          <Textarea
            label='Описание'
            value={skillDescription}
            onChange={setSkillDescription}
            placeholder='Коротко опишите, чему можете научить'
            rows={4}
            maxLength={1000}
            error={
              skillDescription.length > 800
                ? 'Осталось мало символов!'
                : undefined
            }
          />
        </div>
        <div>
          <RadioGroup
            name='catalogFilter'
            options={options}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <Checkbox
          checked={isCategorySelected}
          onChange={setIsCategorySelected}
          type='category'
          name='category-electronics'
        >
          Электроника
        </Checkbox>
        <Checkbox
          checked={isSubcategorySelected}
          onChange={setIsSubcategorySelected}
          type='subcategory'
          name='subcategory-smartphones'
        >
          Смартфоны
        </Checkbox>
        <button type='button' onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <Avatar src='https://i.pinimg.com/236x/ce/f2/ad/cef2ad42d058f72fa1de0ced9c7d3ead.jpg?nii=t' />
        <Avatar name='Денис Терёхин' />
        <Tag>+1</Tag>
        <Tag>Навык</Tag>

        {/* Пример модалки  */}
        {/* <ModalUI
          onClose={() => console.log('Modal close attempted')}
          icon={<Icon name='done' size='75'></Icon>}
          title='Вы предложили обмен'
          subtitle='Теперь выможете предложить обмен'
          children={<Button label='Готово'></Button>}
        ></ModalUI> */}
      </main>
    </>
  );
};

export default ExamplePage;
