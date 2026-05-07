import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from '@/app/App';
import { initMockDbStore } from '@/api';

async function bootstrap() {
  // Загружаем mock JSON-данные один раз при старте приложения.
  await initMockDbStore();

  // Рендерим приложение только после подготовки in-memory хранилища.
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Явно игнорируем возвращаемый промис bootstrap.
void bootstrap();
