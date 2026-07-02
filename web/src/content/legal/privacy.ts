export type LegalSectionContent = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  sections: LegalSectionContent[];
};

export const privacyPolicy: Record<'ko' | 'en', LegalDocument> = {
  ko: {
    title: '공개 개인정보처리방침',
    lastUpdated: '최종 업데이트: 2026년 7월 1일',
    sections: [
      {
        heading: '1. 개요',
        paragraphs: [
          'RunningCrew(이하 "서비스")는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 방침은 서비스 이용 과정에서 수집·이용·보관·파기되는 개인정보에 대해 설명합니다.',
        ],
      },
      {
        heading: '2. 수집하는 개인정보',
        paragraphs: [
          '필수: Google OAuth를 통해 제공되는 Google 계정 식별자, 이메일 주소, 표시 이름.',
          '서비스 이용 시: 러닝 세션 데이터(GPS 경로 좌표, 거리, 시간, 페이스, 칼로리 등), 기기에서 전송하는 활동 메트릭.',
          '선택: 생체 정보(키, 몸무게), UI 설정(언어, 테마, 글자 크기), 메모 및 분석 요청 내용.',
        ],
      },
      {
        heading: '3. 개인정보의 이용 목적',
        paragraphs: [
          '회원 식별 및 Google 로그인 연동, 러닝 기록 저장·동기화·시각화.',
          '구독·체험 기간 관리 및 서비스 등급 제공.',
          'Google Gemini API를 활용한 AI 러닝 분석(세션 요약·코칭) — 분석 결과는 데이터베이스에 캐시될 수 있습니다.',
          '서비스 개선, 오류 대응, 고객 문의 처리.',
        ],
      },
      {
        heading: '4. 제3자 제공 및 처리 위탁',
        paragraphs: [
          'Google LLC: OAuth 인증(Google 로그인).',
          'Google LLC: AI 분석(Gemini API) — 분석에 필요한 세션·메트릭 데이터가 Google 서버로 전송될 수 있습니다.',
          'Vercel Inc., Render.com 등: 웹·API 호스팅 및 데이터베이스 운영.',
          '법령에 따른 요청이 있는 경우를 제외하고, 이용자의 동의 없이 개인정보를 제3자에게 판매하지 않습니다.',
        ],
      },
      {
        heading: '5. 보관 기간 및 파기',
        paragraphs: [
          '회원 탈퇴 또는 삭제 요청 시, 관련 법령에 따른 보관 의무를 제외하고 지체 없이 파기합니다.',
          '러닝 세션 및 AI 분석 데이터는 서비스 제공 기간 동안 보관되며, 계정 삭제 시 함께 삭제됩니다.',
        ],
      },
      {
        heading: '6. 이용자의 권리',
        paragraphs: [
          '언제든지 개인정보 열람·정정·삭제·처리 정지를 요청할 수 있습니다.',
          '요청은 하단 연락처로 이메일을 보내 주시면 검토 후 처리합니다.',
        ],
      },
      {
        heading: '7. 위치 정보',
        paragraphs: [
          '모바일 앱을 통해 수집되는 GPS·위치 정보는 러닝 경로 기록 목적으로만 사용됩니다.',
          '위치 정보 수집은 앱 실행 및 러닝 추적 시작 시 기기 OS 권한을 통해 이루어집니다.',
        ],
      },
      {
        heading: '8. 방침 변경',
        paragraphs: [
          '본 방침이 변경되는 경우 서비스 내 공지 또는 본 페이지를 통해 안내합니다.',
          '변경 후에도 서비스를 계속 이용하면 변경된 방침에 동의한 것으로 간주될 수 있습니다.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: July 1, 2026',
    sections: [
      {
        heading: '1. Overview',
        paragraphs: [
          'RunningCrew ("Service") respects your privacy and complies with applicable data protection laws. This policy explains how we collect, use, store, and delete personal information when you use the Service.',
        ],
      },
      {
        heading: '2. Information we collect',
        paragraphs: [
          'Required: Google account identifier, email address, and display name via Google OAuth.',
          'During use: running session data (GPS route coordinates, distance, duration, pace, calories, etc.) and activity metrics from your device.',
          'Optional: biometrics (height, weight), UI preferences (language, theme, font size), notes, and analysis requests.',
        ],
      },
      {
        heading: '3. How we use information',
        paragraphs: [
          'User identification, Google sign-in, storing and syncing running records, and visualization.',
          'Managing subscriptions, trials, and feature tiers.',
          'AI running analysis via Google Gemini API — results may be cached in our database.',
          'Service improvement, error handling, and support.',
        ],
      },
      {
        heading: '4. Third parties and processors',
        paragraphs: [
          'Google LLC: OAuth (Google Sign-In).',
          'Google LLC: AI analysis (Gemini API) — session and metric data may be sent to Google servers.',
          'Vercel Inc., Render.com, etc.: hosting and database operations.',
          'We do not sell personal information to third parties except as required by law or with your consent.',
        ],
      },
      {
        heading: '5. Retention and deletion',
        paragraphs: [
          'Upon account deletion or request, we delete data unless retention is required by law.',
          'Running sessions and AI analysis data are kept while your account is active and deleted with the account.',
        ],
      },
      {
        heading: '6. Your rights',
        paragraphs: [
          'You may request access, correction, deletion, or restriction of processing of your personal data.',
          'Contact us at the email below to submit a request.',
        ],
      },
      {
        heading: '7. Location data',
        paragraphs: [
          'GPS and location data collected via the mobile app are used only to record running routes.',
          'Collection occurs through device OS permissions when you start tracking in the app.',
        ],
      },
      {
        heading: '8. Changes',
        paragraphs: [
          'We may update this policy and will notify users via the Service or this page.',
          'Continued use after changes may constitute acceptance of the updated policy.',
        ],
      },
    ],
  },
};
