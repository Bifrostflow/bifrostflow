import TemplateNav from '@/components/ui/template/template-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-c-background flex flex-col min-h-screen">
      <TemplateNav />
      {children}
    </div>
  );
}
