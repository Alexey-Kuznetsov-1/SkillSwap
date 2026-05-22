// src/pages/PrivacyPage/PrivacyPage.tsx
import React from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import styles from './PrivacyPage.module.css';

const PrivacyPage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Политика конфиденциальности</h1>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Общие положения</h2>
              <p className={styles.text}>
                Настоящая политика обработки персональных данных составлена в соответствии с требованиями 
                законодательства и определяет порядок обработки персональных данных и меры по обеспечению 
                безопасности персональных данных, предпринимаемые SkillSwap (далее — Оператор).
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Какие данные мы собираем</h2>
              <p className={styles.text}>
                При регистрации на сайте вы указываете имя, адрес электронной почты, город проживания, 
                пол и дату рождения. Также вы можете добавить информацию о себе в профиль. 
                Мы не собираем и не храним данные банковских карт или другие платежные данные.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Как мы используем ваши данные</h2>
              <p className={styles.text}>
                Ваши данные используются для:
              </p>
              <ul className={styles.list}>
                <li>Обеспечения работы платформы (создание профиля, отображение навыков)</li>
                <li>Связи с вами по вопросам обмена навыками</li>
                <li>Улучшения работы сервиса и персонализации контента</li>
                <li>Информирования о новых функциях и возможностях</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Хранение и защита данных</h2>
              <p className={styles.text}>
                Мы храним ваши данные на защищенных серверах и принимаем разумные меры для защиты 
                от несанкционированного доступа, изменения, раскрытия или уничтожения. 
                Доступ к персональным данным имеют только сотрудники, непосредственно связанные с 
                выполнением работ по обслуживанию платформы.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Передача данных третьим лицам</h2>
              <p className={styles.text}>
                Мы не передаем ваши персональные данные третьим лицам, за исключением случаев, 
                предусмотренных законодательством. Все данные используются исключительно для 
                функционирования платформы SkillSwap.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Ваши права</h2>
              <p className={styles.text}>
                Вы имеете право:
              </p>
              <ul className={styles.list}>
                <li>Получить информацию о том, какие данные о вас хранятся</li>
                <li>Изменить или удалить свои данные в любое время</li>
                <li>Отозвать согласие на обработку персональных данных</li>
                <li>Запросить удаление своего аккаунта</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Контактная информация</h2>
              <p className={styles.text}>
                По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться 
                по адресу электронной почты: privacy@skillswap.com
              </p>
            </section>

            <div className={styles.updateDate}>
              Дата последнего обновления: 21 мая 2026 года
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPage;