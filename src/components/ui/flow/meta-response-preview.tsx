/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ChunkResponse } from '@/_backend/runFlow';
import { Typography } from '../typography';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { Button } from '../button';
type DataObject = Record<string, any>;

const isObject = (val: any): val is Record<string, any> =>
  val && typeof val === 'object' && !Array.isArray(val);

const KeyValueBlock = ({ title, value }: { title: string; value: any }) => {
  return (
    <div className="text-c-background-text mb-2">
      <div className="flex flex-row gap-2 justify-between items-center">
        <Typography variant={'h3'} className="font-bold text-xl capitalize">
          {title}
        </Typography>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(value);
          }}
          variant={'ghost'}
          size={'icon'}>
          <Copy />
        </Button>
      </div>
      <div className="text-c-background-text-muted text-[14px] font-medium whitespace-pre-wrap break-words">
        {typeof value === 'string' ? (
          value
        ) : (
          <Typography variant={'p'}>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </Typography>
        )}
      </div>
    </div>
  );
};

const NestedObjectRenderer = ({ obj }: { obj: DataObject }) => {
  return (
    <>
      {Object.entries(obj.meta).map(([subKey, subVal]) => {
        if (typeof subVal === 'string' && subVal.trim() !== '') {
          return <KeyValueBlock key={subKey} title={subKey} value={subVal} />;
        }
        return null;
      })}
    </>
  );
};

function MetaResponsePreview({ data }: { data: ChunkResponse }) {
  const renderMeta = () => {
    const meta = data.meta;
    if (!isObject(meta)) return null;

    return Object.entries(meta).map(([key, value]) => {
      if (['node_id', 'type'].includes(key)) return null;
      if (value === null || value === undefined || value === '') return null;

      return <KeyValueBlock key={key} title={key} value={value} />;
    });
  };

  const renderFallback = () => {
    if (!data?.meta) return null;
    return Object.entries(data?.meta).map(([key, value]) => (
      <div
        key={key}
        className="text-c-background-text whitespace-pre-wrap break-words">
        <Typography className="text-c-background-text font-bold text-xl">
          {key}
        </Typography>
        {isObject(value) ? (
          <NestedObjectRenderer obj={value} />
        ) : (
          <Typography variant={'p'}>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </Typography>
        )}
      </div>
    ));
  };

  return (
    <motion.div
      initial={{ translateY: -5, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: -5, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="border-1 border-c-secondary p-4 bg-background rounded-md max-w-md">
      {isObject(data.meta) ? renderMeta() : renderFallback()}
    </motion.div>
  );
}

export default MetaResponsePreview;
