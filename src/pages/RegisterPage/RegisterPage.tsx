// src/pages/RegisterPage/RegisterPage.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useAuth } from '../../shared/hooks/useAuth';
import { getMockDbState } from '@/api/mock-db-store';
import { ModalUI } from '@/shared/ui/Modal/Modal';
import { ImageView } from '../../widgets/ImageView/ImageView';

// Предварительно загруженные данные
let cachedCities: { value: string; label: string }[] = [];
let cachedCategories: { value: number; label: string }[] = [];
let cachedSubcategories: {
  value: number;
  label: string;
  categoryId: number;
}[] = [];

const loadInitialData = async () => {
  if (cachedCities.length > 0 && cachedCategories.length > 0) {
    return {
      cities: cachedCities,
      categories: cachedCategories,
      subcategories: cachedSubcategories,
    };
  }

  const dbState = await getMockDbState();

  // Города
  cachedCities = dbState.cities.map((city) => ({
    value: city.name,
    label: city.name,
  }));

  // Категории
  cachedCategories = dbState.categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  // Подкатегории с привязкой к категориям
  cachedSubcategories = dbState.subcategories.map((sub) => ({
    value: sub.id,
    label: sub.name,
    categoryId: sub.categoryId,
  }));

  return {
    cities: cachedCities,
    categories: cachedCategories,
    subcategories: cachedSubcategories,
  };
};

type CategoryType = 'learn' | 'teach';

const getCategoryField = (type: CategoryType) =>
  type === 'learn' ? 'categoryToLearn' : 'categoryToTeach';

const getSubcategoryField = (type: CategoryType) =>
  type === 'learn' ? 'subcategoryToLearn' : 'subcategoryToTeach';

// Синхронная валидация на основе кэшированных данных
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
    .string() // теперь string вместо mixed<File>
    .nullable()
    .defined()
    .test(
      'valid-avatar',
      'Аватар должен быть корректным URL или null',
      (value) => {
        if (!value) return true; // null допустим
        try {
          new URL(value); // проверяем, что это валидный URL
          return true;
        } catch {
          return false;
        }
      },
    ),
  name: yup.string().required('Имя обязательно'),
  birthDate: yup
    .string()
    .required('Дата рождения обязательна')
    .test('valid-date', 'Введите корректную дату', (value) => {
      if (!value) return false;
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      return isValid(parsedDate);
    }),
  gender: yup
    .string()
    .required('Пол обязателен')
    .transform((value) => (value === '' ? undefined : value))
    .test('valid-gender', 'Выберите корректный пол', (value) => {
      if (!value) return false;
      return ['female', 'male'].includes(value);
    }),
  city: yup
    .string()
    .required('Город обязателен')
    .test('valid-city', 'Город не найден в базе', (value) => {
      if (!value) return false;
      return cachedCities.some(
        (city) => city.value.toLowerCase() === value.toLowerCase(),
      );
    }),
  categoryToLearn: yup
    .number()
    .required('Категория обязательна')
    .test('valid-category', 'Категория не найдена', (value) => {
      return cachedCategories.some((cat) => cat.value === value);
    }),
  subcategoryToLearn: yup
    .number()
    .required('Подкатегория обязательна')
    .test(
      'valid-subcategory',
      'Подкатегория не найдена',
      (value, { parent }) => {
        if (!value || !parent.categoryToLearn) return false;
        const subcategory = cachedSubcategories.find(
          (sub) => sub.value === value,
        );
        return (
          !!subcategory && subcategory.categoryId === parent.categoryToLearn
        );
      },
    ),

  categoryToTeach: yup
    .number()
    .required('Категория навыка обязательна')
    .test('valid-category-teach', 'Категория не найдена', (value) => {
      return cachedCategories.some((cat) => cat.value === value);
    }),
  subcategoryToTeach: yup
    .number()
    .required('Подкатегория навыка обязательна')
    .test(
      'valid-subcategory-teach',
      'Подкатегория не найдена или не соответствует категории',
      (value, { parent }) => {
        if (!value || !parent.categoryToTeach) return false;
        const subcategory = cachedSubcategories.find(
          (sub) => sub.value === value,
        );
        return (
          !!subcategory && subcategory.categoryId === parent.categoryToTeach
        );
      },
    ),
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
        .defined()
        .test('fileSize', 'Файл не должен превышать 10 МБ', (file) => {
          if (!file) return true;
          return file.size <= 10 * 1024 * 1024;
        }),
    )
    .defined()
    .min(1, 'Необходимо загрузить хотя бы одно фото')
    .max(5, 'Можно загрузить не более 5 фото'),
});

