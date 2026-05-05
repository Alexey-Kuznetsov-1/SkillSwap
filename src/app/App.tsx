import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import viteLogo from '@/assets/vite.svg';
import './App.css';
import { Radio } from '@/shared/ui/Radio/Radio';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';

function App() {
  const [count, setCount] = useState(0);
  const [skillDescription, setSkillDescription] = useState('');

  const [selectedValue, setSelectedValue] = useState('option1');

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    console.log('Selected:', value);
  };

  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isSubcategorySelected, setIsSubcategorySelected] = useState(false);
  return (
    <>
      <section id='center'>
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
          <h1>Get started</h1>
          <p>
            Edit <code>src/app/App.tsx</code> and save to test <code>HMR</code>
          </p>
          {/* УДАЛИТЬ - пример работы textarea ---> */}
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
          {/* <--- УДАЛИТЬ - пример работы textarea */}
        </div>
        {/* RADIO-BUTTON пример работы кнопки радио --> */}
        <div>
          <Radio
            name='exampleGroup'
            value='option1'
            checked={selectedValue === 'option1'}
            onChange={handleRadioChange}
          >
            Всё
          </Radio>
          <Radio
            name='exampleGroup'
            value='option2'
            checked={selectedValue === 'option2'}
            onChange={handleRadioChange}
          >
            Хочу научиться
          </Radio>
          <Radio
            name='exampleGroup'
            value='option3'
            checked={selectedValue === 'option3'}
            onChange={handleRadioChange}
          >
            Могу научить
          </Radio>
        </div>
        {/* <-- RADIO-BUTTON пример работы кнопки радио */}

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

        <button
          type='button'
          className='counter'
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className='ticks'></div>

      <section id='next-steps'>
        <div id='docs'>
          <svg className='icon' role='presentation' aria-hidden='true'>
            <use href='/icons.svg#documentation-icon'></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href='https://vite.dev/' target='_blank'>
                <img className='logo' src={viteLogo} alt='' />
                Explore Vite
              </a>
            </li>
            <li>
              <a href='https://react.dev/' target='_blank'>
                <img className='button-icon' src={reactLogo} alt='' />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id='social'>
          <svg className='icon' role='presentation' aria-hidden='true'>
            <use href='/icons.svg#social-icon'></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href='https://github.com/vitejs/vite' target='_blank'>
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#github-icon'></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href='https://chat.vite.dev/' target='_blank'>
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#discord-icon'></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href='https://x.com/vite_js' target='_blank'>
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#x-icon'></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href='https://bsky.app/profile/vite.dev' target='_blank'>
                <svg
                  className='button-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href='/icons.svg#bluesky-icon'></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className='ticks'></div>
      <section id='spacer'></section>
    </>
  );
}

export default App;
