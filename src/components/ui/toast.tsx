import { cn } from '@/lib/utils';
import { toast as sonnerToast } from 'sonner';
import { Button } from './button';

interface ToastProps {
  id: string | number;
  title?: string;
  description?: string;
  button?: {
    label: string;
    onClick: () => void;
  };
  type?: 'success' | 'error';
}

function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div
      className={cn(
        'flex rounded-lg bg-gradient-to-br shadow-lg  w-full md:max-w-[364px] items-center p-4',
        props.type == 'success'
          ? 'from-c-secondary to-c-secondary-variant'
          : 'from-red-400 to-red-500',
      )}>
      <div className="flex flex-1 items-center">
        <div className="w-full">
          {!!title && (
            <p className="text-md font-semibold text-white">{title}</p>
          )}
          {!!description && (
            <p className="mt-1 text-sm text-white">{description}</p>
          )}
        </div>
      </div>
      {!!button?.onClick && (
        <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
          <Button
            variant={'default'}
            className={cn(
              props.type == 'success'
                ? ' bg-c-surface text-c-secondary'
                : ' bg-c-surface text-red-500 dark:text-red-400',
            )}
            onClick={() => {
              button.onClick();
              sonnerToast.dismiss(id);
            }}>
            {button.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export const showToast = ({
  type = 'success',
  button,
  description,
  title,
}: Omit<ToastProps, 'id'>) => {
  return sonnerToast.custom(id => (
    <Toast
      id={id}
      type={type}
      title={title}
      description={description}
      button={
        button
          ? {
              label: button.label,
              onClick: () => console.log('Button clicked'),
            }
          : undefined
      }
    />
  ));
};
