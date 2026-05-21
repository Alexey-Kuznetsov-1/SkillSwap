// src/pages/LoginPage/LoginPage.tsx
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { LoginHeader } from '@/widgets/LoginHeader/LoginHeader';
import { Icon } from '@/shared/ui/Icon/Icon';
import { FormField } from '@/shared/ui/FormField/FormField';
import { Input } from '@/shared/ui/Input/Input';
import styles from './LoginPage.module.css';

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email обязателен')
    .email('Введите корректный email'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен быть не менее 8 символов'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Логирование ввода в поля

  useEffect(() => {
    console.log('=== LoginPage загружена ===');
  }, []);

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development' && emailValue) {
  //     console.log('Поле Email обновлено:', emailValue);
  //   }
  // }, [emailValue]);

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development' && passwordValue) {
  //     console.log('Поле Пароль обновлено:', passwordValue);
  //   }
  // }, [passwordValue]);

  const onSubmit = async (data: LoginFormValues) => {
    console.log('=== Попытка авторизации ===');
    console.log('Введённые данные:', data);

    setAuthError(null);
    setIsLoading(true);

    try {
      const savedUserData = localStorage.getItem('userData');

      if (!savedUserData) {
        console.log(
          '❌ Авторизация не удалась: пользователь не найден в localStorage',
        );
        setAuthError('Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
        return;
      }

      const userData = JSON.parse(savedUserData);
      console.log('Найден пользователь в localStorage:', {
        email: userData.email,
        password: '***скрыт***',
      });

      if (
        userData.email === data.email &&
        userData.password === data.password
      ) {
        console.log('✅ Авторизация успешна! Перенаправление на /profile');
        // Успешная авторизация
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        reset();
        navigate('/profile');
        return;
      } else {
        console.log('❌ Неверный email или пароль');
        setAuthError(
          'Email или пароль введён неверно. Пожалуйста, проверьте правильность введённых данных',
        );
      }
    } catch (error) {
      setAuthError('Произошла ошибка. Попробуйте позже.');
      console.error('❌ Ошибка авторизации:', error);
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

  return (
    <div className={styles.page}>
      <LoginHeader onClose={handleClose} />

      <div className={styles.pageTitle}>
        <h1>Вход</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.whiteCard}>
          {/* Левый блок — форма */}
          <div className={styles.leftBlock}>
            <div className={styles.socialButtons}>
              <button
                type='button'
                className={styles.socialButton}
                onClick={() => handleSocialLogin('google')}
              >
                <span className={styles.socialIcon}>
                  <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
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
                className={styles.socialButton}
                onClick={() => handleSocialLogin('apple')}
              >
                <span className={styles.socialIcon}></span>
                Продолжить с Apple
              </button>
            </div>

            <div className={styles.divider}>
              <span className={styles.dividerLine}></span>
              <span className={styles.dividerText}>или</span>
              <span className={styles.dividerLine}></span>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.form}
            >
              {/* Поле Email */}
              <FormField
                label='Email'
                error={errors.email?.message}
                required
                htmlFor='email'
              >
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      placeholder='Введите email'
                      error={!!errors.email}
                      size='md'
                      autoComplete='email'
                    />
                  )}
                />
                {errors.email && (
                  <span className={styles['field-error']}>
                    {errors.email.message}
                  </span>
                )}
              </FormField>

              {/* Поле Пароль */}
              <FormField
                label='Пароль'
                error={errors.password?.message}
                required
                htmlFor='password'
              >
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <div className={styles.passwordWrapper}>
                      <div className={styles.passwordWrapper}>
                        <Input
                          {...field}
                          id='password'
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Введите ваш пароль'
                          error={!!errors.password}
                          autoComplete='current-password'
                          size='md'
                          rightIcon={
                            <button
                              type='button'
                              className={styles.eyeButton}
                              onClick={togglePasswordVisibility}
                              tabIndex={-1}
                            >
                              <Icon
                                name={showPassword ? 'eye' : 'eye-slash'}
                                size={20}
                              />
                            </button>
                          }
                        />
                        {errors.password && (
                          <span className={styles['field-error']}>
                            {errors.password.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                />
              </FormField>

              {authError && (
                <div className={styles.authError}>
                  <p className={styles.authErrorText}>{authError}</p>
                </div>
              )}

              <button
                type='submit'
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>

            <div className={styles.registerLink}>
              <Link to='/register' className={styles.link}>
                Зарегистрироваться
              </Link>
            </div>
          </div>

          {/* Правый блок — приветствие */}
          <div className={styles.rightBlock}>
            <div className={styles.heroIcon}>
              <Icon name='light-bulb' size={120} />
            </div>
            <h1 className={styles.heroTitle}>С возвращением в SkillSwap!</h1>
            <p className={styles.heroSubtitle}>
              Обменивайтесь знаниями и навыками с другими людьми
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
