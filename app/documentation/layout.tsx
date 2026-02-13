import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Task-Dokumentation – B3Echo',
};

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
