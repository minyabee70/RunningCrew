# RunningCrew 배포 가이드

## 아키텍처

| 구성요소 | 플랫폼 | URL (예시) |
|----------|--------|------------|
| Web | Vercel | `https://running-crew-three.vercel.app` |
| API | Render (Docker) | `https://runningcrew-api.onrender.com` |
| DB | Render PostgreSQL | 내부 연결 |

---

## 1. Render (API + PostgreSQL)

### Blueprint로 한 번에 배포

1. [Render Blueprints](https://dashboard.render.com/blueprints) → **New Blueprint Instance**
2. GitHub `minyabee70/RunningCrew` 연결
3. `render.yaml` 적용 후 **Apply**
4. 수동 환경 변수 설정:
   - `WEB_URL` → `https://running-crew-three.vercel.app`
   - `GEMINI_API_KEY` → Google AI Studio 키
5. DB 스키마 적용 (Render Shell 또는 로컬):

```bash
# Render 대시보드 → runningcrew-db → Connect → External URL 복사
psql "$DATABASE_URL" -f api/db/schema.sql
```

### API 헬스체크

```bash
curl https://runningcrew-api.onrender.com/health
curl https://runningcrew-api.onrender.com/health/db
```

---

## 2. Vercel (Web)

### GitHub 연동 (권장)

1. [Vercel New Project](https://vercel.com/new) → Import `minyabee70/RunningCrew`
2. **Root Directory**: `web`
3. Environment Variables:

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_API_URL` | `https://runningcrew-api.onrender.com` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Vercel 프로덕션 URL |

4. Google OAuth **승인된 리디렉션 URI**:
   - `https://<your-vercel-domain>/api/auth/callback/google`

### CLI 배포

```bash
cd web
npx vercel --prod
```

---

## 3. Google OAuth 설정

[Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

- 승인된 JavaScript 원본: Vercel URL
- 승인된 리디렉션 URI: `https://<domain>/api/auth/callback/google`

---

## 4. 배포 후 검증

- [ ] `/health` 및 `/health/db` 200
- [ ] Google 로그인 성공
- [ ] 대시보드 세션 목록 로드
- [ ] Admin (`minyabee70@gmail.com`) → `/admin/users`

---

## 5. CI

GitHub Actions (`.github/workflows/ci.yml`) — `main` push 시 API 빌드·구독 테스트, Web `next build` 실행.
