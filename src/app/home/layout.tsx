import HomeNav from '@/components/ui/project/home-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" bg-c-background text-c-background-text min-h-screen">
      <HomeNav />
      {children}
    </div>
  );
}
