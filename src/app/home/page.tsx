import { createUser } from '@/_backend/private/createUser';
import ThemeToggle from '@/components/theme-toggle';
import AppTemplates from '@/components/ui/project/app-templates';
import InspireMe from '@/components/ui/project/inspire-me';
import MyProjects from '@/components/ui/project/my-projects';

export default async function Page() {
  // FIXME call only once after login/signup
  await createUser();

  return (
    <div className="pt-20 mx-36 bg-c-background">
      <ThemeToggle />
      <InspireMe />
      <div className="flex flex-col pt-10 gap-20">
        <MyProjects />
        <AppTemplates />
      </div>
    </div>
  );
}
