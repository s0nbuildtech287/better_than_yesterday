import React from 'react';
import { Metadata } from 'next';
import { IntroShowcase } from '@/components/IntroShowcase';

export const metadata: Metadata = {
  title: 'Giới Thiệu 3D — Better Than Yesterday',
  description: 'Hệ thống quản trị kỷ luật, theo dõi thói quen chuẩn GitHub và tự do tài chính 6 hũ.',
};

export default function IntroPage() {
  return <IntroShowcase />;
}

