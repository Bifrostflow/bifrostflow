import { createUser } from '@/_backend/private/createUser';
import getProjects from '@/_backend/private/projects/getProjects';
import getTemplates from '@/_backend/private/projects/getTemplates';

import { Card, CardTitle } from '@/components/ui/card';
import AppTemplate from '@/components/ui/project/app-template';
import Project from '@/components/ui/project/project';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
  // FIXME call only once after login/signup
  await createUser();
  const projects = await getProjects();
  const appTemplates = await getTemplates();

  return (
    <div>
      <div className="flex flex-col">
        <h1>My projects</h1>
        <div className="flex">
          <Link href="/home/create">
            <Card className="w-[150px] h-[150px] flex justify-center items-center m-2">
              <CardTitle>Create App</CardTitle>
              <PlusIcon />
            </Card>
          </Link>
          {!!projects?.data?.length &&
            projects?.data.map(res => {
              return <Project item={res} key={res.id} />;
            })}
        </div>
        <h1>App templates</h1>
        <div>
          {!!appTemplates?.data?.length &&
            appTemplates?.data.map(template => {
              return <AppTemplate item={template} key={template.id} />;
            })}
        </div>
      </div>
    </div>
  );
}
