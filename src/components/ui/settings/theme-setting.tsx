import { Typography } from '../typography';

export default function ThemeSettings() {
  return (
    <div className="pr-4 pt-2 flex gap-6 flex-col">
      <div className="dark:bg-c-on-primary/10 bg-c-on-primary/80 rounded-xl p-4">
        <Typography variant={'h2'} className="font-semibold text-c-primary">
          Theme
        </Typography>
      </div>
      <div className="dark:bg-zinc-800 bg-zinc-200 rounded-xl p-4"></div>
    </div>
  );
}
