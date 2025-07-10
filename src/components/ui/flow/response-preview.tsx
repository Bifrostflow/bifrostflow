/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

type DataObject = Record<string, any>;

const isObject = (val: any): val is Record<string, any> =>
  val && typeof val === 'object' && !Array.isArray(val);

const KeyValueBlock = ({ title, value }: { title: string; value: any }) => {
  return (
    <div className="text-black">
      <div className="flex flex-row gap-2">
        <h1 className="font-bold text-xl">{title}</h1>
        <p>Copy button</p>
      </div>
      <div>
        {typeof value === 'string' ? (
          value
        ) : (
          <pre>{JSON.stringify(value, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

const NestedObjectRenderer = ({ obj }: { obj: DataObject }) => {
  return (
    <>
      {Object.entries(obj).map(([subKey, subVal]) => {
        if (typeof subVal === 'string' && subVal.trim() !== '') {
          return <KeyValueBlock key={subKey} title={subKey} value={subVal} />;
        }
        return null;
      })}
    </>
  );
};

function ResponsePreview({ data }: { data: DataObject }) {
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
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="text-black">
        <h1 className="font-bold text-xl">{key}</h1>
        {isObject(value) ? (
          <NestedObjectRenderer obj={value} />
        ) : (
          <pre>{JSON.stringify(value, null, 2)}</pre>
        )}
      </div>
    ));
  };

  return (
    <div className="p-4 bg-white absolute bottom-0 left-0">
      {isObject(data.meta) ? renderMeta() : renderFallback()}
    </div>
  );
}

export default ResponsePreview;
