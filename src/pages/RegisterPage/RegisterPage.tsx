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
import { registerUser } from '../../api/skills.api';
import { getMockDbState } from '@/api/mock-db-store';

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

const filterSubcategoriesByCategory = (categoryId: number) =>
  cachedSubcategories
    .filter((sub) => sub.categoryId === categoryId)
    .map((sub) => ({ value: sub.value, label: sub.label }));

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
    .mixed<File>()
    .nullable() // разрешает null
    .defined()
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
      'Подкатегория не найдена',
      (value, { parent }) => {
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

  const [birthDate, setBirthDate] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [categoryToLearn, setCategoryToLearn] = useState<number | null>(null);
  const [subcategoryToLearn, setSubcategoryToLearn] = useState<number | null>(
    null,
  );
  const [categoryToTeach, setCategoryToTeach] = useState<number | null>(null);
  const [subcategoryToTeach, setSubcategoryToTeach] = useState<number | null>(
    null,
  );
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
      if (cityOptions.length > 0) return; // уже загружены

      try {
        const { cities, categories, subcategories } = await loadInitialData();
        setCityOptions(cities);
        setCategoryOptions(categories);
        cachedSubcategories = subcategories;
        setSubcategoryOptions([]);
      } catch (error) {
        console.error('Ошибка загрузки начальных данных:', error);
        setAuthError('Не удалось загрузить данные. Попробуйте позже.');
      }
    };
    loadData();
  }, [cityOptions.length]);

  const openSelect = (id: string) => {
    setOpenSelects((prev) => ({ ...prev, [id]: true }));
  };

  const closeSelect = (id: string) => {
    setOpenSelects((prev) => ({ ...prev, [id]: false }));
  };

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
      categoryToLearn: 0,
      subcategoryToLearn: 0,
      categoryToTeach: 0,
      subcategoryToTeach: 0,
      skillName: '',
      skillDescription: '',
      photos: [],
    },
  });

  const filteredSubcategories = useMemo(() => {
    if (categoryToLearn === null) {
      return [];
    }

    return filterSubcategoriesByCategory(categoryToLearn);
  }, [categoryToLearn]);

  useEffect(() => {
    setSubcategoryOptions(filteredSubcategories);

    // Сбрасываем выбранную подкатегорию, если она не относится к новой категории
    if (
      subcategoryToLearn !== null &&
      !filteredSubcategories.some((sub) => sub.value === subcategoryToLearn)
    ) {
      setSubcategoryToLearn(null);
      setValue('subcategoryToLearn', 0);
    }
  }, [filteredSubcategories, subcategoryToLearn, setValue]);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (currentContainer === 1) {
      const result = await trigger(['email', 'password']);
      console.log('Валидация шага 1:', result, errors);
      return result;
    } else if (currentContainer === 2) {
      const result = await trigger([
        'avatar',
        'name',
        'birthDate',
        'gender',
        'city',
        'categoryToLearn',
        'subcategoryToLearn',
      ]);
      console.log('Валидация шага 2:', result, errors);
      return result;
    } else if (currentContainer === 3) {
      const result = await trigger([
        'categoryToTeach',
        'subcategoryToTeach',
        'skillName',
        'skillDescription',
        'photos',
      ]);
      console.log('Валидация шага 3:', result, errors);
      return result;
    }
    return true;
  }, [currentContainer, trigger, errors]);

  // Единый обработчик выбора города
  const handleCitySelect = async (cityName: string) => {
    setSelectedCity(cityName);
    setValue('city', cityName);
    setCollectedData((prev) => ({ ...prev, city: cityName }));

    await validateCurrentStep();
  };

  const handleCategorySelect = async (
    categoryId: number,
    type: CategoryType,
  ) => {
    const categoryField = getCategoryField(type);
    const setCategory =
      type === 'learn' ? setCategoryToLearn : setCategoryToTeach;

    // Обновляем локальное состояние
    setCategory(categoryId);

    // Устанавливаем значение в форме
    setValue(categoryField, categoryId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Фильтруем подкатегории для выбранной категории
    const filtered = filterSubcategoriesByCategory(categoryId);
    setSubcategoryOptions(filtered);

    // Сброс подкатегории, если она не относится к новой категории
    const currentSubcategory =
      type === 'learn' ? subcategoryToLearn : subcategoryToTeach;
    const setSubcategory =
      type === 'learn' ? setSubcategoryToLearn : setSubcategoryToTeach;
    const subcategoryField = getSubcategoryField(type);

    if (
      currentSubcategory !== null &&
      !filtered.some((sub) => sub.value === currentSubcategory)
    ) {
      setSubcategory(null);
      setValue(subcategoryField, 0, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // Обновляем collectedData
    setCollectedData((prev) => ({
      ...prev,
      [categoryField]: categoryId,
      [subcategoryField]: null, // сбрасываем подкатегорию
    }));

    // Запускаем валидацию
    await validateCurrentStep();
  };

  const handleSubcategorySelect = async (
    subcategoryId: number,
    type: CategoryType,
  ) => {
    const setSubcategory =
      type === 'learn' ? setSubcategoryToLearn : setSubcategoryToTeach;
    const subcategoryField = getSubcategoryField(type);

    // Обновляем локальное состояние
    setSubcategory(subcategoryId);

    // Устанавливаем значение в форме
    setValue(subcategoryField, subcategoryId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Обновляем collectedData
    setCollectedData((prev) => ({
      ...prev,
      [subcategoryField]: subcategoryId,
    }));

    // Запускаем валидацию
    await validateCurrentStep();
  };

  // Обработчик загрузки аватара
  const handleAvatarUpload = async (file: File) => {
    setAvatar(file);
    setValue('avatar', file);

    setCollectedData((prev) => ({ ...prev, avatar: file }));
    await validateCurrentStep();
  };

  // Обработчик загрузки фото навыков
  const handlePhotoUpload = async (files: File[]) => {
    setUploadedPhotos(files);
    setValue('photos', files);
    if (currentContainer === 3) {
      setCollectedData((prev) => ({ ...prev, photos: files }));
    }
    await validateCurrentStep();
  };

  const collectCurrentStepData =
    useCallback((): Partial<RegistrationFormData> => {
      switch (currentContainer) {
        case 1:
          return {
            email: getValues('email'),
            password: getValues('password'),
          };
        case 2:
          return {
            avatar,
            name: getValues('name'),
            birthDate,
            gender: getValues('gender'),
            city: selectedCity,
            categoryToLearn: categoryToLearn ?? undefined,
            subcategoryToLearn: subcategoryToLearn ?? undefined,
          };
        case 3:
          return {
            categoryToTeach: categoryToTeach ?? undefined,
            subcategoryToTeach: subcategoryToTeach ?? undefined,
            skillName: getValues('skillName'),
            skillDescription: getValues('skillDescription'),
            photos: uploadedPhotos,
          };
        default:
          return {};
      }
    }, [
      currentContainer,
      getValues,
      avatar,
      birthDate,
      selectedCity,
      categoryToLearn,
      subcategoryToLearn,
      categoryToTeach,
      subcategoryToTeach,
      uploadedPhotos,
    ]);

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
            setBirthDate(data.birthDate);
            setValue('birthDate', data.birthDate);
          }
          if (data.gender) setValue('gender', data.gender);
          if (data.city) {
            setSelectedCity(data.city);
            setValue('city', data.city);
          }
          if (data.avatar) {
            setAvatar(data.avatar);
            setValue('avatar', data.avatar);
          }
          if (data.categoryToLearn !== undefined) {
            setCategoryToLearn(data.categoryToLearn);
            setValue('categoryToLearn', data.categoryToLearn);
          }
          if (data.subcategoryToLearn !== undefined) {
            setSubcategoryToLearn(data.subcategoryToLearn);
            setValue('subcategoryToLearn', data.subcategoryToLearn);
          }
          break;
        case 3:
          if (data.categoryToTeach !== undefined) {
            setCategoryToTeach(data.categoryToTeach);
            setValue('categoryToTeach', data.categoryToTeach);
          }
          if (data.subcategoryToTeach !== undefined) {
            setSubcategoryToTeach(data.subcategoryToTeach);
            setValue('subcategoryToTeach', data.subcategoryToTeach);
          }
          if (data.skillName) setValue('skillName', data.skillName);
          if (data.skillDescription)
            setValue('skillDescription', data.skillDescription);
          if (data.photos) {
            setUploadedPhotos(data.photos);
            setValue('photos', data.photos);
          }
          break;
      }
    },
    [
      collectedData,
      setValue,
      setBirthDate,
      setSelectedCity,
      setAvatar,
      setCategoryToLearn,
      setSubcategoryToLearn,
      setCategoryToTeach,
      setSubcategoryToTeach,
      setUploadedPhotos,
    ],
  );

  // Обработчик перехода к следующему шагу
  const handleNext = useCallback(
    async (e?: React.MouseEvent | React.FormEvent) => {
      e?.preventDefault();

      const isValid = await validateCurrentStep();

      if (!isValid) {
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        errorElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        return;
      }

      // Собираем данные текущего шага
      const currentStepData = collectCurrentStepData();
      setCollectedData((prev) => ({ ...prev, ...currentStepData }));

      console.log('=== ДАННЫЕ ПОСЛЕ ШАГА', currentContainer, '===');
      console.log('Данные текущего шага:', currentStepData);
      console.log('Все собранные данные:', {
        ...collectedData,
        ...currentStepData,
      });
      console.log('=====================================');

      // Дополнительная проверка полноты данных
      if (currentContainer === 2) {
        const requiredFields = ['name', 'birthDate', 'gender', 'city'];
        const missingFields = requiredFields.filter(
          (field) => !currentStepData[field as keyof typeof currentStepData],
        );
        if (missingFields.length > 0) {
          console.error('Не заполнены обязательные поля:', missingFields);
          return;
        }
      }

      if (currentContainer < 3) {
        setCurrentContainer((prev) => (prev + 1) as 1 | 2 | 3);
      }
    },
    [
      currentContainer,
      errors,
      validateCurrentStep,
      collectCurrentStepData,
      collectedData,
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

  const onSubmit = async (data: RegistrationFormData) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      // Собираем все данные из формы и локальных состояний
      const fullData: RegistrationFormData = {
        ...collectedData,
        email: getValues('email'),
        password: getValues('password'),
        name: getValues('name'),
        birthDate: getValues('birthDate'),
        gender: getValues('gender'),
        city: getValues('city'),
        categoryToLearn: getValues('categoryToLearn'),
        subcategoryToLearn: getValues('subcategoryToLearn'),
        categoryToTeach: getValues('categoryToTeach'),
        subcategoryToTeach: getValues('subcategoryToTeach'),
        skillName: getValues('skillName'),
        skillDescription: getValues('skillDescription'),
        avatar: avatar || null,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : data.photos || [],
      };

      console.log('Отправка данных:', fullData);

      const { userId, skillId } = await registerUser(fullData);
      navigate(`/skill/${skillId}`);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', userId.toString());
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
  const handleDateSelect = async (dateString: string) => {
    setBirthDate(dateString);
    setValue('birthDate', dateString, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setCollectedData((prev) => ({ ...prev, birthDate: dateString }));
    await validateCurrentStep();
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setValue('avatar', null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (currentContainer === 2) {
      setCollectedData((prev) => ({ ...prev, avatar: null }));
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
                          className={`${styles['input']} ${styles['select']} ${
                            getValues('gender')
                              ? styles['select-with-selection']
                              : ''
                          } ${errors.gender ? styles['input-error'] : ''}`}
                          onChange={(e) => {
                            setValue('gender', e.target.value);
                            closeSelect('gender'); // сброс состояния после выбора
                          }}
                          value={getValues('gender') || ''}
                          onFocus={() => openSelect('gender')}
                          onBlur={() => closeSelect('gender')}
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
                        <span className={styles['field-error']}>
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
                        className={`${styles['input']} ${styles['select']} ${
                          selectedCity ? styles['select-with-selection'] : ''
                        } ${errors.city ? styles['input-error'] : ''}`}
                        onChange={(e) => {
                          handleCitySelect(e.target.value);
                          closeSelect('city');
                        }}
                        value={selectedCity}
                        autoComplete='address-level2'
                        onFocus={() => openSelect('city')}
                        onBlur={() => closeSelect('city')}
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
                      <span className={styles['field-error']}>
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
                      <span className={styles['field-error']}>
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
                        value={subcategoryToLearn ?? ''}
                        onFocus={() => openSelect('subcategoryToLearn')}
                        onBlur={() => closeSelect('subcategoryToLearn')}
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
                      <span className={styles['field-error']}>
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
                      type='button'
                      variant='primary'
                      onClick={() => handleNext()}
                      disabled={isLoading}
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
                  onSubmit={handleSubmit(onSubmit)}
                  className={styles['form']}
                >
                  {/* Название навыка */}
                  <div className={styles['field']}>
                    <label htmlFor='skill-name' className={styles['label']}>
                      Название навыка
                    </label>
                    <input
                      id='skill-name'
                      type='text'
                      placeholder='Введите название вашего навыка'
                      className={`${styles['input']} ${errors.skillName ? styles['input-error'] : ''}`}
                      {...register('skillName')}
                    />
                    {errors.skillName && (
                      <span className={styles['field-error']}>
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
                        value={categoryToTeach ?? ''}
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
                      <span className={styles['field-error']}>
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
                        value={subcategoryToTeach ?? ''}
                        onFocus={() => openSelect('subcategoryToTeach')}
                        onBlur={() => closeSelect('subcategoryToTeach')}
                        disabled={!categoryToTeach} // блокируем, если категория не выбрана
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
                      <span className={styles['field-error']}>
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
                      disabled={isLoading}
                      children={isLoading ? 'Регистрация...' : 'Продолжить'}
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
