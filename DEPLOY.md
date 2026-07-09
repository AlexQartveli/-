# Деплой Kinetix

## Адреса

| Сайт | URL | Репозиторий |
|------|-----|-------------|
| **kinetiks.online → CRM** | https://alexqartveli.github.io/crm/#/ | `AlexQartveli/crm` |
| **Прямой доступ** | https://alexqartveli.github.io/-/#/ | `AlexQartveli/-` |
| **Лендинг** | https://kinetiks.online/ | отдельный хостинг (nginx) |

Кнопка «Попробовать CRM» на kinetiks.online ведёт на `/crm/`.

---

## Автодеплой

При пуше в `main` репозитория `AlexQartveli/-`:

1. **deploy.yml** — сборка с `VITE_BASE=/-/` → ветка `gh-pages` этого репо
2. **deploy-crm.yml** — сборка с `VITE_BASE=/crm/` → ветка `gh-pages` репо `AlexQartveli/crm`

Если workflow `Deploy CRM to kinetiks.online` падает с 403 — боту нужен доступ к репо `crm` (см. ниже).

---

## Если CRM на kinetiks.online не обновляется

### Вариант 1: Дать доступ боту к репо `crm`

1. https://github.com/AlexQartveli/crm/settings/access
2. **Add people** → `cursor[bot]` → роль **Write**
3. Перезапустите workflow: **Actions → Deploy CRM to kinetiks.online → Run workflow**

### Вариант 2: Ручной деплой в `crm`

```bash
git clone https://github.com/AlexQartveli/-.git
cd -/frontend
npm ci
VITE_BASE=/crm/ VITE_USE_LOCAL_API=true npm run build
cp dist/index.html dist/404.html

git clone --branch gh-pages https://github.com/AlexQartveli/crm.git crm-pages
rm -rf crm-pages/*
cp -r dist/* crm-pages/
cd crm-pages
git add -A
git commit -m "Deploy CRM"
git push origin gh-pages
```

### Вариант 3: Сменить ссылку на лендинге

На kinetiks.online замените ссылку CRM на:

**https://alexqartveli.github.io/-/#/**

---

## GitHub Pages (репо `-`)

1. https://github.com/AlexQartveli/-/settings/pages
2. **Source:** branch `gh-pages`, folder `/ (root)`

---

## Backend на Render

1. https://render.com → **New → Blueprint** → репозиторий `AlexQartveli/-`
2. API: https://kinetix-api.onrender.com

> Пока API недоступен, CRM работает в офлайн-режиме (`localStorage`).
