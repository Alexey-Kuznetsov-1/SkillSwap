import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from '@/app/App';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { initMockDbStore } from '@/api';

async function bootstrap() {
  // Загружаем mock JSON-данные один раз при старте приложения.
  await initMockDbStore();

  // Рендерим приложение только после подготовки in-memory хранилища.
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  );
}

// Явно игнорируем возвращаемый промис bootstrap.
void bootstrap();
