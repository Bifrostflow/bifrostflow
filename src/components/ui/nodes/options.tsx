import React from 'react';

type Props = {
  onAdd: () => void;
  onRemove: () => void;
};

export default function Options({}: Props) {
  return <div className="p-1 bg-zinc-300 rounded-xs absolute -top-2"></div>;
}
