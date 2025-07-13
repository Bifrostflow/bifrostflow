'use client';
import React, { useState } from 'react';
import { Typography } from '../typography';
import { createProject } from '@/_backend/private/projects/createProject';
import { showToast } from '../toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
        snap_path: '',
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
    <motion.button
      disabled={creating}
      aria-label="Start New Project"
      title="Start New Project"
      data-testid="start-new-project"
      id="start-new-project"
      onClick={createProjectHandler}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative h-70 p-4 rounded-2xl min-w-3xs max-w-3xs w-full overflow-hidden shadow-lg bg-c-surface hover:bg-c-surface/90 group border-1 border-c-secondary mr-10 justify-around items-center flex flex-col text-left">
      <Typography
        variant={'h2'}
        className="group-hover/card:text-c-secondary/80">
        Start New
      </Typography>
      <Typography
        variant={'blockquote'}
        className="group-hover/card:text-c-secondary/80">
        <blockquote>
          &quot; Every unicorn starts with a single click...&quot;
        </blockquote>
      </Typography>
      {/* {!creating && (
        <div className="flex fex-row w-full justify-center items-center h-full">
          <Button size={'icon'} variant={'secondary'}>
            <DynamicIcon name="plus" size={32} />
          </Button>
        </div>
      )} */}
      {creating && (
        <Loader2 className="absolute bottom-4 right-4 text-c-secondary group-hover/card:text-c-primary/80 transition duration-300 animate-spin" />
      )}
    </motion.button>
  );
};

export default StartNew;
