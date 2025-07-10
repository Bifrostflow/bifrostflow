'use client';
import React, { useState } from 'react';
import { Button } from '../button';
import { tryTemplate } from '@/_backend/private/projects/createProject';
import { FlowTemplate } from '@/_backend/private/projects/getTemplates';
import print from '@/lib/print';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function TryNowButton({ template }: { template: FlowTemplate }) {
  const [creatingProject, setcreatingProject] = useState(false);
  const router = useRouter();
  return (
    <Button
      disabled={creatingProject}
      onClick={async () => {
        setcreatingProject(true);
        try {
          const response = await tryTemplate(template.id);
          if (response?.data) {
            router.replace(`/flow/${response?.data[0]?.id}`);
          } else {
            toast(response?.message || response?.error || 'Create app failed');
          }
        } catch (error) {
          toast('Create app failed');
          print(error);
        } finally {
          setcreatingProject(false);
        }
      }}>
      {creatingProject ? 'Creating...' : 'Try Now'}
    </Button>
  );
}

export default TryNowButton;
