import React from 'react';
import { Typography } from '../typography';
import StartNew from './start-new';
import { cn } from '@/lib/utils';
import ProjectCard from './project-card';
import getProjects from '@/_backend/private/projects/getProjects';

const MyProjects = async () => {
  const data = await getProjects();
  if (!data?.data) {
    return <p>No Data found</p>;
  }
  const { current_project_count, project_limit, projects } = data.data;
  return (
    <section className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-start items-center gap-4">
          <Typography className="text-c-background-text" variant={'h2'}>
            Flows
          </Typography>
          <div className="border-b border-c-background-text/30 my-2 w-full" />
        </div>
        <Typography className="text-c-surface-text-muted/90">
          {current_project_count} of {project_limit} flows used
        </Typography>
      </div>
      <div className={cn('flex flex-col lg:flex-row gap-4 my-4 ')}>
        <div className="flex flex-col">
          <StartNew
            current_project_count={current_project_count}
            project_limit={project_limit}
          />
        </div>
        <div className="flex flex-row gap-4 flex-wrap">
          {projects.map(res => {
            return <ProjectCard item={res} key={res.id} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default MyProjects;
