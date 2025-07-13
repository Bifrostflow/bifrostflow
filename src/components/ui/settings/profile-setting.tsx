'use client';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';
import { Input } from '../input';
import { Typography } from '../typography';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useClerk } from '@clerk/nextjs';
import { Button } from '../button';

export const ClerkProfileSchema = z.object({
  first_name: z.string().min(4, {
    message: 'First name must be at least 4 characters.',
  }),
  last_name: z.string().min(4, {
    message: 'Last name must be at least 4 characters.',
  }),
  username: z.string().min(4, {
    message: 'Username must be at least 4 characters.',
  }),
});

export default function ProfileSettings() {
  const { user } = useClerk();
  console.log(user?.firstName, user?.lastName, user?.username);

  const form = useForm<z.infer<typeof ClerkProfileSchema>>({
    resolver: zodResolver(ClerkProfileSchema),
    values: {
      first_name: user?.firstName || '',
      last_name: user?.lastName || '',
      username: user?.username || '',
    },
  });
  return (
    <div className="pr-4 pt-2 flex gap-6 flex-col">
      <div className="dark:bg-neutral-700 bg-c-on-primary/80 rounded-xl p-4">
        <Typography variant={'h2'} className="font-semibold text-c-primary">
          Profile
        </Typography>
      </div>
      <div className="dark:bg-neutral-700 bg-zinc-200 rounded-xl p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(values => {
              console.log(values);
            })}
            className="w-[400px] space-y-6 p-6 rounded-lg">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Kratos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="gow_kratos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-2">
              <Button type="submit" variant={'secondary'}>
                Submit
              </Button>
              <Button
                onClick={e => {
                  e.preventDefault();
                  form.reset();
                }}
                variant={'outline_secondary'}>
                Close
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
