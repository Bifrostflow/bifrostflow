import { UserButton } from '@clerk/nextjs';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 ">
      <nav className="flex justify-between">
        <h1 className="text-4xl">Home</h1>
        <UserButton userProfileUrl="/profile" />
      </nav>
      {children}
    </div>
  );
}
