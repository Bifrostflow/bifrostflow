import {
  getSystemTools,
  ToolCategory,
  SystemTool,
} from '@/_backend/getSystemTools';
import { useEffect, useState } from 'react';
import { SystemToolItem } from './system-tool-item';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useFlow } from '@/context/flow-context';

const nodesClassification: ToolCategory[] = [
  'initiate',
  'conditional',
  'action',
  'generate',
  'close',
];

const typeToActiveColor = (category: ToolCategory) => {
  switch (category) {
    case 'action':
      return 'text-cyan-500';
    case 'close':
      return 'text-pink-500';
    case 'conditional':
      return 'text-lime-500';
    case 'generate':
      return 'text-cyan-500';
    case 'initiate':
      return 'text-emerald-500';
    default:
      return 'text-zinc-500';
  }
};

export default function SideDrawer() {
  const [systemNodes, setSystemNodes] = useState<SystemTool[]>();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(
    null,
  );
  const { handleAddNode, setToolDrawerOpen, tabsToSelectValue } = useFlow();

  const onCloseHandler = () => {
    setToolDrawerOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    getSystemTools()
      .then(nodes => setSystemNodes(nodes))
      .catch(error => console.error('Failed to fetch system nodes:', error))
      .finally(() => setLoading(false));
  }, []);

  const filteredNodes = systemNodes?.filter(node => {
    const isActiveTab = tabsToSelectValue.includes(node.category);
    const matchesSelected = selectedCategory
      ? node.category === selectedCategory
      : true;
    return isActiveTab && matchesSelected;
  });

  return (
    <>
      <div className={``}>
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold bg-gradient-to-tl from-blue-400 to-blue-500 bg-clip-text text-transparent">
            Select Tools
          </h2>
          <button
            onClick={onCloseHandler}
            className="text-zinc-200 hover:text-zinc-100 bg-gradient-to-br from-red-500 to-indigo-800 p-2 rounded-full">
            <X />
          </button>
        </div>
        <div className="h-[0.5px] rounded-lg bg-gradient-to-r from-blue-400 to-blue-500" />

        <div className="flex flex-row bg-zinc-700 p-2 flex-wrap gap-2">
          {nodesClassification.map(category => {
            const isSelected = selectedCategory === category;
            const baseClass =
              'capitalize font-xs text-blue-100 bg-zinc-800 py-1 px-3 rounded-sm shadow-md';
            const categoryClass = clsx(
              baseClass,
              typeToActiveColor(category),
              {
                'ring-2 ring-blue-400': isSelected,
                'opacity-50': !tabsToSelectValue.includes(category),
                'cursor-pointer': tabsToSelectValue.includes(category),
              },
              'disabled:text-zinc-400',
            );

            return (
              <button
                key={category}
                disabled={!tabsToSelectValue.includes(category)}
                className={categoryClass}
                onClick={() => {
                  if (selectedCategory === category) {
                    setSelectedCategory(null);
                  } else {
                    setSelectedCategory(category);
                  }
                }}>
                {category}
              </button>
            );
          })}
          {selectedCategory && (
            <button
              className="ml-2 text-red-400 text-xs underline"
              onClick={() => setSelectedCategory(null)}>
              Clear
            </button>
          )}
        </div>

        <div className="">
          {!loading &&
            filteredNodes?.map(node =>
              node.type === 'classify_message' ? null : (
                <SystemToolItem
                  onAddNode={node => {
                    handleAddNode(node);
                  }}
                  node={node}
                  key={node.id}
                />
              ),
            )}
        </div>
      </div>
    </>
  );
}
