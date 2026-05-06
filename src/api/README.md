# API Layer (`src/api`)

Локальный API-слой для учебного проекта без backend.
Данные читаются из `db/*.json`, загружаются в in-memory store и используются методами из `skills.api.ts`.

## Что здесь находится

- `types.ts` — контракты данных (доменные типы и DTO для UI).
- `client.ts` — базовый `fetchJson` для чтения mock JSON.
- `mock-db-store.ts` — глобальное хранилище в памяти и инициализация данных.
- `skills.api.ts` — публичные методы для каталога и страницы навыка.
- `index.ts` — точка реэкспорта (`@/api`).

## Быстрый старт

Инициализация уже подключена в `src/index.tsx`, но при необходимости можно вызвать вручную:

```ts
import { initMockDbStore } from '@/api';

await initMockDbStore();
```

После инициализации используйте методы:

```ts
import { getSkillsCatalog, getSkillById, getRelatedSkills } from '@/api';
```

## Основные методы

### `getSkillsCatalog(params?)`

Возвращает список карточек навыков с пагинацией.

Параметры (`SkillsCatalogParams`):

- `query?: string` — поиск по `name` и `description`
- `categoryId?: number` — фильтр по категории
- `subcategoryId?: number` — фильтр по подкатегории
- `direction?: 'teach' | 'learn' | 'all'` — фильтр по направлению
- `page?: number` — номер страницы (по умолчанию `1`)
- `limit?: number` — размер страницы (по умолчанию `20`)

Фильтры комбинируются по логике `AND`.

### `getSkillById(skillId)`

Возвращает `SkillDetails | null`:

- карточка навыка + `images`
- данные автора для детали: `about`, `age`, `city`

Если `skillId` не найден — возвращает `null`.

### `getRelatedSkills(skillId, limit = 4)`

Возвращает массив похожих карточек (`SkillCard[]`), сортировка по приоритетам:

1. та же подкатегория
2. та же категория
3. затем по `id`

## Пример использования в React

```ts
import { useEffect, useState } from 'react';
import { getSkillById } from '@/api';
import type { SkillDetails } from '@/api';

export function SkillPage({ skillId }: { skillId: number }) {
  const [skill, setSkill] = useState<SkillDetails | null>(null);

  useEffect(() => {
    let mounted = true;

    void getSkillById(skillId).then((data) => {
      if (mounted) setSkill(data);
    });

    return () => {
      mounted = false;
    };
  }, [skillId]);

  if (!skill) return <div>Навык не найден</div>;

  return (
    <article>
      <h1>{skill.name}</h1>
      <p>{skill.description}</p>

      <p>
        Направление: <b>{skill.direction}</b>
      </p>
      <p>
        Категория: {skill.category.name} ({skill.category.color})
      </p>
      <p>Подкатегория: {skill.subcategory.name}</p>
      <p>Лайки: {skill.likesCount}</p>

      <section>
        <h2>Автор</h2>
        <p>ID: {skill.author.id}</p>
        <p>Имя: {skill.author.name}</p>
        <img src={skill.author.avatarUrl} alt={skill.author.name} width={64} height={64} />
        <p>О себе: {skill.about}</p>
        <p>
          Город: {skill.city.name} (id: {skill.city.id})
        </p>
        <p>Возраст: {skill.age}</p>
      </section>

      <section>
        <h2>Изображения навыка</h2>
        {skill.images.map((imageUrl) => (
          <img key={imageUrl} src={imageUrl} alt={skill.name} width={160} />
        ))}
      </section>

      <small>ID навыка: {skill.id}</small>
    </article>
  );
}
```

## Важно

- Store живет только в памяти текущей сессии браузера.
- После перезагрузки страницы данные читаются заново из `db/*.json`.
- Для постоянных пользовательских изменений используйте `localStorage` (или backend в будущем).
