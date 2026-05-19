import { DayPicker } from '@daypicker/react';
import '@daypicker/react/style.css'; // Сначала — стили библиотеки
import styles from './Calendar.module.css'; // Затем — ваши стили

import { useEffect, useRef, useState, useCallback } from 'react';
import { format, isValid, parse } from 'date-fns';
import { Icon } from '../../shared/ui/Icon/Icon';
import { Button } from '../../shared/ui/Button/Button';
import { ru } from '@daypicker/react/locale';

interface DatePickerProps {
  onDateSelect: (date: string) => void;
  selectedDate?: Date;
  label?: string;
}

export default function DatePicker({
  onDateSelect,
  selectedDate: initialDate,
  label = 'Дата рождения',
}: DatePickerProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [inputValue, setInputValue] = useState(
    initialDate ? format(initialDate, 'MM.dd.yyyy') : '',
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleCalendar = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCalendarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) {
      setInputValue('');
      setSelectedDate(undefined);
      onDateSelect('');
    } else {
      setSelectedDate(date);
      setInputValue(format(date, 'dd.MM.yyyy'));
      setMonth(date);
      onDateSelect(format(date, 'yyyy-MM-dd'));
    }
    setIsCalendarOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    const parsedDate = parse(e.target.value, 'dd.MM.yyyy', new Date());
    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate);
      setMonth(parsedDate);
    } else {
      setSelectedDate(undefined);
    }
  };

  function CustomChevron() {
    return <Icon name='chevron-down' size='24'></Icon>;
  }

  return (
    <div className={styles.container}>
      <label htmlFor='calendar-input' className={styles.label}>
        {label}
      </label>
      <div
        className={styles['group']}
        onClick={toggleCalendar}
        aria-haspopup='true'
        aria-expanded={isCalendarOpen}
        aria-label='Открыть календарь для выбора даты'
      >
        <input
          ref={inputRef}
          className={styles.input}
          id='calendar-input'
          type='text'
          value={inputValue}
          placeholder='дд.мм.гггг'
          onChange={handleInputChange}
          autoComplete='bday'
        />
        <Icon name='calendar' size='24' className={styles.icon}></Icon>
      </div>

      {/* Рендерим календарь только когда он открыт */}
      {isCalendarOpen && (
        <div
          className={`${styles.popup} ${isCalendarOpen ? styles.open : ''}`}
          ref={calendarRef}
          role='region'
          aria-hidden={!isCalendarOpen}
        >
          <DayPicker
            month={month}
            onMonthChange={setMonth}
            mode='single'
            selected={selectedDate}
            onSelect={handleDaySelect}
            captionLayout='dropdown'
            hideNavigation
            navLayout='around'
            required
            locale={ru}
            showOutsideDays
            components={{
              Chevron: CustomChevron,
            }}
            footer={
              <div className={styles.footer}>
                <Button
                  variant='secondary'
                  children='Отменить'
                  type='reset'
                  onClick={() => {
                    setInputValue(''); // сбрасываем значение инпута
                    setSelectedDate(undefined); // очищаем выбранную дату
                    setIsCalendarOpen(false); // закрываем календарь
                    onDateSelect(''); // передаём пустое значение родительскому компоненту
                  }}
                />
                <Button
                  variant='primary'
                  children='Выбрать'
                  type='submit'
                  onClick={() => setIsCalendarOpen(false)}
                />
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
