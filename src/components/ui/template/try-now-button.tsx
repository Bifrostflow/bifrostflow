'use client';
import React, { useState } from 'react';
import { Button } from '../button';
import { tryTemplate } from '@/_backend/private/projects/createProject';
import { FlowTemplate } from '@/_backend/private/projects/getTemplates';
import print from '@/lib/print';
import { useRouter } from 'next/navigation';
import { showToast } from '../toast';
import { Loader2 } from 'lucide-react';

function TryNowButton({
  template,
  UIRole = 'page',
}: {
  template: FlowTemplate;
  UIRole?: 'page' | 'card';
}) {
  const [creatingProject, setcreatingProject] = useState(false);
  const router = useRouter();
  const onTryNowHandler = async () => {
    setcreatingProject(true);
    try {
      const response = await tryTemplate(template.id);
      if (response?.isSuccess && response.data) {
        router.replace(`/flow/${response?.data[0]?.id}`);
      } else {
        showToast({
          description:
            response?.message || response?.error || 'Create app failed',
          type: 'error',
        });
      }
    } catch (error) {
      showToast({
        description: 'Create app failed',
        type: 'error',
      });

      print(error);
    } finally {
      setcreatingProject(false);
    }
  };

  return (
    <Button
      variant={'default'}
      className="w-28"
      disabled={creatingProject}
      onClick={
        UIRole === 'card'
          ? () => {
              router.push(`/templates/${template.id}`);
            }
          : onTryNowHandler
      }>
      {creatingProject && <Loader2 className="animate-spin" />}
      Try Now
    </Button>
  );
}

export default TryNowButton;
