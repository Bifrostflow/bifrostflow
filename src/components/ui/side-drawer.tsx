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
import { Typography } from './typography';
import { Button } from './button';

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
      return 'text-green-600 dark:text-green-400';
    case 'close':
      return 'text-orange-600 dark:text-orange-400';
    case 'conditional':
      return 'text-cyan-600 dark:text-cyan-400';
    case 'generate':
      return 'text-blue-600 dark:text-blue-400';
    case 'initiate':
      return 'text-emerald-600 dark:text-emerald-400';
    default:
      return 'text-green-600 dark:text-green-400';
  }
};
const typeToSelectedRngActiveColor = (category: ToolCategory) => {
  switch (category) {
    case 'action':
      return 'ring-green-500 dark:ring-green-400';
    case 'close':
      return 'ring-orange-500 dark:ring-orange-400';
    case 'conditional':
      return 'ring-cyan-500 dark:ring-cyan-400';
    case 'generate':
      return 'ring-blue-500 dark:ring-blue-400';
    case 'initiate':
      return 'ring-emerald-500 dark:ring-emerald-400';
    default:
      return 'ring-green-500 dark:ring-green-400';
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
    <div className="max-h-full h-full p-4 ">
      <div className="py-4 flex justify-between items-center ">
        <Typography variant={'h3'} className="text-c-background-text">
          Select Tools
        </Typography>
        <Button size={'icon'} onClick={onCloseHandler}>
          <X />
        </Button>
      </div>
      <div className="flex flex-row bg-c-background py-2 flex-wrap gap-2 rounded-md mb-4">
        {nodesClassification.map(category => {
          const isSelected = selectedCategory === category;
          const baseClass =
            'capitalize font-xs text-blue-100 dark:bg-zinc-900 bg-zinc-100 py-1 px-3 rounded-full shadow-lg';
          const categoryClass = clsx(
            baseClass,
            typeToActiveColor(category),
            {
              'ring-2 ring-blue-400': isSelected,
              [typeToSelectedRngActiveColor(category)]: isSelected,
              'opacity-50': !tabsToSelectValue.includes(category),
              'cursor-pointer': tabsToSelectValue.includes(category),
            },
            'disabled:text-zinc-400',
          );

          return (
            <Button
              size={'sm'}
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
            </Button>
          );
        })}
        {selectedCategory && (
          <Button
            variant={'ghost'}
            size={'sm'}
            className="ml-2 text-red-400 text-xs underline"
            onClick={() => setSelectedCategory(null)}>
            Clear
          </Button>
        )}
      </div>

      <div className="flex h-[80vh] flex-col gap-3 overflow-y-scroll pb-4  scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-thumb-blue-500 dark:scrollbar-track-gray-200">
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
  );
}
