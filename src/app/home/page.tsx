import { createUser } from '@/_backend/private/createUser';
import getProjects from '@/_backend/private/projects/getProjects';

import { Card, CardTitle } from '@/components/ui/card';
import Project from '@/components/ui/project/project';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
  // FIXME call only once after login/signup
  await createUser();
  const data = await getProjects();
  if (!data?.data) {
    return <p>No Data found</p>;
  }

  return (
    <div>
      <div className="flex">
        <Link href="/home/create">
          <Card className="w-[150px] h-[150px] flex justify-center items-center m-2">
            <CardTitle>Create App</CardTitle>
            <PlusIcon />
          </Card>
        </Link>
        {data?.data.map(res => {
          return <Project item={res} key={res.id} />;
        })}
      </div>
    </div>
  );
}
