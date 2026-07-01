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
2. **Root Directory**: `web` (필수 — 루트에서 빌드하면 Next.js 미감지 오류 발생)
3. **Install Command**: `npm ci --no-workspaces` (`web/vercel.json`에 설정됨 — monorepo workspace 설치 방지)
4. Environment Variables:

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

## 3. Google OAuth 설정 (`invalid_client` 해결)

`401 invalid_client` / **OAuth client was not found** → Vercel의 `GOOGLE_CLIENT_ID`가 비어 있거나 `placeholder` 등 잘못된 값입니다.

### 3-1. Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → 프로젝트 선택(또는 새로 생성)
2. **APIs & Services** → **OAuth consent screen**
   - User Type: **External** (테스트 중이면 Test users에 본인 Gmail 추가)
   - 앱 이름·이메일 입력 후 저장
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - **Authorized JavaScript origins** (둘 다 추가 권장):
     - `https://running-crew-three.vercel.app`
     - `https://running-crew-minyabee70-2026s-projects.vercel.app`
   - **Authorized redirect URIs** (둘 다 추가 권장):
     - `https://running-crew-three.vercel.app/api/auth/callback/google`
     - `https://running-crew-minyabee70-2026s-projects.vercel.app/api/auth/callback/google`
4. 생성 후 **Client ID** (`….apps.googleusercontent.com`)와 **Client secret** 복사

### 3-2. Vercel 환경 변수 업데이트

[Vercel → running-crew → Settings → Environment Variables](https://vercel.com)

| 변수 | 값 |
|------|-----|
| `GOOGLE_CLIENT_ID` | `123456789-xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-…` |
| `NEXTAUTH_URL` | `https://running-crew-three.vercel.app` |
| `NEXTAUTH_SECRET` | 32자 이상 랜덤 문자열 |

CLI 예시:

```bash
cd web
npx vercel env rm GOOGLE_CLIENT_ID production -y
npx vercel env rm GOOGLE_CLIENT_SECRET production -y
echo "YOUR_CLIENT_ID" | npx vercel env add GOOGLE_CLIENT_ID production
echo "YOUR_CLIENT_SECRET" | npx vercel env add GOOGLE_CLIENT_SECRET production
npx vercel --prod
```

변수 수정 후 **Deployments → Redeploy** 필수.

---

## 4. 배포 후 검증

- [ ] `/health` 및 `/health/db` 200
- [ ] Google 로그인 성공
- [ ] 대시보드 세션 목록 로드
- [ ] Admin (`minyabee70@gmail.com`) → `/admin/users`

---

## 5. CI

GitHub Actions (`.github/workflows/ci.yml`) — `main` push 시 API 빌드·구독 테스트, Web `next build` 실행.
