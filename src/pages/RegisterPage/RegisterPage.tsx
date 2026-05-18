// src/pages/RegisterPage/RegisterPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginHeader } from '@/widgets/LoginHeader/LoginHeader';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './RegisterPage.module.css';
import ProgressBar from '../../shared/ui/ProgressBar/ProgressBar';
import { Button } from '../../shared/ui/Button/Button';
import DatePicker from '../../widgets/Calendar/Calendar';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { ImageUploadField } from '../../shared/ui/ImageDropper/ImageDropper';
import type { RegistrationFormData } from '@/api/types';
import { parse, isValid } from 'date-fns';

const registrationSchema = yup.object({
  email: yup
    .string()
    .required('Email обязателен')
    .email('Введите корректный email'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен быть не менее 8 символов'),

  avatar: yup
    .mixed<File>()
    .nullable()
    .defined() // исключает undefined, оставляет только null или File
    .test('fileSize', 'Аватар не должен превышать 5 МБ', (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Допустимые форматы: JPG, PNG, WEBP', (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
    }),
  name: yup.string().required('Имя обязательно'),
  birthDate: yup
    .string()
    .required('Дата рождения обязательна')
    .test('valid-date', 'Введите корректную дату', (value) => {
      if (!value) return false;
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      return isValid(parsedDate);
    }),
  gender: yup.string().required('Пол обязателен'),
  city: yup.string().required('Город обязателен'),
  categoryToLearn: yup.number().required('Категория обязательна'),
  subcategoryToLearn: yup.number().required('Подкатегория обязательна'),

  categoryToTeach: yup.number().required('Категория навыка обязательна'),
  subcategoryToTeach: yup.number().required('Подкатегория навыка обязательна'),
  skillName: yup.string().required('Название навыка обязательно'),
  skillDescription: yup
    .string()
    .required('Описание навыка обязательно')
    .max(3000, 'Описание не должно превышать 3000 символов'),
  photos: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .defined() // исключает undefined для элементов массива
        .test('fileSize', 'Файл не должен превышать 10 МБ', (file) => {
          if (!file) return true;
          return file.size <= 10 * 1024 * 1024;
        }),
    )
    .defined() // исключает undefined для самого массива
    .min(1, 'Необходимо загрузить хотя бы одно фото')
    .max(5, 'Можно загрузить не более 5 фото'),
});

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [collectedData, setCollectedData] = useState<
    Partial<RegistrationFormData>
  >({});

  const [birthDate, setBirthDate] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [categoryToLearn, setCategoryToLearn] = useState<number | undefined>(
    undefined,
  );
  const [subcategoryToLearn, setSubcategoryToLearn] = useState<
    number | undefined
  >(undefined);
  const [categoryToTeach, setCategoryToTeach] = useState<number | undefined>(
    undefined,
  );
  const [subcategoryToTeach, setSubcategoryToTeach] = useState<
    number | undefined
  >(undefined);
  const [currentContainer, setCurrentContainer] = useState<1 | 2 | 3>(1);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  // Добавляем состояние для сбора данных всех шагов

  // Эффект для синхронизации currentContainer с хэшем
  useEffect(() => {
    const getStepFromHash = (): 1 | 2 | 3 => {
      const hash = location.hash;
      if (hash === '#step2') return 2;
      if (hash === '#step3') return 3;
      return 1;
    };

    // Устанавливаем начальное состояние только один раз
    const initialStep = getStepFromHash();
    setCurrentContainer(initialStep);
  }, [location.hash]); // Зависимость только от хэша

  useEffect(() => {
    navigate(`#step${currentContainer}`, { replace: true });
  }, [currentContainer, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
    getValues,
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(registrationSchema),
    mode: 'onBlur',
  });

  const [genderValue, setGenderValue] = useState<string>('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value, { name }) => {
      if (name === 'gender') {
        setGenderValue(value.gender || '');
      }
    });
    return subscription.unsubscribe;
  }, [watch]);

  const handleNext = useCallback(
    async (e?: React.MouseEvent | React.FormEvent) => {
      e?.preventDefault();

      let isValid = true;

      if (currentContainer === 1) {
        isValid = await trigger(['email', 'password']);
      } else if (currentContainer === 2) {
        isValid = await trigger([
          'avatar',
          'name',
          'birthDate',
          'gender',
          'city',
          'categoryToLearn',
          'subcategoryToLearn',
        ]);
      } else if (currentContainer === 3) {
        isValid = await trigger([
          'categoryToTeach',
          'subcategoryToTeach',
          'skillName',
          'skillDescription',
          'photos',
        ]);
      }

      if (!isValid) {
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const currentStepData: Partial<RegistrationFormData> = {};
      switch (currentContainer) {
        case 1:
          currentStepData.email = getValues('email');
          currentStepData.password = getValues('password');
          break;
        case 2:
          currentStepData.avatar = avatar;
          currentStepData.name = getValues('name');
          currentStepData.birthDate = birthDate;
          currentStepData.gender = getValues('gender');
          currentStepData.city = selectedCity;
          currentStepData.categoryToLearn = categoryToLearn;
          currentStepData.subcategoryToLearn = subcategoryToLearn;
          break;
        case 3:
          currentStepData.categoryToTeach = categoryToTeach;
          currentStepData.subcategoryToTeach = subcategoryToTeach;
          currentStepData.skillName = getValues('skillName');
          currentStepData.skillDescription = getValues('skillDescription');
          currentStepData.photos = uploadedPhotos;
          break;
      }

      setCollectedData((prev) => ({ ...prev, ...currentStepData }));

      // Только обновляем состояние — навигация будет в эффекте
      setCurrentContainer((prev) =>
        prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev,
      );
    },
    [
      currentContainer,
      trigger,
      errors,
      getValues,
      avatar,
      birthDate,
      selectedCity,
      categoryToLearn,
      subcategoryToLearn,
      categoryToTeach,
      subcategoryToTeach,
      uploadedPhotos,
    ],
  );

  const handleBack = useCallback(() => {
    // Сначала обновляем состояние
    setCurrentContainer((prev: 1 | 2 | 3) => {
      const newStep = prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev;

      // Восстанавливаем данные предыдущего шага в форму
      if (newStep === 1 && collectedData.email) {
        setValue('email', collectedData.email);
        if (collectedData.password) {
          setValue('password', collectedData.password);
        }
      } else if (newStep === 2) {
        if (collectedData.name) {
          setValue('name', collectedData.name);
        }
        if (collectedData.birthDate) {
          setBirthDate(collectedData.birthDate);
          setValue('birthDate', collectedData.birthDate);
        }
        if (collectedData.gender) {
          setValue('gender', collectedData.gender);
        }
        if (collectedData.city) {
          setSelectedCity(collectedData.city);
          setValue('city', collectedData.city);
        }
        if (collectedData.avatar) {
          // восстанавливаем аватар
          setAvatar(collectedData.avatar);
          setValue('avatar', collectedData.avatar);
        }
        if (collectedData.categoryToLearn !== undefined) {
          setCategoryToLearn(collectedData.categoryToLearn);
          setValue('categoryToLearn', collectedData.categoryToLearn);
        }
        if (collectedData.subcategoryToLearn !== undefined) {
          setSubcategoryToLearn(collectedData.subcategoryToLearn);
          setValue('subcategoryToLearn', collectedData.subcategoryToLearn);
        }
      } else if (newStep === 3) {
        if (collectedData.categoryToTeach !== undefined) {
          setCategoryToTeach(collectedData.categoryToTeach);
          setValue('categoryToTeach', collectedData.categoryToTeach);
        }
        if (collectedData.subcategoryToTeach !== undefined) {
          setSubcategoryToTeach(collectedData.subcategoryToTeach);
          setValue('subcategoryToTeach', collectedData.subcategoryToTeach);
        }
        if (collectedData.skillName) {
          setValue('skillName', collectedData.skillName);
        }
        if (collectedData.skillDescription) {
          setValue('skillDescription', collectedData.skillDescription);
        }
        if (collectedData.photos) {
          setUploadedPhotos(collectedData.photos);
          setValue('photos', collectedData.photos);
        }
      }

      return newStep;
    });
  }, [
    collectedData,
    setValue,
    setBirthDate,
    setSelectedCity,
    setCategoryToLearn,
    setSubcategoryToLearn,
    setCategoryToTeach,
    setSubcategoryToTeach,
    setUploadedPhotos,
  ]);

  const onSubmit = async (data: RegistrationFormData) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      // Объединяем данные всех шагов с финальными данными формы
      const fullData: RegistrationFormData = {
        ...collectedData,
        ...data,
        birthDate: birthDate || collectedData.birthDate || '',
        city: selectedCity || collectedData.city || '',
        categoryToLearn: categoryToLearn ?? collectedData.categoryToLearn ?? 0,
        subcategoryToLearn:
          subcategoryToLearn ?? collectedData.subcategoryToLearn ?? 0,
        categoryToTeach: categoryToTeach ?? collectedData.categoryToTeach ?? 0,
        subcategoryToTeach:
          subcategoryToTeach ?? collectedData.subcategoryToTeach ?? 0,
        avatar: avatar ?? collectedData.avatar ?? null, // добавляем аватар
        photos:
          uploadedPhotos.length > 0
            ? uploadedPhotos
            : collectedData.photos || [],
      };

      console.log('Финальный объект для моков:', fullData);

      // Моковая регистрация
      const mockResponse = {
        userId: 'mock-user-id-' + Date.now(),
        skillId: 'mock-skill-id-' + Date.now(),
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', mockResponse.userId);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError('Произошла ошибка. Попробуйте позже.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    console.log(`Login with ${provider}`);
  };

  const handleClose = () => {
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Обработчик выбора даты

  const handleDateSelect = (dateString: string) => {
    setBirthDate(dateString);
    setValue('birthDate', dateString, {
      shouldValidate: true, // принудительная валидация
      shouldDirty: true,
    });

    if (currentContainer === 2) {
      setCollectedData((prev) => ({ ...prev, birthDate: dateString }));
    }
  };

  // Обработчик выбора города
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setValue('city', city);
    if (currentContainer === 2) {
      setCollectedData((prev) => ({ ...prev, city }));
    }
  };

  // Обработчик выбора категории
  const handleCategorySelect = (categoryId: number) => {
    setCategoryToTeach(categoryId);
    setValue('categoryToTeach', categoryId);
    if (currentContainer === 3) {
      setCollectedData((prev) => ({ ...prev, categoryToTeach: categoryId }));
    }
  };

  const handleSubcategorySelect = (subcategoryId: number) => {
    setSubcategoryToTeach(subcategoryId);
    setValue('subcategoryToTeach', subcategoryId);
    if (currentContainer === 3) {
      setCollectedData((prev) => ({
        ...prev,
        subcategoryToTeach: subcategoryId,
      }));
    }
  };

  const handleLearnCategorySelect = (categoryId: number) => {
    setCategoryToLearn(categoryId);
    setValue('categoryToLearn', categoryId);
    if (currentContainer === 2) {
      setCollectedData((prev) => ({ ...prev, categoryToLearn: categoryId }));
    }
  };

  const handleLearnSubcategorySelect = (subCategoryId: number) => {
    setSubcategoryToLearn(subCategoryId);
    setValue('subcategoryToLearn', subCategoryId);
    if (currentContainer === 2) {
      setCollectedData((prev) => ({ ...prev, categoryToLearn: subCategoryId }));
    }
  };

  const handleAvatarUpload = (file: File) => {
    setAvatar(file);
    setValue('avatar', file);
    if (currentContainer === 2) {
      setCollectedData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handlePhotoUpload = (files: File[]) => {
    setUploadedPhotos(files);
    setValue('photos', files);
    if (currentContainer === 3) {
      setCollectedData((prev) => ({ ...prev, photos: files }));
    }
  };

  return (
    <div className={styles['page']}>
      <LoginHeader onClose={handleClose} />

      <div className={styles['container']}>
        {currentContainer === 1 && (
          <>
            <div className={styles['page-title']}>
              <h2>Шаг 1 из 3</h2>
              <ProgressBar currentStep={currentContainer} />
            </div>

            <div className={styles['content']}>
              <div className={styles['left-side']}>
                <div className={styles['social-buttons']}>
                  <button
                    type='button'
                    className={styles['social-button']}
                    onClick={() => handleSocialLogin('google')}
                  >
                    <span className={styles['social-icon']}>
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        <path
                          d='M19.6 10.23c0-.82-.08-1.48-.25-2.14H10v3.89h5.48c-.22 1.2-.86 2.2-1.82 2.88v2.4h2.94c1.72-1.59 2.7-3.93 2.7-6.72z'
                          fill='#4285F4'
                        />
                        <path
                          d='M10 20c2.45 0 4.5-.81 6-2.18l-2.94-2.4c-.82.56-1.88.89-3.06.89-2.36 0-4.36-1.59-5.07-3.74H1.96v2.48C3.46 17.8 6.56 20 10 20z'
                          fill='#34A853'
                        />
                        <path
                          d='M4.93 12.57c-.18-.55-.28-1.14-.28-1.77s.1-1.22.28-1.77V6.55H1.96C1.35 7.78 1 9.17 1 10.7c0 1.53.35 2.92.96 4.15l2.97-2.48z'
                          fill='#FBBC05'
                        />
                        <path
                          d='M10 3.88c1.33 0 2.52.46 3.46 1.36l2.59-2.59C14.49 1.16 12.44.2 10 .2 6.56.2 3.46 2.2 1.96 5.55l2.97 2.48c.71-2.15 2.71-3.74 5.07-3.74z'
                          fill='#EA4335'
                        />
                      </svg>
                    </span>
                    Продолжить с Google
                  </button>
                  <button
                    type='button'
                    className={styles['social-button']}
                    onClick={() => handleSocialLogin('apple')}
                  >
                    <span className={styles['social-icon']}>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M11.6545 5.77578C11.3986 4.3804 12.0583 2.94439 12.8529 1.97664C13.7286 0.908854 15.2314 0.0899883 16.5157 0C16.7326 1.46297 16.1356 2.88836 15.3497 3.8966C14.5066 4.97974 13.0571 5.8197 11.6545 5.77578ZM19.1875 10.832C19.5849 9.72329 20.3722 8.72577 21.5935 8.05273C20.3593 6.5126 18.6265 5.61845 16.9912 5.61845C14.8277 5.61845 13.9129 6.64923 12.4102 6.64923C10.8621 6.64923 9.68774 5.61845 7.81372 5.61845C5.97605 5.61845 4.01993 6.73851 2.77935 8.65142C2.32321 9.3585 2.01422 10.2369 1.8457 11.2153C1.3781 13.96 2.07659 17.535 4.16018 20.7094C5.17325 22.2497 6.52359 23.9847 8.28766 23.9998C9.85912 24.0152 10.3049 22.9951 12.4323 22.9846C14.5628 22.9725 14.9666 24.0104 16.5359 23.9954C18.3005 23.9805 19.7252 22.0604 20.7383 20.5203C21.4596 19.4151 21.7324 18.8568 22.2933 17.6073C19.4412 16.5317 18.2681 13.3889 19.1875 10.832Z'
                          fill='#253017'
                        />
                      </svg>
                    </span>
                    Продолжить с Apple
                  </button>
                </div>

                <div className={styles['divider']}>
                  <span className={styles['divider-line']}></span>
                  <p className={styles['divider-text']}>или</p>
                  <span className={styles['divider-line']}></span>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={styles['form']}
                >
                  <div className={styles['field']}>
                    <label htmlFor='email' className={styles['label']}>
                      Email
                    </label>
                    <input
                      id='email'
                      type='email'
                      placeholder='Введите email'
                      className={`${styles['input']} ${errors.email ? styles['input-error'] : ''}`}
                      {...register('email')}
                      autoComplete='email'
                    />
                    {errors.email && (
                      <span className={styles['field-error']}>
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label htmlFor='password' className={styles['label']}>
                      Пароль
                    </label>
                    <div className={styles['password-wrapper']}>
                      <input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Введите ваш пароль'
                        className={`${styles['input']} ${styles['password-input']} ${errors.password ? styles['input-error'] : ''}`}
                        {...register('password')}
                        autoComplete='current-password'
                      />
                      <button
                        type='button'
                        className={styles['eye-button']}
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                      >
                        <Icon
                          name={showPassword ? 'eye' : 'eye-slash'}
                          size={24}
                        />
                      </button>
                    </div>
                    {errors.password && (
                      <span className={styles['field-error']}>
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  {authError && (
                    <div className={styles['auth-error']}>
                      <p className={styles['auth-error-text']}>{authError}</p>
                    </div>
                  )}

                  <Button
                    type='button'
                    variant='primary'
                    className={styles['submit-button']}
                    onClick={() => handleNext()}
                    disabled={isLoading}
                    children={isLoading ? 'Переход...' : 'Далее'}
                  />
                </form>
              </div>

              <div className={styles['right-side']}>
                <div className={styles['hero-icon']}>
                  <Icon name='light-bulb' size={300} />
                </div>
                <h1 className={styles['hero-title']}>
                  Добро пожаловать в SkillSwap!
                </h1>
                <p className={styles['hero-subtitle']}>
                  Присоединяйтесь к SkillSwap и обменивайтесь знаниями и
                  навыками с другими людьми
                </p>
              </div>
            </div>
          </>
        )}
        {currentContainer === 2 && (
          <>
            <div className={styles['page-title']}>
              <h2>Шаг 2 из 3</h2>
              <ProgressBar currentStep={currentContainer} />
            </div>

            <div className={styles['content']}>
              <div className={styles['left-side']}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                  className={styles['form']}
                >
                  <div className={styles['field']}>
                    <ImageUploadField
                      onUpload={handleAvatarUpload}
                      label='Загрузите аватар профиля'
                      singleSelection={true}
                      acceptedFormats={[
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                      ]}
                    />
                    {errors.avatar && (
                      <span className={styles['field-error']}>
                        {errors.avatar.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label htmlFor='name' className={styles['label']}>
                      Имя
                    </label>
                    <input
                      id='name'
                      type='text'
                      placeholder='Введите ваше имя'
                      className={`${styles['input']} ${errors.name ? styles['input-error'] : ''}`}
                      {...register('name')}
                      autoComplete='name'
                    />
                    {errors.name && (
                      <span className={styles['field-error']}>
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['personal-parameters']}>
                    <div className={styles['field']}>
                      <DatePicker
                        onDateSelect={handleDateSelect}
                        selectedDate={
                          birthDate ? new Date(birthDate) : undefined
                        }
                      />
                      {errors.birthDate && (
                        <span className={styles['field-error']}>
                          {errors.birthDate.message}
                        </span>
                      )}
                    </div>

                    <div className={styles['field']}>
                      <label htmlFor='gender' className={styles['label']}>
                        Пол
                      </label>
                      <select
                        id='gender'
                        className={`${styles['input']} ${errors.gender ? styles['input-error'] : ''}`}
                        onChange={(e) => setValue('gender', e.target.value)}
                        value={genderValue}
                        autoComplete='sex'
                      >
                        <option value=''>Не указан</option>
                        <option value='male'>Мужской</option>
                        <option value='female'>Женский</option>
                      </select>
                      {errors.gender && (
                        <span className={styles['field-error']}>
                          {errors.gender.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles['field']}>
                    <label htmlFor='city' className={styles['label']}>
                      Город
                    </label>
                    <input
                      id='city'
                      type='text'
                      placeholder='Введите город'
                      className={`${styles['input']} ${errors.city ? styles['input-error'] : ''}`}
                      value={selectedCity}
                      onChange={(e) => handleCitySelect(e.target.value)}
                      autoComplete='address-level2'
                    />
                    {errors.city && (
                      <span className={styles['field-error']}>
                        {errors.city.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label
                      htmlFor='category-to-learn'
                      className={styles['label']}
                    >
                      Категория навыка, которому хотите научиться
                    </label>
                    <select
                      id='category-to-learn'
                      className={`${styles['input']} ${errors.categoryToLearn ? styles['input-error'] : ''}`}
                      onChange={(e) =>
                        handleLearnCategorySelect(Number(e.target.value))
                      }
                      value={categoryToLearn ?? ''}
                    >
                      <option value=''>Выберите категорию навыка</option>
                    </select>
                    {errors.categoryToLearn && (
                      <span className={styles['field-error']}>
                        {errors.categoryToLearn.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label
                      htmlFor='subcategory-to-learn'
                      className={styles['label']}
                    >
                      Подкатегория навыка, которому хотите научить
                    </label>
                    <select
                      id='subcategory-to-learn'
                      className={`${styles['input']} ${errors.subcategoryToLearn ? styles['input-error'] : ''}`}
                      onChange={(e) =>
                        handleLearnSubcategorySelect(Number(e.target.value))
                      }
                      value={subcategoryToLearn ?? ''}
                    >
                      <option value=''>Выберите подкатегорию навыка</option>
                    </select>
                    {errors.subcategoryToLearn && (
                      <span className={styles['field-error']}>
                        {errors.subcategoryToLearn.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['actions']}>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={handleBack}
                      children='Назад'
                    />
                    <Button
                      type='button'
                      variant='primary'
                      onClick={() => handleNext()}
                      disabled={isLoading}
                      children={isLoading ? 'Загрузка...' : 'Далее'}
                    />
                  </div>
                </form>
              </div>

              <div className={styles['right-side']}>
                <div className={styles['hero-icon']}>
                  <Icon name='user-info' size={300} />
                </div>
                <h1 className={styles['hero-title']}>
                  Расскажите немного о себе
                </h1>
                <p className={styles['hero-subtitle']}>
                  Это поможет другим людям лучше вас узнать, чтобы выбрать для
                  обмена
                </p>
              </div>
            </div>
          </>
        )}
        {currentContainer === 3 && (
          <>
            <div className={styles['page-title']}>
              <h2>Шаг 3 из 3</h2>
              <ProgressBar currentStep={currentContainer} />
            </div>

            <div className={styles['content']}>
              <div className={styles['left-side']}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={styles['form']}
                >
                  <div className={styles['field']}>
                    <label
                      htmlFor='category-to-teach'
                      className={styles['label']}
                    >
                      Категория навыка, которому хотите научить
                    </label>
                    <select
                      id='category-to-teach'
                      className={`${styles['input']} ${errors.categoryToTeach ? styles['input-error'] : ''}`}
                      onChange={(e) =>
                        handleCategorySelect(Number(e.target.value))
                      }
                      value={categoryToTeach ?? ''}
                    >
                      <option value=''>Выберите категорию</option>
                      {/* Здесь будут опции из categories */}
                    </select>
                    {errors.categoryToTeach && (
                      <span className={styles['field-error']}>
                        {errors.categoryToTeach.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label
                      htmlFor='subcategory-to-teach'
                      className={styles['label']}
                    >
                      Категория навыка, которому хотите научить
                    </label>
                    <select
                      id='subcategory-to-teach'
                      className={`${styles['input']} ${errors.subcategoryToTeach ? styles['input-error'] : ''}`}
                      onChange={(e) =>
                        handleSubcategorySelect(Number(e.target.value))
                      }
                      value={subcategoryToTeach ?? ''}
                    >
                      <option value=''>Выберите категорию</option>
                      {/* Здесь будут опции из categories */}
                    </select>
                    {errors.subcategoryToTeach && (
                      <span className={styles['field-error']}>
                        {errors.subcategoryToTeach.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label htmlFor='skill-name' className={styles['label']}>
                      Название навыка
                    </label>
                    <input
                      id='skill-name'
                      type='text'
                      placeholder='Например: Основы JavaScript'
                      className={`${styles['input']} ${errors.skillName ? styles['input-error'] : ''}`}
                      {...register('skillName')}
                    />
                    {errors.skillName && (
                      <span className={styles['field-error']}>
                        {errors.skillName.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label
                      htmlFor='skill-description'
                      className={styles['label']}
                    >
                      Описание навыка
                    </label>
                    <Textarea
                      id='skill-description'
                      {...register('skillDescription')}
                      placeholder='Расскажите подробнее о навыке, которому хотите научить...'
                      className={`${styles['textarea']} ${errors.skillDescription ? styles['input-error'] : ''}`}
                      rows={4}
                    />
                    {errors.skillDescription && (
                      <span className={styles['field-error']}>
                        {errors.skillDescription.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label className={styles['label']}>Фотографии навыка</label>
                    <ImageUploadField
                      onFilesChange={handlePhotoUpload}
                      uploadedFiles={uploadedPhotos}
                      label='Перетащите до 5 фото навыков сюда или кликните для выбора'
                      singleSelection={false}
                      maxFiles={7}
                      acceptedFormats={[
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                      ]}
                    />
                    {errors.photos && (
                      <span className={styles['field-error']}>
                        {errors.photos.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['actions']}>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={handleBack}
                      children='Назад'
                    />
                    <Button
                      type='submit'
                      variant='primary'
                      disabled={isLoading}
                      children={
                        isLoading ? 'Регистрация...' : 'Завершить регистрацию'
                      }
                    />
                  </div>
                </form>
              </div>

              <div className={styles['right-side']}>
                <div className={styles['hero-icon']}>
                  <Icon name='school-board' size={300} />
                </div>
                <h1 className={styles['hero-title']}>
                  Поделитесь своими навыками
                </h1>
                <p className={styles['hero-subtitle']}>
                  Расскажите, чему вы можете научить других участников
                  сообщества
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
