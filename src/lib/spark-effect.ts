let styleSheet: HTMLStyleElement | null = null;

const SPARK_ELEMENT_WIDTH = 30;
const DISTANCE = 40;

const RANDOMNESS_ON = true;

function createTransformSteps(...steps: string[]): string[] {
  if (steps.length === 0) {
    throw new Error('arguments to createTransformSteps should never be empty!');
  }

  const inputSteps = [...steps];
  const outputSteps: string[] = [inputSteps.shift()!];
  inputSteps.forEach((step, i) => {
    outputSteps.push(`${outputSteps[i]} ${step}`);
  });

  return outputSteps;
}

const dynamicAnimation = (name: string, rotation: number): void => {
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet);
  }

  const randomDist = RANDOMNESS_ON
    ? Math.floor((Math.random() - 0.5) * DISTANCE * 0.7)
    : 0;

  const [s1, s2, s3] = createTransformSteps(
    `translate(-50%, -50%) rotate(${rotation}deg) translate(1px, 0px)`,
    `translate(${DISTANCE + randomDist}px, 0px) scale(0.1, 0.1)`,
    `translate(${SPARK_ELEMENT_WIDTH / 2}px, 0) scale(0, 0)`,
  );

  styleSheet.sheet?.insertRule(
    `@keyframes ${name} {
      0% { transform: ${s1}; }
      70% { transform: ${s2}; }
      100% { transform: ${s3}; }
    }`,
    styleSheet.sheet.cssRules.length,
  );
};

export const makeBurst = (
  center: { x: number; y: number },
  color: string = 'white',
): void => {
  for (let i = 0; i < 8; i++) {
    const randomSpace = RANDOMNESS_ON
      ? Math.floor(-17 + Math.random() * 34)
      : 0;
    makeSpark(center, 45 * i + randomSpace, color);
  }
};

const makeSpark = (
  center: { x: number; y: number },
  rotation: number,
  color: string,
): void => {
  const div = document.createElement('div');
  const aniName = `disappear_${rotation}_${Date.now()}`;
  dynamicAnimation(aniName, rotation);

  div.classList.add('spark');
  div.style.left = `${center.x}px`;
  div.style.top = `${center.y}px`;
  div.style.backgroundColor = `var(${color})`; // 👈 set dynamic color
  div.style.animation = `${aniName} 500ms ease-out both`;
  document.body.append(div);
  setTimeout(() => {
    document.body.removeChild(div);
  }, 1000);
};
