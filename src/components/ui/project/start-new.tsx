'use client';
import React, { useState } from 'react';
import { Typography } from '../typography';
import { cn } from '@/lib/utils';
import { createProject } from '@/_backend/private/projects/createProject';
import { showToast } from '../toast';
import { Loader } from 'lucide-react';

const StartNew = ({
  current_project_count,
  project_limit,
}: {
  current_project_count: number;
  project_limit: number;
}) => {
  const [creating, setCreating] = useState(false);

  const checkProjectLimit = () => {
    if (current_project_count >= project_limit) {
      showToast({
        title: 'Project Limit Reached',
        description: `You have reached your project limit of ${project_limit}. Proceed to select a plan to create more projects.`,
        type: 'success',
      });
      return false;
    }
    return true;
  };

  const createProjectHandler = async () => {
    if (!checkProjectLimit()) {
      return;
    }
    setCreating(true);
    try {
      const response = await createProject({
        name: 'New Project',
        description: 'This is a new project',
        users: '',
        edges: '',
        nodes: '',
        api_keys: '',
      });
      if (response?.data) {
        window.location.href = `/flow/${response.data[0].id}?show=edit`;
      } else {
        showToast({
          title: 'Create app failed',
          description:
            response?.message || response?.error || 'Something went wrong',
          type: 'error',
        });
      }
    } catch (error) {
      console.log('Error creating project:', error);
    } finally {
      setCreating(false);
    }
  };
  return (
    <button
      disabled={creating}
      type="button"
      aria-label="Start New Project"
      title="Start New Project"
      data-testid="start-new-project"
      id="start-new-project"
      onClick={createProjectHandler}
      className="rounded-md min-w-2xs max-w-2xs w-full group/card bg-c-surface">
      <div
        className={cn(
          'cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-center items-center p-4 dark:border-2 dark:border-c-border ',
        )}>
        {/* ✅ Overlay gradient */}
        <div className="absolute inset-0 transition duration-300  bg-gradient-to-b from-transparent dark:via-black/50 hover:dark:via-transparent dark:to-black/90 via-transparent to-c-primary/90 opacity-60 z-10"></div>

        <Typography
          variant={'h2'}
          className="group-hover/card:text-c-primary/80">
          Start New
        </Typography>
        <Typography
          variant={'p'}
          className="group-hover/card:text-c-primary/80">
          Notingh can stop you now...
        </Typography>
        {creating && (
          <Loader className="absolute top-4 right-4 text-c-background-text group-hover/card:text-c-primary/80 transition duration-300 animate-spin" />
        )}
      </div>
    </button>
  );
};

export default StartNew;
