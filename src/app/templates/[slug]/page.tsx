import React from 'react';
import '@xyflow/react/dist/style.css';
import { getTemplateById } from '@/_backend/private/projects/getTemplates';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import BuyNow from '@/components/ui/template/buy-now';
import MarkFavourite from '@/components/ui/template/mark-favourite';
import GoBack from '@/components/ui/template/go-back';

export default async function Flow({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplateById(slug);
  if (template?.data) {
    const { createdBy, description, name, tags, price } = template.data;
    return (
      <div className="pt-30">
        <div
          className="ml-[25%]
        flex flex-col">
          <div
            id="content"
            className="flex flex-row justify-start items-start gap-10">
            <div className="flex flex-col justify-start items-start gap-2">
              <Typography
                variant={'h1'}
                className="mb-5 text-c-background-text">
                {name}
              </Typography>
              <Typography
                className="w-3xl mb-5 text-c-background-text"
                variant={'p'}>
                {description}
              </Typography>
              <Typography variant={'h3'} className="text-c-background-text">
                Created By :<span className="capitalize"> {createdBy}</span>
              </Typography>
              <div className="flex flex-row gap-2 my-2">
                {tags.map(tag => {
                  return (
                    <Badge variant={'default'} key={tag}>
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div>
              <MarkFavourite template_id={template.data.id} />
            </div>
          </div>
          <div className="w-full border-b-1 border-b-c-border my-5"></div>
          <div id="pricing-area" className="flex flex-col w-2xs">
            {!template.data.is_purchased && !!price && (
              <>
                <Typography className="text-c-background-text" variant={'h2'}>
                  Checkout
                </Typography>
                <div className="w-2xs flex flex-row justify-between items-center my-2">
                  <Typography
                    className="mb-2 text-c-background-text"
                    variant={'h3'}>
                    Price:
                  </Typography>
                  <Typography
                    className={
                      price ? 'mb-2 text-c-primary' : 'mb-2 text-c-secondary'
                    }
                    variant={'h4'}>
                    {price ? `$${price}` : 'Free'}
                  </Typography>
                </div>

                <div className="w-2xs flex flex-row justify-between items-center my-2 pt-3 border-t-1 border-t-c-border">
                  <Typography className="mb-2 text-c-secondary" variant={'h3'}>
                    Total:
                  </Typography>
                  <Typography
                    className={'mb-2 text-c-secondary'}
                    variant={'h4'}>
                    {`$${price}`}
                  </Typography>
                </div>
              </>
            )}
            <div className="flex flex-row gap-2 mt-3">
              <GoBack />
              <BuyNow product={template.data} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Something went wrong...</div>;
  }
}