const genderOptions = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
];

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useAuth();
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const generateUserId = (): string => {
    return (
      'user-' +
      Math.random().toString(36).substr(2, 9) +
      Date.now().toString().substr(-4)
    );
  };
  const [openSelects, setOpenSelects] = useState<Record<string, boolean>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [collectedData, setCollectedData] = useState<
    Partial<RegistrationFormData>
  >({});

  // Оптимизированные состояния с данными из моков
  const [cityOptions, setCityOptions] = useState(cachedCities);
  const [categoryOptions, setCategoryOptions] = useState(cachedCategories);
  const [subcategoryOptions, setSubcategoryOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [currentContainer, setCurrentContainer] = useState<1 | 2 | 3>(1);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);

  // Эффект для синхронизации currentContainer с хэшем
  useEffect(() => {
    const getStepFromHash = (): 1 | 2 | 3 => {
      const hash = location.hash;
      if (hash === '#step2') return 2;
      if (hash === '#step3') return 3;
      return 1;
    };

    const initialStep = getStepFromHash();
    setCurrentContainer(initialStep);
  }, [location.hash]);

  useEffect(() => {
    navigate(`#step${currentContainer}`, { replace: true });
  }, [currentContainer, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (cityOptions.length > 0 && categoryOptions.length > 0) {
        return;
      }

      if (isLoading) return;

      try {
        const { cities, categories, subcategories } = await loadInitialData();
        setCityOptions(cities);
        setCategoryOptions(categories);
        cachedSubcategories = subcategories;
      } catch (error) {
        console.error('Ошибка загрузки начальных данных:', error);
        setAuthError('Не удалось загрузить данные. Попробуйте позже.');
      } finally {
        setIsLoading(false); // Всегда сбрасываем загрузку
      }
    };
    loadData();
  }, [cityOptions.length, categoryOptions.length, isLoading]); // зависимость только по длине массива

  const openSelect = (id: string) => {
    setOpenSelects((prev) => ({ ...prev, [id]: true }));
  };

  const closeSelect = (id: string) => {
    setOpenSelects((prev) => ({ ...prev, [id]: false }));
  };

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
    getValues,
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(registrationSchema),
    mode: 'onChange', // валидация при каждом изменении поля
    reValidateMode: 'onChange', // повторная валидация при изменении
    defaultValues: {
      email: '',
      password: '',
      avatar: null,
      name: '',
      birthDate: '',
      gender: '',
      city: '',
      categoryToLearn: undefined,
      subcategoryToLearn: undefined,
      categoryToTeach: undefined,
      subcategoryToTeach: undefined,
      skillName: '',
      skillDescription: '',
      photos: [],
    },
  });

  const selectedCity = watch('city');
  const categoryToLearn = watch('categoryToLearn');
  const subcategoryToLearn = watch('subcategoryToLearn');
  const categoryToTeach = watch('categoryToTeach');
  const subcategoryToTeach = watch('subcategoryToTeach');
  const birthDate = watch('birthDate');

  const filteredSubcategories = useMemo(() => {
    const currentCategory =
      currentContainer === 2 ? categoryToLearn : categoryToTeach;

    if (!currentCategory) return [];

    return cachedSubcategories
      .filter((sub) => sub.categoryId === currentCategory)
      .map((sub) => ({ value: sub.value, label: sub.label }));
  }, [categoryToLearn, categoryToTeach, currentContainer]);

  useEffect(() => {
    setSubcategoryOptions(filteredSubcategories);

    // Сбрасываем выбранную подкатегорию, если она не относится к новой категории
    if (currentContainer === 2) {
      if (
        subcategoryToLearn !== undefined &&
        !filteredSubcategories.some((sub) => sub.value === subcategoryToLearn)
      ) {
        setValue('subcategoryToLearn', NaN, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } else if (currentContainer === 3) {
      if (
        subcategoryToTeach !== undefined &&
        !filteredSubcategories.some((sub) => sub.value === subcategoryToTeach)
      ) {
        setValue('subcategoryToTeach', NaN, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [
    filteredSubcategories,
    subcategoryToLearn,
    subcategoryToTeach,
    currentContainer,
    setValue,
  ]);

  const validateCurrentStep = useCallback(
    async (field?: keyof RegistrationFormData): Promise<boolean> => {
      if (field) {
        // Валидируем только переданное поле
        return await trigger([field]);
      }

      // Иначе — все поля текущего шага
      let fieldsToValidate: (keyof RegistrationFormData)[];

      switch (currentContainer) {
        case 1:
          fieldsToValidate = ['email', 'password'];
          break;
        case 2:
          fieldsToValidate = [
            'name',
            'birthDate',
            'gender',
            'city',
            'avatar',
            'categoryToLearn',
            'subcategoryToLearn',
          ];
          break;
        case 3:
          fieldsToValidate = [
            'categoryToTeach',
            'subcategoryToTeach',
            'skillName',
            'skillDescription',
            'photos',
          ];
          break;
        default:
          fieldsToValidate = [];
      }

      return await trigger(fieldsToValidate);
    },
    [currentContainer, trigger],
  );

  // Единый обработчик выбора города
  const handleCitySelect = (cityName: string) => {
    setValue('city', cityName, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCategorySelect = (categoryId: number, type: CategoryType) => {
    const categoryField = getCategoryField(type);
    const subcategoryField = getSubcategoryField(type);

    setValue(categoryField, categoryId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Сбрасываем подкатегорию при смене категории
    setValue(subcategoryField, NaN, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSubcategorySelect = (
    subcategoryId: number,
    type: CategoryType,
  ) => {
    const subcategoryField = getSubcategoryField(type);
    setValue(subcategoryField, subcategoryId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Обработчик загрузки аватара
  const handleAvatarUpload = async (file: File) => {
    setAvatar(file);

    // Создаём URL для отображения
    const newAvatarUrl = URL.createObjectURL(file);
    setAvatarUrl(newAvatarUrl);

    // Сохраняем URL в форму (тип string | null)
    setValue('avatar', newAvatarUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });

    await validateCurrentStep('avatar');
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
      uploadedPhotoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [avatarUrl, uploadedPhotoUrls]);

  // Обработчик загрузки фото навыков
  const handlePhotoUpload = async (files: File[]) => {
    setUploadedPhotos(files);
    setValue('photos', files);

    // Создаём URL для каждого файла
    const urls = files.map((file) => URL.createObjectURL(file));
    setUploadedPhotoUrls(urls);

    if (currentContainer === 3) {
      setCollectedData((prev) => ({ ...prev, photos: files }));
    }
    await validateCurrentStep();
  };

  useEffect(() => {
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
      // Очищаем URL загруженных фото
      uploadedPhotoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [avatarUrl, uploadedPhotoUrls]);

  const collectCurrentStepData =
    useCallback((): Partial<RegistrationFormData> => {
      return getValues();
    }, [getValues]);

  const restoreStepData = useCallback(
    (step: 1 | 2 | 3) => {
      const data = collectedData;
      switch (step) {
        case 1:
          if (data.email) setValue('email', data.email);
          if (data.password) setValue('password', data.password);
          break;
        case 2:
          if (data.name) setValue('name', data.name);
          if (data.birthDate) {
            setValue('birthDate', data.birthDate);
          }
          if (data.gender) setValue('gender', data.gender);
          if (data.city) {
            setValue('city', data.city);
          }
          if (data.avatar) {
            setValue('avatar', data.avatar);
          }
          if (data.categoryToLearn !== undefined) {
            setValue('categoryToLearn', data.categoryToLearn);
          }
          if (data.subcategoryToLearn !== undefined) {
            setValue('subcategoryToLearn', data.subcategoryToLearn);
          }
          break;
        case 3:
          if (data.categoryToTeach !== undefined) {
            setValue('categoryToTeach', data.categoryToTeach);
          }
          if (data.subcategoryToTeach !== undefined) {
            setValue('subcategoryToTeach', data.subcategoryToTeach);
          }
          if (data.skillName) setValue('skillName', data.skillName);
          if (data.skillDescription)
            setValue('skillDescription', data.skillDescription);
          if (data.photos) {
            setValue('photos', data.photos);
          }
          break;
      }
    },
    [collectedData, setValue],
  );

  const logCurrentStepData = useCallback(() => {
    const currentData = collectCurrentStepData();
    console.log(`Данные шага ${currentContainer}:`, currentData);
  }, [currentContainer, collectCurrentStepData]);

  // Обработчик перехода к следующему шагу
  const handleNext = useCallback(
    async (e?: React.MouseEvent | React.FormEvent) => {
      e?.preventDefault();
      setIsLoading(true);

      try {
        const isValid = await validateCurrentStep(); // Используем единую логику

        if (!isValid) {
          console.warn('Валидация не пройдена. Ошибки:', errors);
          setIsLoading(false);
          return;
        }

        // Собираем данные текущего шага
        const currentStepData = collectCurrentStepData();
        setCollectedData((prev) => ({ ...prev, ...currentStepData }));
        logCurrentStepData();

        if (currentContainer < 3) {
          setCurrentContainer((prev) => (prev + 1) as 1 | 2 | 3);
        } else {
          setIsConfirmationModalOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      logCurrentStepData,
      currentContainer,
      validateCurrentStep,
      collectCurrentStepData,
      errors,
    ],
  );

  const handleBack = useCallback(() => {
    setAuthError(null);
    setCurrentContainer((prev: 1 | 2 | 3) => {
      const newStep = prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev;
      restoreStepData(newStep);
      return newStep;
    });
  }, [restoreStepData]);

  const handleEdit = () => {
    setIsConfirmationModalOpen(false);
    setCurrentContainer(3); // Возвращаемся на последний шаг
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const isValid = await trigger(); // валидируем всю форму
      if (!isValid) {
        console.warn('Не все поля заполнены корректно');
        return;
      }
      const userData: RegistrationFormData & { id: string } = {
        id: generateUserId(),
        email: getValues('email'),
        name: getValues('name'),
        birthDate: getValues('birthDate'),
        gender: getValues('gender'),
        city: getValues('city'),
        avatar: getValues('avatar'),
        password: getValues('password'),
        categoryToLearn: getValues('categoryToLearn'),
        subcategoryToLearn: getValues('subcategoryToLearn'),
        categoryToTeach: getValues('categoryToTeach'),
        subcategoryToTeach: getValues('subcategoryToTeach'),
        skillName: getValues('skillName'),
        skillDescription: getValues('skillDescription'),
        photos: getValues('photos'),
      };

      console.log('Полный объект данных пользователя:', userData);

      localStorage.setItem('userData', JSON.stringify(userData));
      login(userData);
      console.log('Пользователь зарегистрирован:', userData);
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setAuthError('Не удалось завершить регистрацию. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Очистка URL аватара
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
      // Очистка URL загруженных фото
      uploadedPhotoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [avatarUrl, uploadedPhotoUrls]);

  const cleanupAvatarURL = (url: string) => {
    URL.revokeObjectURL(url);
  };

  // Эффект для автоматической очистки при размонтировании компонента
  useEffect(() => {
    return () => {
      if (avatar && avatarUrl) {
        cleanupAvatarURL(avatarUrl);
      }
    };
  }, [avatar, avatarUrl]);

  // Обработчик входа через соцсети
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
    setValue('birthDate', dateString, {
      shouldValidate: true, // запускаем валидацию поля
      shouldDirty: true, // отмечаем поле как изменённое
    });
  };

  const handleRemoveAvatar = () => {
    if (avatarUrl) {
      URL.revokeObjectURL(avatarUrl);
    }
    setAvatar(null);
    setAvatarUrl(null);

    // Сбрасываем поле до null
    setValue('avatar', null, {
      shouldValidate: true,
      shouldDirty: true,
    });
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
                    aria-label='Продолжить с Google'
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
                    aria-label='Продолжить с Apple'
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

                <form onSubmit={handleNext} noValidate>
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
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                    />
                    {errors.email && (
                      <span
                        id='email-error'
                        role='alert'
                        className={styles['field-error']}
                      >
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
                        aria-invalid={!!errors.password}
                        aria-describedby={
                          errors.password ? 'password-error' : undefined
                        }
                      />
                      <button
                        type='button'
                        className={styles['eye-button']}
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                        aria-label={
                          showPassword ? 'Скрыть пароль' : 'Показать пароль'
                        }
                      >
                        <Icon
                          name={showPassword ? 'eye' : 'eye-slash'}
                          size={24}
                        />
                      </button>
                    </div>
                    {errors.password && (
                      <span
                        id='password-error'
                        className={styles['field-error']}
                        role='alert'
                      >
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  {authError && (
                    <div
                      className={styles['auth-error']}
                      role='alert'
                      aria-live='assertive'
                    >
                      <p className={styles['auth-error-text']}>{authError}</p>
                    </div>
                  )}

                  <Button
                    type='submit'
                    variant='primary'
                    className={styles['submit-button']}
                    disabled={isLoading || !!errors.email || !!errors.password}
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
                    handleNext(e);
                  }}
                  className={styles['form']}
                  noValidate
                >
                  {/* Аватарка */}
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
                      onRemove={handleRemoveAvatar}
                      hasError={!!errors.avatar}
                    />
                    {errors.avatar && (
                      <span className={styles['field-error']}>
                        {errors.avatar.message}
                      </span>
                    )}
                  </div>

                  {/* Имя */}
                  <div className={styles['field']}>
                    <label htmlFor='name' className={styles['label']}>
                      Имя
                    </label>
                    <input
                      id='name'
                      type='text'
                      required
                      placeholder='Введите ваше имя'
                      className={`${styles['input']} ${errors.name ? styles['input-error'] : ''}`}
                      {...register('name')}
                      autoComplete='name'
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <span
                        id='name-error'
                        className={styles['field-error']}
                        role='alert'
                      >
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['personal-parameters']}>
                    {/* Календарь */}
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

                    {/* Пол */}
                    <div className={styles['field']}>
                      <label htmlFor='gender' className={styles['label']}>
                        Пол
                      </label>
                      <div className={styles['select-wrapper']}>
                        <select
                          id='gender'
                          required
                          className={`${styles['input']} ${styles['select']} ${
                            getValues('gender')
                              ? styles['select-with-selection']
                              : ''
                          } ${errors.gender ? styles['input-error'] : ''}`}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setValue('gender', selectedValue, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            closeSelect('gender');
                          }}
                          value={getValues('gender') || ''}
                          onFocus={() => openSelect('gender')}
                          onBlur={() => closeSelect('gender')}
                          aria-invalid={!!errors.gender}
                          aria-describedby={
                            errors.gender ? 'gender-error' : undefined
                          }
                        >
                          <option
                            className={styles['placeholder']}
                            value=''
                            disabled
                          >
                            Не указан
                          </option>
                          {genderOptions.map((option) => (
                            <option
                              className={styles['option']}
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <Icon
                          name='chevron-down'
                          size='24'
                          className={`${styles['select-arrow']} ${openSelects['gender'] ? styles['arrow-rotated'] : ''}`}
                        />
                      </div>
                      {errors.gender && (
                        <span
                          id='gender-error'
                          className={styles['field-error']}
                          role='alert'
                        >
                          {errors.gender.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Город */}
                  <div className={styles['field']}>
                    <label htmlFor='city' className={styles['label']}>
                      Город
                    </label>
                    <div className={styles['select-wrapper']}>
                      <select
                        id='city'
                        required
                        className={`${styles['input']} ${styles['select']} ${
                          selectedCity ? styles['select-with-selection'] : ''
                        } ${errors.city ? styles['input-error'] : ''}`}
                        onChange={(e) => {
                          handleCitySelect(e.target.value);
                          closeSelect('city');
                        }}
                        value={selectedCity || ''}
                        autoComplete='address-level2'
                        onFocus={() => openSelect('city')}
                        onBlur={() => closeSelect('city')}
                        aria-invalid={!!errors.city}
                        aria-describedby={
                          errors.city ? 'city-error' : undefined
                        }
                      >
                        <option
                          className={styles['placeholder']}
                          value=''
                          disabled
                        >
                          Введите город
                        </option>
                        {cityOptions.map((option) => (
                          <option
                            className={styles['option']}
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Icon
                        name='chevron-down'
                        size='24'
                        className={`${styles['select-arrow']} ${openSelects['city'] ? styles['arrow-rotated'] : ''}`}
                      />
                    </div>
                    {errors.city && (
                      <span
                        id='city-error'
                        className={styles['field-error']}
                        role='alert'
                      >
                        {errors.city.message}
                      </span>
                    )}
                  </div>

                  {/* Категория */}
                  <div className={styles['field']}>
                    <label
                      htmlFor='category-to-learn'
                      className={styles['label']}
                    >
                      Категория навыка, которому хотите научиться
                    </label>

                    <div className={styles['select-wrapper']}>
                      <select
                        id='category-to-learn'
                        required
                        className={`${styles['input']} ${styles['select']} ${
                          categoryToLearn ? styles['select-with-selection'] : ''
                        } ${errors.categoryToLearn ? styles['input-error'] : ''}`}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value)) {
                            handleCategorySelect(value, 'learn');
                          }
                          closeSelect('categoryToLearn');
                        }}
                        value={categoryToLearn ?? ''}
                        onFocus={() => openSelect('categoryToLearn')}
                        onBlur={() => closeSelect('categoryToLearn')}
                        aria-invalid={!!errors.categoryToLearn}
                        aria-describedby={
                          errors.categoryToLearn
                            ? 'categoryToLearn-error'
                            : undefined
                        }
                      >
                        <option
                          className={styles['placeholder']}
                          value=''
                          disabled
                        >
                          Выберите категорию навыка
                        </option>
                        {categoryOptions.map((option) => (
                          <option
                            className={styles['option']}
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Icon
                        name='chevron-down'
                        size='24'
                        className={`${styles['select-arrow']} ${openSelects['categoryToLearn'] ? styles['arrow-rotated'] : ''}`}
                      />
                    </div>
                    {errors.categoryToLearn && (
                      <span
                        id='categoryToLearn-error'
                        className={styles['field-error']}
                        role='alert'
                      >
                        {errors.categoryToLearn.message}
                      </span>
                    )}
                  </div>

                  {/* Подкатегория */}
                  <div className={styles['field']}>
                    <label
                      htmlFor='subcategory-to-learn'
                      className={styles['label']}
                    >
                      Подкатегория навыка, которому хотите научиться
                    </label>
                    <div className={styles['select-wrapper']}>
                      <select
                        id='subcategory-to-learn'
                        required
                        className={`${styles['input']} ${styles['select']} ${
                          subcategoryToLearn
                            ? styles['select-with-selection']
                            : ''
                        } ${errors.subcategoryToLearn ? styles['input-error'] : ''}`}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value)) {
                            handleSubcategorySelect(value, 'learn');
                          }
                          closeSelect('subcategoryToLearn');
                        }}
                        value={subcategoryToLearn || ''}
                        disabled={!categoryToLearn}
                        onFocus={() => openSelect('subcategoryToLearn')}
                        onBlur={() => closeSelect('subcategoryToLearn')}
                        aria-invalid={!!errors.subcategoryToLearn}
                        aria-describedby={
                          errors.subcategoryToLearn
                            ? 'subcategoryToLearn-error'
                            : undefined
                        }
                      >
                        <option
                          className={styles['placeholder']}
                          value=''
                          disabled
                        >
                          Выберите подкатегорию навыка
                        </option>
                        {subcategoryOptions.map((option) => (
                          <option
                            className={styles['option']}
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Icon
                        name='chevron-down'
                        size='24'
                        className={`${styles['select-arrow']} ${openSelects['subcategoryToLearn'] ? styles['arrow-rotated'] : ''}`}
                      />
                    </div>
                    {errors.subcategoryToLearn && (
                      <span
                        id='subcategoryToLearn-error'
                        className={styles['field-error']}
                        role='alert'
                      >
                        {errors.subcategoryToLearn.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['actions']}>
                    <Button
                      className={styles['actions-button']}
                      type='button'
                      variant='secondary'
                      onClick={handleBack}
                      children='Назад'
                    />
                    <Button
                      className={styles['actions-button']}
                      type='submit'
                      variant='primary'
                      disabled={isLoading || Object.keys(errors).length > 0}
                      children={isLoading ? 'Загрузка...' : 'Продолжить'}
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNext(e);
                  }}
                  className={styles['form']}
                  noValidate
                >
                  {/* Название навыка */}
                  <div className={styles['field']}>
                    <label htmlFor='skill-name' className={styles['label']}>
                      Название навыка
                    </label>
                    <input
                      id='skill-name'
                      required
                      type='text'
                      placeholder='Введите название вашего навыка'
                      aria-required='true'
                      aria-invalid={!!errors.skillName}
                      aria-describedby={
                        errors.skillName ? 'skill-name-error' : undefined
                      }
                      className={`${styles['input']} ${errors.skillName ? styles['input-error'] : ''}`}
                      {...register('skillName')}
                    />
                    {errors.skillName && (
                      <span
                        id='skill-name-error'
                        className={styles['field-error']}
                        role='alert'
                      >
                        {errors.skillName.message}
                      </span>
                    )}
                  </div>

                  {/* Категория навыка */}
                  <div className={styles['field']}>
                    <label
                      htmlFor='category-to-teach'
                      className={styles['label']}
                    >
                      Категория навыка
                    </label>

                    <div className={styles['select-wrapper']}>
                      <select
                        id='category-to-teach'
                        required
                        aria-required='true'
                        aria-invalid={!!errors.categoryToTeach}
                        aria-describedby={
                          errors.categoryToTeach
                            ? 'category-to-teach-error'
                            : undefined
                        }
                        className={`${styles['input']} ${styles['select']} ${
                          categoryToTeach ? styles['select-with-selection'] : ''
                        } ${errors.categoryToTeach ? styles['input-error'] : ''}`}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value)) {
                            handleCategorySelect(value, 'teach');
                          }
                          closeSelect('categoryToTeach');
                        }}
                        value={categoryToTeach || ''}
                        onFocus={() => openSelect('categoryToTeach')}
                        onBlur={() => closeSelect('categoryToTeach')}
                      >
                        <option
                          className={styles['placeholder']}
                          value=''
                          disabled
                        >
                          Выберите категорию навыка
                        </option>
                        {categoryOptions.map((option) => (
                          <option
                            className={styles['option']}
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Icon
                        name='chevron-down'
                        size='24'
                        className={`${styles['select-arrow']} ${openSelects['categoryToTeach'] ? styles['arrow-rotated'] : ''}`}
                      />
                    </div>
                    {errors.categoryToTeach && (
                      <span
                        id='category-to-teach-error'
                        className={styles['field-error']}
                        role='alert'
                      >
                        {errors.categoryToTeach.message}
                      </span>
                    )}
                  </div>

                  {/* Подкатегория навыка */}
                  <div className={styles['field']}>
                    <label
                      htmlFor='subcategory-to-teach'
                      className={styles['label']}
                    >
                      Подкатегория навыка
                    </label>

                    <div className={styles['select-wrapper']}>
                      <select
                        id='subcategory-to-teach'
                        required
                        aria-required='true'
                        aria-invalid={!!errors.subcategoryToTeach}
                        aria-describedby={
                          errors.subcategoryToTeach
                            ? 'subcategory-to-teach-error'
                            : undefined
                        }
                        className={`${styles['input']} ${styles['select']} ${
                          subcategoryToTeach
                            ? styles['select-with-selection']
                            : ''
                        } ${errors.subcategoryToTeach ? styles['input-error'] : ''}`}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value)) {
                            handleSubcategorySelect(value, 'teach');
                          }
                          closeSelect('subcategoryToTeach');
                        }}
                        value={subcategoryToTeach || ''}
                        disabled={!categoryToTeach}
                        onFocus={() => openSelect('subcategoryToTeach')}
                        onBlur={() => closeSelect('subcategoryToTeach')}
                      >
                        <option
                          className={styles['placeholder']}
                          value=''
                          disabled
                        >
                          Выберите подкатегорию навыка
                        </option>
                        {subcategoryOptions.map((option) => (
                          <option
                            className={styles['option']}
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Icon
                        name='chevron-down'
                        size='24'
                        className={`${styles['select-arrow']} ${openSelects['subcategoryToTeach'] ? styles['arrow-rotated'] : ''}`}
                      />
                    </div>
                    {errors.subcategoryToTeach && (
                      <span
                        id='subcategory-to-teach-error'
                        className={styles['field-error']}
                        role='alert'
                      >
                        {errors.subcategoryToTeach.message}
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
                      value={watch('skillDescription')}
                      onChange={(e) => {
                        setValue('skillDescription', e.target.value);
                      }}
                      onBlur={() => {
                        trigger('skillDescription');
                      }}
                      placeholder='Коротко опишите, чему можете научить'
                      className={`${styles['textarea']} ${errors.skillDescription ? styles['input-error'] : ''}`}
                      rows={4}
                      error={errors.skillDescription?.message}
                    />
                    {errors.skillDescription && (
                      <span className={styles['textarea-error']}>
                        {errors.skillDescription.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['field']}>
                    <label className={styles['label']}>Фотографии навыка</label>
                    <ImageUploadField
                      onFilesChange={handlePhotoUpload}
                      uploadedFiles={uploadedPhotos}
                      label='Перетащите или выберите изображение навыка'
                      singleSelection={false}
                      maxFiles={5}
                      acceptedFormats={[
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                      ]}
                    />
                    {errors.photos && (
                      <span className={styles['drop-error']}>
                        {errors.photos.message}
                      </span>
                    )}
                  </div>

                  <div className={styles['actions']}>
                    <Button
                      className={styles['actions-button']}
                      type='button'
                      variant='secondary'
                      onClick={handleBack}
                      children='Назад'
                    />
                    <Button
                      className={styles['actions-button']}
                      type='submit'
                      variant='primary'
                      disabled={isLoading || Object.keys(errors).length > 0}
                      children={isLoading ? 'Загрузка...' : 'Продолжить'}
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
        {isConfirmationModalOpen && (
          <ModalUI
            onClose={() => setIsConfirmationModalOpen(false)}
            title='Ваше предложение'
            subtitle='Пожалуйста, проверьте и подтвердите правильность данных'
          >
            <div className={styles['skill-data-container']}>
              <div className={styles['confirmation-content']}>
                <h3 className={styles['skill-title']}>
                  {collectedData.skillName}
                </h3>
                <p className={styles['skill-category']}>
                  {categoryOptions.find(
                    (c) => c.value === collectedData.categoryToTeach,
                  )?.label || 'Не указана'}{' '}
                  /{' '}
                  {subcategoryOptions.find(
                    (s) => s.value === collectedData.subcategoryToTeach,
                  )?.label || 'Не указана'}
                </p>
                <p className={styles['skill-description']}>
                  {collectedData.skillDescription}
                </p>

                <div className={styles['confirmation-actions']}>
                  <Button
                    className={`${styles['actions-button']} ${styles['actions-button-modal']}`}
                    type='button'
                    variant='secondary'
                    onClick={handleEdit}
                    children={
                      <>
                        Редактировать
                        <Icon name='edit' size={24} />
                      </>
                    }
                  />

                  <Button
                    className={`${styles['actions-button']} ${styles['actions-button-modal']}`}
                    type='button'
                    variant='primary'
                    onClick={handleConfirm}
                    children='Готово'
                  />
                </div>
              </div>
              <div className={styles['gallery-container']}>
                <ImageView
                  imagesSkill={uploadedPhotoUrls}
                  className={styles['image-view']}
                />
              </div>
            </div>
          </ModalUI>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
