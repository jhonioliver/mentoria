import { redirect } from 'next/navigation';
import { getUserLayer } from '@/utils/get-user-layer';
import { headers, cookies } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jhoni',
  description: '@ojhonioliver',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cks = await cookies();
  const hdrs = await headers();

  const userLayer = await getUserLayer({ cks, hdrs });
  const content = cks.get('xcat_valid')?.value || '';

  // === BLACK - URLs diferentes por parâmetro ===
  if (userLayer === 3) {
    const blackUrls: Record<string, string> = {
      mentoria:  'https://jhonioliver.com/mentoria',
      blackroom: 'https://jhonioliver.com/blackroom',
      mra:       'https://jhonioliver.com/mra',
      tsv:       'https://jhonioliver.com/tsv',
    };

    const target = blackUrls[content] || 'https://jhonioliver.com/mentoria';
    redirect(target);
  }

  // === GRAY ===
  if (userLayer === 2) {
    redirect('https://jhonioliver.com/basico');
  }

  // === WHITE ===
  redirect('https://jhonioliver.com/basico');
}