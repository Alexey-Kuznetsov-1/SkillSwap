import { useEffect, useState } from 'react';
import styles from './SearchInput.module.css';

const SearchIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={styles.icon}
  >
    <path d="M11.5349 21.0698C6.27908 21.0698 2 16.7907 2 11.5349C2 6.27908 6.27908 2 11.5349 2C16.7907 2 21.0698 6.27908 21.0698 11.5349C21.0698 16.7907 16.7907 21.0698 11.5349 21.0698ZM11.5349 3.39535C7.04187 3.39535 3.39535 7.05118 3.39535 11.5349C3.39535 16.0186 7.04187 19.6745 11.5349 19.6745C16.0279 19.6745 19.6745 16.0186 19.6745 11.5349C19.6745 7.05118 16.0279 3.39535 11.5349 3.39535Z" fill="#253017"/>
    <path d="M21.3024 22C21.1257 22 20.9489 21.9349 20.8094 21.7954L18.9489 19.9349C18.6791 19.6651 18.6791 19.2186 18.9489 18.9488C19.2187 18.6791 19.6652 18.6791 19.935 18.9488L21.7954 20.8093C22.0652 21.0791 22.0652 21.5256 21.7954 21.7954C21.6559 21.9349 21.4791 22 21.3024 22Z" fill="#253017"/>
  </svg>
);

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Поиск...',
  className = '',
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onChange, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <SearchIcon />
      <input
        type="text"
        className={styles.input}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};