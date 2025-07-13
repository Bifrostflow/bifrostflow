import React from 'react';
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { useThemeToggle } from '@/hooks/theme-toggle';

export function AnimatedSVGEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle r="4" fill="var(--c-secondary)">
        <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}

export function AnimatedSVGEdgeConditional({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { theme } = useThemeToggle();
  {
    /* 'dark' ? 'var(--color-cyan-600)' : 'var(--color-cyan-800)' */
  }
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle
        r="4"
        fill={
          theme === 'light'
            ? 'oklch(45% 0.085 224.283)'
            : 'oklch(60.9% 0.126 221.723)'
        }>
        <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}

export function AnimatedSVGEdgeAction({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { theme } = useThemeToggle();
  {
    /*   theme == 'dark'
              ? 'var(--color-green-600)'
              : 'var(--color-green-800)', */
  }
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle
        r="4"
        fill={
          theme === 'dark'
            ? 'oklch(62.7% 0.194 149.214)'
            : 'oklch(44.8% 0.119 151.328)'
        }>
        <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}

export function AnimatedSVGEdgeGenerate({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { theme } = useThemeToggle();
  {
    /* theme == 'dark' ? 'var(--color-blue-600)' : 'var(--color-blue-800)', */
  }
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle
        r="4"
        fill={
          theme === 'dark'
            ? 'oklch(54.6% 0.245 262.881)'
            : 'oklch(42.4% 0.199 265.638)'
        }>
        <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}

export function AnimatedSVGEdgeClose({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { theme } = useThemeToggle();
  {
    /*theme == 'dark'
              ? 'var(--color-orange-400)'
              : 'var(--color-orange-600)', */
  }
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle
        r="4"
        fill={
          theme === 'dark'
            ? 'oklch(75% 0.183 55.934)'
            : 'oklch(64.6% 0.222 41.116)'
        }>
        <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}
