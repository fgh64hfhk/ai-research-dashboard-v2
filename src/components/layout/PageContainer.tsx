// /components/layout/PageContainer.tsx
export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-3xl py-8 px-4 md:px-8 space-y-6">
      {children}
    </div>
  );
}
