import type { LegalDocument } from './privacy';

export const termsOfService: Record<'ko' | 'en', LegalDocument> = {
  ko: {
    title: '애플리케이션 서비스 약관',
    lastUpdated: '최종 업데이트: 2026년 7월 1일',
    sections: [
      {
        heading: '1. 목적',
        paragraphs: [
          '본 약관은 RunningCrew(이하 "서비스")의 이용 조건, 이용자와 운영자 간 권리·의무를 규정합니다.',
          '서비스를 이용하면 본 약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.',
        ],
      },
      {
        heading: '2. 서비스 내용',
        paragraphs: [
          'RunningCrew는 GPS 기반 러닝 기록, 웹 대시보드 분석, AI 코칭(Gemini) 등을 제공하는 러닝 분석 서비스입니다.',
          '운영자는 서비스의 전부 또는 일부를 사전 공지 후 변경·중단할 수 있습니다.',
        ],
      },
      {
        heading: '3. 회원가입 및 계정',
        paragraphs: [
          'Google 계정을 통해 가입하며, 제공된 정보의 정확성에 대한 책임은 이용자에게 있습니다.',
          '계정 공유, 타인 명의 사용, 부정한 방법으로의 접근은 금지됩니다.',
          '신규 이용자에게는 5일 체험 기간이 제공될 수 있으며, 이후 일부 기능은 구독 또는 관리자 승인이 필요할 수 있습니다.',
        ],
      },
      {
        heading: '4. 이용자의 의무',
        paragraphs: [
          '관련 법령, 본 약관, 서비스 안내를 준수해야 합니다.',
          '서비스의 정상 운영을 방해하거나, 무단으로 API·데이터에 접근하는 행위를 해서는 안 됩니다.',
          '러닝 중 안전에 유의하고, 교통·보행 규칙을 준수할 책임은 이용자에게 있습니다.',
        ],
      },
      {
        heading: '5. 건강·운동 관련 고지',
        paragraphs: [
          '서비스에서 제공하는 분석, AI 코칭, 메트릭은 참고용이며 의학적 진단·치료를 대체하지 않습니다.',
          '건강상 우려가 있는 경우 전문의와 상담 후 이용하시기 바랍니다.',
        ],
      },
      {
        heading: '6. 지적재산권',
        paragraphs: [
          '서비스 UI, 소프트웨어, 로고 등에 대한 권리는 운영자 또는 정당한 권리자에게 귀속됩니다.',
          '이용자가 업로드한 러닝 데이터에 대한 권리는 이용자에게 있으나, 서비스 제공·분석 목적의 이용·처리에 필요한 범위 내에서 운영자가 사용할 수 있습니다.',
        ],
      },
      {
        heading: '7. 책임의 제한',
        paragraphs: [
          '운영자는 천재지변, 시스템 장애, 제3자 서비스(Google, 호스팅 등) 오류로 인한 손해에 대해 법령이 허용하는 범위 내에서 책임을 제한합니다.',
          '무료로 제공되는 기능에 대해서는 관련 법령이 허용하는 한도 내에서 손해배상 책임이 제한될 수 있습니다.',
        ],
      },
      {
        heading: '8. 이용 제한 및 해지',
        paragraphs: [
          '약관 위반, 부정 이용, 법령 위반 등의 사유가 있는 경우 서비스 이용을 제한하거나 계정을 해지할 수 있습니다.',
          '이용자는 언제든지 서비스 이용을 중단하고 계정 삭제를 요청할 수 있습니다.',
        ],
      },
      {
        heading: '9. 약관 변경',
        paragraphs: [
          '운영자는 필요한 경우 약관을 변경할 수 있으며, 변경 내용은 서비스 내 공지 또는 본 페이지에 게시합니다.',
          '변경 약관 공지 후에도 서비스를 계속 이용하면 변경에 동의한 것으로 볼 수 있습니다.',
        ],
      },
      {
        heading: '10. 문의',
        paragraphs: [
          '본 약관과 서비스 이용에 관한 문의는 하단 연락처로 연락해 주세요.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: July 1, 2026',
    sections: [
      {
        heading: '1. Purpose',
        paragraphs: [
          'These Terms govern your use of RunningCrew ("Service") and define the rights and obligations between users and the operator.',
          'By using the Service, you agree to these Terms and our Privacy Policy.',
        ],
      },
      {
        heading: '2. Service',
        paragraphs: [
          'RunningCrew provides GPS-based run tracking, web analytics, and AI coaching (Gemini).',
          'The operator may modify or discontinue all or part of the Service with prior notice where reasonable.',
        ],
      },
      {
        heading: '3. Accounts',
        paragraphs: [
          'You sign up with a Google account and are responsible for the accuracy of information you provide.',
          'Sharing accounts, impersonation, and unauthorized access are prohibited.',
          'New users may receive a 5-day trial; some features may require subscription or admin approval afterward.',
        ],
      },
      {
        heading: '4. User obligations',
        paragraphs: [
          'You must comply with applicable laws, these Terms, and service guidelines.',
          'You must not disrupt the Service or access APIs or data without authorization.',
          'You are responsible for your safety while running and for following traffic and pedestrian rules.',
        ],
      },
      {
        heading: '5. Health disclaimer',
        paragraphs: [
          'Analytics, AI coaching, and metrics are for reference only and do not replace medical diagnosis or treatment.',
          'Consult a healthcare professional if you have health concerns before exercising.',
        ],
      },
      {
        heading: '6. Intellectual property',
        paragraphs: [
          'Rights to the Service UI, software, and branding belong to the operator or legitimate rights holders.',
          'You retain rights to your running data, but grant the operator a license to use it as needed to provide and analyze the Service.',
        ],
      },
      {
        heading: '7. Limitation of liability',
        paragraphs: [
          'The operator limits liability for damages caused by force majeure, system failures, or third-party services (Google, hosting, etc.) to the extent permitted by law.',
          'Liability for free features may be further limited as allowed by applicable law.',
        ],
      },
      {
        heading: '8. Suspension and termination',
        paragraphs: [
          'We may restrict or terminate access for violations of these Terms, abuse, or unlawful conduct.',
          'You may stop using the Service and request account deletion at any time.',
        ],
      },
      {
        heading: '9. Changes',
        paragraphs: [
          'We may update these Terms and will post changes on the Service or this page.',
          'Continued use after changes may constitute acceptance.',
        ],
      },
      {
        heading: '10. Contact',
        paragraphs: [
          'For questions about these Terms, contact us at the email below.',
        ],
      },
    ],
  },
};
