'use client';
import {
  ToolCategory,
  SystemTool,
  SystemToolType,
} from '@/_backend/getSystemTools';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { Typography } from './typography';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { useState } from 'react';
import AppTooltip from './app-tooltip';
type SystemToolItemProps = {
  onAddNode: (node: SystemTool) => void;
  node: SystemTool;
};

export const typeToIcon = (type: SystemToolType): IconName => {
  switch (type) {
    case 'evaluate_code':
    case 'code_documentation':
      return 'file-sliders';
    case 'write_code':
      return 'code';
    case 'write_message':
      return 'keyboard';
    case 'doc_to_pdf':
      return 'file';
    case 'script_writer':
      return 'scroll-text';
    case 'tavily_search':
      return 'search';
    case 'google_trend':
      return 'rss';
    case 'create_tweet':
      return 'twitter';
    case 'write_mail_and_send':
      return 'send';
    case 'conditional_routing':
    case 'classify_message':
    case 'route_query':
    case 'start':
      return 'split';
    case 'on_speech':
      return 'mic';
    case 'on_prompt':
      return 'message-square';
    case 'start':
    case 'on_start':
      return 'play';
    case 'end':
      return 'power';
    default:
      return 'wrench';
  }
};
const typeToHoverTextColor = (category: ToolCategory) => {
  switch (category) {
    case 'action':
      return 'group-hover:text-green-500 dark:group-hover:text-green-400 ';
    case 'close':
      return 'group-hover:text-orange-500 dark:group-hover:text-orange-600 ';
    case 'conditional':
      return 'group-hover:text-cyan-500 dark:group-hover:text-cyan-400 ';
    case 'generate':
      return 'group-hover:text-blue-500 dark:group-hover:text-blue-400 ';
    case 'initiate':
      return 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400 ';
    default:
      return 'group-hover:text-green-500 dark:group-hover:text-green-400 ';
  }
};
const typeToHoverColor = (category: ToolCategory) => {
  switch (category) {
    case 'action':
      return 'dark:hover:border-green-500 hover:border-green-500';
    case 'close':
      return 'dark:hover:border-orange-600 hover:border-orange-500';
    case 'conditional':
      return 'dark:hover:border-cyan-500 hover:border-cyan-500';
    case 'generate':
      return 'dark:hover:border-blue-500 hover:border-blue-500';
    case 'initiate':
      return 'dark:hover:border-emerald-500 hover:border-emerald-500';
    default:
      return 'dark:hover:border-green-500 hover:border-green-500';
  }
};
const typeToButtonBGColor = (category: ToolCategory) => {
  switch (category) {
    case 'action':
      return 'dark:group-hover:from-green-600 dark:group-hover:to-green-700  group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-green-600';
    case 'close':
      return 'group-hover:bg-gradient-to-r dark:group-hover:from-orange-700 dark:group-hover:to-orange-700/50   group-hover:from-orange-400 group-hover:to-orange-600';
    case 'conditional':
      return 'dark:group-hover:from-cyan-600 dark:group-hover:to-cyan-700  group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-cyan-600';
    case 'generate':
      return 'dark:group-hover:from-blue-400 dark:group-hover:to-blue-500  group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-blue-600';
    case 'initiate':
      return 'dark:group-hover:from-emerald-500 dark:group-hover:to-emerald-500  group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-emerald-600';
    default:
      return 'dark:group-hover:from-green-500 dark:group-hover:to-green-500  group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-green-600';
  }
};

export const SystemToolItem = ({ onAddNode, node }: SystemToolItemProps) => {
  // w-full
  const [fullDetails, setFullDetails] = useState(false);
  const iconClass = clsx(
    'flex-1 mt-2 ',
    `${typeToHoverTextColor(node.category)}`,
  );
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        `
        border-2 
        border-transparent
        rounded-lg 
        2xl:rounded-xl 
        lg:py-2
        p-1
        2xl:p-2
        shadow-md 
        bg-zinc-200/80 
        dark:bg-c-background/60 
        group 
        transition-all 
        duration-100 
        ease-in-out 
        bg-gradient-to-r 
        from-zinc-200/40 
        via-zinc-50 
        to-zinc-200 
        dark:from-zinc-800 
        dark:via-zinc-800 
        dark:to-zinc-900
        `,
        typeToHoverColor(node.category),
      )}>
      <div className="flex flex-row gap-1 2xl:gap-3 justify-start items-start">
        <DynamicIcon
          name={typeToIcon(node.type)}
          // size={40}
          className={cn(
            `
            2xl:h-[32px] 2xl:w-[32px]
            xl:h-[28px] xl:w-[28px]
            lg:h-[26px] lg:w-[26px]
            `,
            iconClass,
          )}
        />
        <div className="flex flex-col gap-1 flex-7 justify-center items-start ">
          <div className="flex flex-col 2xl:gap-1 items-start text-left  w-full ">
            <div className="flex flex-row justify-between items-center w-full">
              <Typography
                variant={'h4'}
                className={cn(
                  'text-c-background-text',
                  `${typeToHoverTextColor(node.category)}`,
                )}>
                {node.name}
              </Typography>
              <Button
                onClick={() => {
                  setFullDetails(!fullDetails);
                }}
                size={'icon'}
                variant={'ghost'}>
                <DynamicIcon name="maximize" size={18} />
              </Button>
            </div>
            <Typography
              variant={'p'}
              className="2xl:text-sm text-xs text-c-background-text-muted">
              {node.description}
            </Typography>
          </div>
          <div className="flex flex-row justify-start items-center gap-1">
            {node.llm && (
              <Typography className="capitalize font-bold text-c-primary text-[10px] 2xl:text-xs">
                LLM: {node.llm}
              </Typography>
            )}
            {node.gpt_model && (
              <Typography className="capitalize font-bold text-c-primary text-[10px] 2xl:text-xs">
                {node.gpt_model}
              </Typography>
            )}
          </div>

          <Button
            className={cn(
              'transition-all duration-100 ease-in-out my-1 2xl:my-2',
              'bg-gradient-to-r dark:from-zinc-600 dark:to-zinc-700   from-zinc-500 to-zinc-600',
              `${typeToButtonBGColor(node.category)}`,
            )}
            disabled={node.state === 'inactive'}
            onClick={() => onAddNode(node)}
            size="default">
            Use
          </Button>
          {fullDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-row justify-between items-center my-2">
              <div className="flex flex-row-justify-start-items-center gap-2">
                <AppTooltip
                  tip={node.require_key ? 'Key required' : 'No key required'}>
                  <DynamicIcon
                    name="key"
                    className={
                      node.require_key
                        ? 'text-c-secondary'
                        : 'text-c-background-text-muted'
                    }
                  />
                </AppTooltip>
                {node.require_key && (
                  <Typography className="uppercase font-semibold tracking-wider">
                    {node.key_name?.replaceAll('-', ' ')}
                  </Typography>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
