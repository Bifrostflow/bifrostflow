import { createUser } from '@/_backend/private/createUser';
import getProjects from '@/_backend/private/projects/getProjects';

import ProjectCard from '@/components/ui/project/project-card';
import StartNew from '@/components/ui/project/start-new';

export default async function Page() {
  // FIXME call only once after login/signup
  await createUser();
  const data = await getProjects();
  if (!data?.data) {
    return <p>No Data found</p>;
  }
  const { current_project_count, project_limit, projects } = data.data;
  return (
    <div>
      <div className="flex">
        <div className="flex flex-row gap-4 my-4">
          <StartNew
            current_project_count={current_project_count}
            project_limit={project_limit}
          />
          {projects.map(res => {
            return <ProjectCard item={res} key={res.id} />;
          })}
        </div>
      </div>
    </div>
  );
}
