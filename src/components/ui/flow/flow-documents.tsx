import {
  getDocsForFlow,
  IFlowDocument,
  openDocForFlow,
} from '@/_backend/private/projects/getNodesForFlow';
import { useFlow } from '@/context/flow-context';
import React, { useEffect, useState } from 'react';
import { Typography } from '../typography';
import moment from 'moment';
import { DynamicIcon } from 'lucide-react/dynamic';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import { showToast } from '../toast';

const FlowDocuments = () => {
  const [documents, setDocuments] = useState<IFlowDocument[]>([]);
  const [gettingDocs, setGettingDocs] = useState(true);

  const { slug } = useFlow();
  useEffect(() => {
    setGettingDocs(true);
    getDocsForFlow(slug)
      .then(res => {
        if (res.isSuccess) {
          setDocuments(res.data || []);
        }
      })
      .finally(() => {
        setGettingDocs(false);
      });
  }, [setGettingDocs, setDocuments, slug]);
  return (
    <div className="max-w-[450px]">
      <Typography className="text-14 font-semibold py-2">
        Download and save the files locally, as they will be automatically
        deleted after 48 hours.
      </Typography>
      <div className="flex flex-col gap-2">
        {(gettingDocs
          ? (Array.from({ length: 5 }) as unknown as IFlowDocument[])
          : documents
        ).map((doc: IFlowDocument, index: number) => (
          <DocumentItem
            key={gettingDocs ? index : doc.id}
            isLoading={gettingDocs}
            item={doc}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowDocuments;

const DocumentItem = ({
  item,
  isLoading,
}: {
  item: IFlowDocument;
  isLoading: boolean;
}) => {
  const [opening, setOpening] = useState(false);
  const { slug } = useFlow();
  const openDoc = () => {
    setOpening(true);
    openDocForFlow(slug, item.name)
      .catch(e => {
        showToast({ description: 'Something went wrong: ' + e, type: 'error' });
      })
      .finally(() => {
        setOpening(false);
      });
  };
  return (
    <div
      className={cn(
        'w-md flex flex-row justify-between gap-2 items-center p-2 bg-c-surface rounded-lg px-3',
        isLoading && 'animate-pulse',
      )}>
      <DynamicIcon
        name="file"
        size={30}
        className={isLoading ? 'opacity-40' : ''}
      />
      <div className="w-[80%]">
        {isLoading ? (
          <>
            <div className="h-4 w-[70%] bg-muted rounded-md mb-2" />
            <div className="h-3 w-[40%] bg-muted rounded-md" />
          </>
        ) : (
          <>
            <Typography
              variant={'p'}
              className="font-semibold  whitespace-pre-wrap break-words tracking-normal truncate">
              {item.name}
            </Typography>
            <Typography>
              {moment(item.created_at).local().format('DD-MM-YYYY h:mm:ss A')}
            </Typography>
          </>
        )}
      </div>
      <Button
        disabled={opening}
        onClick={openDoc}
        size={'icon'}
        variant={'link'}>
        <DynamicIcon
          name={opening ? 'loader-2' : 'external-link'}
          className={isLoading ? 'opacity-40' : opening ? 'animate-spin' : ''}
        />
      </Button>
    </div>
  );
};
