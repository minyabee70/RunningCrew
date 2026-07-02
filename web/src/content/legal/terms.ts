import type { LegalDocument } from './privacy';

export const termsOfService: Record<'ko' | 'en', LegalDocument> = {
  ko: {
    title: '애플리케이션 서비스 약관',
    lastUpdated: '최종 업데이트: 2026년 7월 3일',
    sections: [
      {
        heading: '1. 목적',
        paragraphs: [
          '본 약관은 RunningCrew(이하 "서비스")의 이용 조건, 이용자와 회사 간 권리·의무를 규정합니다.',
          '본 약관에서 "회사"는 RunningCrew 서비스를 운영하는 주체를, "이용자"는 Google 계정으로 가입하여 서비스를 이용하는 회원을 말합니다.',
          '서비스를 이용하면 본 약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.',
        ],
      },
      {
        heading: '2. 서비스 내용',
        paragraphs: [
          'RunningCrew는 GPS 기반 러닝 기록, 웹 대시보드 분석, AI 코칭(Gemini) 등을 제공하는 러닝 분석 서비스입니다.',
          '회사는 서비스의 전부 또는 일부를 사전 공지 후 변경·중단할 수 있습니다. 유료 기능·요금·체험 정책이 변경되는 경우 본 약관 또는 서비스 내 공지를 통해 안내합니다.',
        ],
      },
      {
        heading: '3. 회원가입 및 계정',
        paragraphs: [
          'Google 계정을 통해 가입하며, 제공된 정보의 정확성에 대한 책임은 이용자에게 있습니다.',
          '계정 공유, 타인 명의 사용, 부정한 방법으로의 접근은 금지됩니다.',
          '미성년자는 법정대리인의 동의를 받은 후 서비스를 이용해야 합니다.',
        ],
      },
      {
        heading: '4. 서비스의 이용 및 유료 전환',
        paragraphs: [
          '회사는 이용자에게 가입일로부터 5일간의 무료 체험 기간을 제공합니다. 체험 기간 동안 이용자는 유료 구독자와 동일한 프리미엄 기능(정밀·심층 분석 등)을 이용할 수 있습니다.',
          '무료 체험 기간이 종료된 후 서비스의 프리미엄 기능을 계속 이용하기 위해서는 유료 구독 결제를 완료해야 합니다. 결제가 완료되지 않은 경우 회사는 「11. 서비스 이용 제한」에 따라 이용을 제한할 수 있습니다.',
          '유료 서비스의 요금 및 결제 방식은 다음과 같습니다.',
          '· 월간 구독: 3,000원 (매월 자동 결제)',
          '· 연간 구독: 30,000원 (매년 자동 결제)',
          '구독 요금은 부가가치세(VAT) 포함 여부 및 결제 수단 수수료 등은 결제 화면 또는 별도 안내에 따릅니다. 회사는 관련 법령이 허용하는 범위에서 요금을 변경할 수 있으며, 변경 시 적용일 및 변경 내용을 사전에 공지합니다.',
          '자동 결제 구독은 이용자가 해지하지 않는 한 각 결제 주기마다 갱신·청구됩니다. 결제·구독 관리는 서비스 내 설정 또는 회사가 안내하는 결제 페이지에서 처리할 수 있습니다.',
        ],
      },
      {
        heading: '5. 청약철회 및 환불',
        paragraphs: [
          '이용자는 유료 결제 후 디지털 콘텐츠(프리미엄 분석, AI 코칭 등)를 이용하지 않은 경우, 결제일로부터 7일 이내에 청약철회(환불)를 요청할 수 있습니다.',
          '디지털 콘텐츠의 특성상 서비스를 이미 이용한 경우(예: 프리미엄 분석 조회, AI 코칭 생성, 유료 기능 실행 등)에는 관련 법령 및 아래 기준에 따라 환불이 제한될 수 있습니다.',
          '· 월간 구독: 해당 결제 주기 중 유료 기능을 실질적으로 이용한 경우, 원칙적으로 해당 주기에 대한 환불은 제한됩니다.',
          '· 연간 구독: 이용 개시 후 환불 요청 시, 이용 일수에 해당하는 금액 및 위약금(잔여 기간 요금의 10% 또는 관련 법령이 정한 범위)을 공제한 후 환불할 수 있습니다.',
          '청약철회 및 환불 요청은 minyabee70@gmail.com으로 결제일, 계정 이메일, 요청 사유를 기재하여 접수합니다. 회사는 접수 후 영업일 기준 7일 이내에 처리 결과를 안내합니다.',
          '이용자의 귀책사유(계정 도용, 약관 위반 등)로 인한 이용 정지·해지의 경우 환불이 제한될 수 있습니다.',
        ],
      },
      {
        heading: '6. 이용자의 의무',
        paragraphs: [
          '관련 법령, 본 약관, 서비스 안내를 준수해야 합니다.',
          '서비스의 정상 운영을 방해하거나, 무단으로 API·데이터에 접근하는 행위를 해서는 안 됩니다.',
          '러닝 중 안전에 유의하고, 교통·보행 규칙을 준수할 책임은 이용자에게 있습니다.',
        ],
      },
      {
        heading: '7. 건강·운동 관련 고지',
        paragraphs: [
          '서비스에서 제공하는 분석, AI 코칭, 메트릭은 참고용이며 의학적 진단·치료를 대체하지 않습니다.',
          '건강상 우려가 있는 경우 전문의와 상담 후 이용하시기 바랍니다.',
        ],
      },
      {
        heading: '8. 지적재산권',
        paragraphs: [
          '서비스 UI, 소프트웨어, 로고 등에 대한 권리는 회사 또는 정당한 권리자에게 귀속됩니다.',
          '이용자가 업로드한 러닝 데이터에 대한 권리는 이용자에게 있으나, 서비스 제공·분석 목적의 이용·처리에 필요한 범위 내에서 회사가 사용할 수 있습니다.',
        ],
      },
      {
        heading: '9. 책임의 제한',
        paragraphs: [
          '회사는 천재지변, 시스템 장애, 제3자 서비스(Google, 결제대행사, 호스팅 등) 오류로 인한 손해에 대해 법령이 허용하는 범위 내에서 책임을 제한합니다.',
          '무료로 제공되는 기능에 대해서는 관련 법령이 허용하는 한도 내에서 손해배상 책임이 제한될 수 있습니다.',
        ],
      },
      {
        heading: '10. 이용 제한 및 해지',
        paragraphs: [
          '약관 위반, 부정 이용, 법령 위반 등의 사유가 있는 경우 회사는 서비스 이용을 제한하거나 계정을 해지할 수 있습니다.',
          '이용자는 언제든지 서비스 이용을 중단하고 계정 삭제를 요청할 수 있습니다. 유료 구독 중인 경우 구독 해지·환불은 「5. 청약철회 및 환불」을 따릅니다.',
        ],
      },
      {
        heading: '11. 서비스 이용 제한',
        paragraphs: [
          '무료 체험 기간이 종료되었음에도 유료 구독 결제가 이루어지지 않은 경우, 회사는 해당 계정의 프리미엄 기능 이용을 즉시 제한할 수 있습니다.',
          '이용이 제한되는 기능에는 정밀·심층 러닝 분석, 고급 히스토리 분석, AI 코칭 등 구독 등급(subscriber)이 필요한 기능이 포함됩니다.',
          '기본 기능(러닝 기록 조회, 기본 분석 등)은 회사 정책에 따라 제한 없이 제공될 수 있으나, 회사는 서비스 운영상 필요한 경우 이용 범위를 조정할 수 있습니다.',
          '유료 구독 만료·결제 실패·구독 해지 후에도 동일한 기준으로 프리미엄 기능 이용이 제한될 수 있습니다.',
        ],
      },
      {
        heading: '12. 약관 변경',
        paragraphs: [
          '회사는 필요한 경우 약관을 변경할 수 있으며, 변경 내용은 서비스 내 공지 또는 본 페이지에 게시합니다.',
          '요금, 청약철회, 이용 제한 등 이용자 권리·의무에 중대한 변경이 있는 경우 적용일 7일 전(이용자에게 불리한 변경은 30일 전)부터 공지합니다.',
          '변경 약관 공지 후에도 서비스를 계속 이용하면 변경에 동의한 것으로 볼 수 있습니다.',
        ],
      },
      {
        heading: '13. 문의',
        paragraphs: [
          '본 약관, 구독·결제·환불 및 서비스 이용에 관한 문의는 minyabee70@gmail.com으로 연락해 주세요.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: July 3, 2026',
    sections: [
      {
        heading: '1. Purpose',
        paragraphs: [
          'These Terms govern your use of RunningCrew ("Service") and define the rights and obligations between users and the company.',
          '"Company" means the operator of RunningCrew. "User" means a member who signed up with a Google account and uses the Service.',
          'By using the Service, you agree to these Terms and our Privacy Policy.',
        ],
      },
      {
        heading: '2. Service',
        paragraphs: [
          'RunningCrew provides GPS-based run tracking, web analytics, and AI coaching (Gemini).',
          'The Company may modify or discontinue all or part of the Service with prior notice. Changes to paid features, pricing, or trial policies will be announced via these Terms or in-app notices.',
        ],
      },
      {
        heading: '3. Accounts',
        paragraphs: [
          'You sign up with a Google account and are responsible for the accuracy of information you provide.',
          'Sharing accounts, impersonation, and unauthorized access are prohibited.',
          'Minors must use the Service with consent from a legal guardian.',
        ],
      },
      {
        heading: '4. Free trial and paid conversion',
        paragraphs: [
          'The Company provides a 5-day free trial from the signup date. During the trial, users may access the same premium features as paid subscribers (precision and advanced analysis, etc.).',
          'After the free trial ends, you must complete a paid subscription to continue using premium features. If payment is not completed, the Company may restrict access as described in Section 11.',
          'Paid plans and billing are as follows:',
          '· Monthly subscription: KRW 3,000 (auto-billed every month)',
          '· Annual subscription: KRW 30,000 (auto-billed every year)',
          'Whether VAT is included and any payment fees follow the checkout screen or separate notices. The Company may change pricing within the limits of applicable law and will announce changes in advance.',
          'Auto-renewing subscriptions renew and charge each billing cycle unless canceled. Subscription management is available in Service settings or the payment page provided by the Company.',
        ],
      },
      {
        heading: '5. Cancellation and refunds',
        paragraphs: [
          'If you have not used paid digital content (premium analysis, AI coaching, etc.) after payment, you may request cancellation (refund) within 7 days of the payment date.',
          'Due to the nature of digital content, refunds may be limited if you have already used the Service (e.g., viewed premium analysis, generated AI coaching, or executed paid features).',
          '· Monthly plan: If paid features were materially used during the billing period, refunds for that period are generally limited.',
          '· Annual plan: After use begins, refunds may deduct amounts for days used and a cancellation fee (10% of the remaining period or as permitted by law).',
          'Send refund requests to minyabee70@gmail.com with payment date, account email, and reason. The Company will respond within 7 business days.',
          'Refunds may be denied if access was suspended or terminated due to user fault (account abuse, Terms violations, etc.).',
        ],
      },
      {
        heading: '6. User obligations',
        paragraphs: [
          'You must comply with applicable laws, these Terms, and service guidelines.',
          'You must not disrupt the Service or access APIs or data without authorization.',
          'You are responsible for your safety while running and for following traffic and pedestrian rules.',
        ],
      },
      {
        heading: '7. Health disclaimer',
        paragraphs: [
          'Analytics, AI coaching, and metrics are for reference only and do not replace medical diagnosis or treatment.',
          'Consult a healthcare professional if you have health concerns before exercising.',
        ],
      },
      {
        heading: '8. Intellectual property',
        paragraphs: [
          'Rights to the Service UI, software, and branding belong to the Company or legitimate rights holders.',
          'You retain rights to your running data, but grant the Company a license to use it as needed to provide and analyze the Service.',
        ],
      },
      {
        heading: '9. Limitation of liability',
        paragraphs: [
          'The Company limits liability for damages caused by force majeure, system failures, or third-party services (Google, payment processors, hosting, etc.) to the extent permitted by law.',
          'Liability for free features may be further limited as allowed by applicable law.',
        ],
      },
      {
        heading: '10. Suspension and termination',
        paragraphs: [
          'We may restrict or terminate access for violations of these Terms, abuse, or unlawful conduct.',
          'You may stop using the Service and request account deletion at any time. If you have an active paid subscription, cancellation and refunds follow Section 5.',
        ],
      },
      {
        heading: '11. Service access restrictions',
        paragraphs: [
          'If the free trial ends without a paid subscription, the Company may immediately restrict premium features for that account.',
          'Restricted features include precision and advanced run analysis, advanced history analysis, AI coaching, and other features requiring a subscriber tier.',
          'Basic features (run history, basic analysis, etc.) may remain available under Company policy, but the Company may adjust access as needed for operations.',
          'Premium access may also be restricted after subscription expiry, payment failure, or cancellation.',
        ],
      },
      {
        heading: '12. Changes',
        paragraphs: [
          'We may update these Terms and will post changes on the Service or this page.',
          'Material changes affecting user rights or obligations (pricing, refunds, restrictions) will be announced at least 7 days in advance (30 days for changes unfavorable to users).',
          'Continued use after changes may constitute acceptance.',
        ],
      },
      {
        heading: '13. Contact',
        paragraphs: [
          'For questions about these Terms, subscriptions, payments, refunds, or the Service, contact minyabee70@gmail.com.',
        ],
      },
    ],
  },
};
