import React from 'react';
import '@xyflow/react/dist/style.css';
import { getTemplateById } from '@/_backend/private/projects/getTemplates';
import TryNowButton from '@/components/ui/template/try-now-button';

export default async function Flow({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplateById(slug);
  if (template?.data) {
    return (
      <div>
        {slug}
        <h1>{template?.data?.name}</h1>
        <p>{template?.data?.description}</p>
        <TryNowButton template={template?.data} />
      </div>
    );
  } else {
    return <div>Something went wrong...</div>;
  }
}
