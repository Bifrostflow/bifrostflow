'use client';
// import AccessibilitySettings from '@/components/ui/settings/accessibility-setting';
import PlansSettings from '@/components/ui/settings/plans-setting';
import ProfileSettings from '@/components/ui/settings/profile-setting';
import SettingsSidebar from '@/components/ui/settings/settings-sidebar';
import ThemeSettings from '@/components/ui/settings/theme-setting';
import { useParams } from 'next/navigation';

export default function SettingsPage() {
  const { slug } = useParams();

  const renderSection = () => {
    switch (slug) {
      case 'profile':
        return <ProfileSettings />;
      case 'theme':
        return <ThemeSettings />;
      // case 'accessibility':
      //   return <AccessibilitySettings />;
      case 'plans':
        return <PlansSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="flex flex-col max-w-6xl mx-auto bg-c-surface rounded-xl shadow-xl p-0 gap-6 mt-20 md:flex-row">
        <SettingsSidebar />
        <section className="flex-1">{renderSection()}</section>
      </div>
    </main>
  );
}
