import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Select } from '@/shared/ui/Select/Select';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
  initialData?: {
    email: string;
    name: string;
    birthDate: string;
    gender: string;
    city: string;
    about: string;
    avatarSrc?: string;
  };
  onSave?: (data: any) => void;
}

const genderOptions = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
];

const cityOptions = [
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
  { value: 'Новосибирск', label: 'Новосибирск' },
  { value: 'Екатеринбург', label: 'Екатеринбург' },
  { value: 'Казань', label: 'Казань' },
  { value: 'Нижний Новгород', label: 'Нижний Новгород' },
  { value: 'Челябинск', label: 'Челябинск' },
  { value: 'Самара', label: 'Самара' },
  { value: 'Омск', label: 'Омск' },
  { value: 'Ростов-на-Дону', label: 'Ростов-на-Дону' },
];

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData = {
    email: 'Maria@gmail.com',
    name: 'Мария',
    birthDate: '1995-10-28',
    gender: 'female',
    city: 'Москва',
    about: 'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
    avatarSrc: '',
  },
  onSave,
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  return (
    <div className={styles.form}>
      <div className={styles.formContent}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>Почта</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={styles.input}
            />
          </div>

          <button className={styles.changePassword}>Изменить пароль</button>

          <div className={styles.field}>
            <label className={styles.label}>Имя</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.rowFields}>
            <div className={styles.halfField}>
              <label className={styles.label}>Дата рождения</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.halfField}>
              <label className={styles.label}>Пол</label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange('gender', value)}
                options={genderOptions}
                placeholder="Выберите пол"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Город</label>
            <Select
              value={formData.city}
              onValueChange={(value) => handleChange('city', value)}
              options={cityOptions}
              placeholder="Выберите город"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>О себе</label>
            <Textarea
              value={formData.about}
              onChange={(value) => handleChange('about', value)}
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.buttons}>
            <Button variant="primary" onClick={handleSave} fullWidth>
              Сохранить
            </Button>
          </div>
        </div>

        <div className={styles.avatarSection}>
          <Avatar
            src={formData.avatarSrc}
            name={formData.name}
            className={styles.avatar}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;