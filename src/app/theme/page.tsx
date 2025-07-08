// components/HeroSection.tsx
'use client';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography } from '@/components/ui/typography';
import { showToast } from '@/components/ui/toast';

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
    },
  });
  return (
    <main className="min-h-screen p-8 bg-c-background text-c-background-text flex flex-col items-center gap-10">
      <h1 className="text-2xl font-bold">🌈 Themed UI Showcase</h1>
      <ThemeToggle />
      <Typography variant={'h1'} className="text-2xl text-c-background-text">
        Heading
      </Typography>
      <p className="text-c-background-text-muted">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi pariatur
        et libero optio adipisci amet eaque ea cum, similique eos rerum nihil
        quia necessitatibus aliquid
      </p>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-5  border-b-2 border-b-c-divider">
        {[1, 2, 3].map(card => (
          <div
            key={card}
            className="bg-c-surface text-c-surface-text rounded-sm shadow-lg p-6 w-[250px] border-c-border border-2">
            <h2 className="text-xl text-c-surface-text font-semibold mb-2">
              Card {card}
            </h2>
            <p className="text-sm text-c-surface-text-muted mb-4">
              This is a test card to show the theme in action.
            </p>
            <div className="flex gap-2">
              <Button>Primary</Button>
              <Button variant={'secondary'}>Secondary</Button>
            </div>
          </div>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="flex gap-2">
        <Button type="submit" variant={'default'}>
          Submit
        </Button>
        <Button type="submit" variant={'destructive'}>
          Submit
        </Button>
        <Button type="submit" variant={'ghost'}>
          Submit
        </Button>
        <Button type="submit" variant={'link'}>
          Submit
        </Button>
        <Button type="submit" variant={'outline'}>
          Submit
        </Button>
        <Button type="submit" variant={'outline_primary'}>
          Submit
        </Button>
        <Button type="submit" variant={'outline_secondary'}>
          Submit
        </Button>
        <Button type="submit" variant={'secondary'}>
          Submit
        </Button>
      </div>
      <div className="flex flex-col justify-start items-start">
        <Typography variant={'h1'}>Title</Typography>
        <Typography variant={'h2'}>Heading</Typography>
        <Typography variant={'h3'}>Heading 2</Typography>
        <Typography variant={'h4'}>Heading 3</Typography>
        <Typography className="text-start" variant={'p'}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit
          magnam reprehenderit quod temporibus hic Lorem ipsum, dolor sit amet
          consectetur adipisicing elit. Suscipit magnam reprehenderit quod
          temporibus hic Lorem ipsum, dolor sit amet consectetur adipisicing
          elit. Suscipit magnam reprehenderit quod temporibus hic
        </Typography>
        <Typography variant={'blockquote'}>
          <blockquote>
            &quot;After all,&quot; he said, &quot;everyone enjoys a good joke,
            so it&apos;s only fair that they should pay for the privilege.&quot;
          </blockquote>
        </Typography>
        <Typography variant={'inline_code'}>
          <code>@radix-ui/react-alert-dialog</code>
        </Typography>
      </div>
      <div className="gap-2 flex">
        <Button
          onClick={() => {
            showToast({
              type: 'error',
              button: { label: 'OK', onClick() {} },
              // title: 'Error',
              description:
                'Something went wrong!! Something went wrong!! Something went wrong!! Something went wrong!! ',
            });
          }}
          variant={'destructive'}>
          Toast Error
        </Button>
        <Button
          onClick={() => {
            showToast({
              title: 'Success',
              description: 'Generated successfully',
              button: { label: 'OK', onClick() {} },
            });
          }}
          variant={'secondary'}>
          Toast Success
        </Button>
      </div>
    </main>
  );
}
