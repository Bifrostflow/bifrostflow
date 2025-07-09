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
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography } from '@/components/ui/typography';
import { showToast } from '@/components/ui/toast';
import Drawer, { DrawerPositionType } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Loader2Icon, Settings } from 'lucide-react';
import { Label } from '@/components/ui/label';

import { motion } from 'framer-motion';
import HomeNav from '@/components/ui/home/home-nav';

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
  const [showDrawer, setShowDrawer] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [drawerPosition, setDrawerPosition] = useState<
    DrawerPositionType | undefined
  >();
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div className="bg-c-secondary">
      <HomeNav onShowMore={() => setShowMore(!showMore)} />
      <Drawer
        width={'w-[250px]'}
        height={'h-[230px]'}
        visible={showMore}
        position="right"
        className="top-[110px] left-auto right-[10px] sm:top-[60px] sm:left-auto sm:right-[10px]"
        onClose={setShowMore}>
        <div className="flex flex-row flex-wrap gap-3 justify-between items-center">
          {[1, 2, 3, 4, 5, 6, 7].map(res => {
            return (
              <motion.div
                key={res}
                className="flex flex-col justify-center items-center my-2 gap-1">
                <Settings />
                <Label>Settings</Label>
              </motion.div>
            );
          })}
        </div>
      </Drawer>
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
        <div className="flex gap-2">
          <Button
            type="submit"
            variant={'secondary'}
            onClick={() => setLoading(!loading)}>
            {loading && <Loader2Icon className="animate-spin" />}
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
              so it&apos;s only fair that they should pay for the
              privilege.&quot;
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
        <div className="gap-2 flex text-c-background-text">
          <Button
            onClick={() => {
              setShowDrawer(true);
              setDrawerPosition('top');
            }}
            variant={'default'}>
            Test Drawer
          </Button>
        </div>
        <div className="gap-2 flex ">
          <Badge variant={'secondary'}>Test</Badge>
          <Badge variant={'outline'}>Test</Badge>
          <Badge variant={'destructive'}>Test</Badge>
          <Badge>Twitter</Badge>
          <br />
          <Badge variant={'secondary_outline'}>Test</Badge>
          <Badge variant={'outline_2'}>Test</Badge>
          <Badge variant={'destructive_outline'}>Test</Badge>
          <Badge variant={'primary_outline'}>Twitter</Badge>
        </div>

        <Drawer
          onClose={async visible => {
            setShowDrawer(visible);
          }}
          height="h-[100vh] w-[30%]"
          position={'left'}
          visible={showDrawer}>
          <Typography variant={'h1'}>Title</Typography>
          <div className="flex flex-col justify-start items-start">
            <Typography variant={'h2'}>Heading</Typography>
            <Typography variant={'h3'}>Heading 2</Typography>
            <Typography variant={'h4'}>Heading 3</Typography>
            <Typography className="text-start" variant={'p'}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit
              magnam reprehenderit quod temporibus hic Lorem ipsum, dolor sit
              amet consectetur adipisicing elit. Suscipit magnam reprehenderit
              quod temporibus hic Lorem ipsum, dolor sit amet consectetur
              adipisicing elit. Suscipit magnam reprehenderit quod temporibus
              hic
            </Typography>
            <Typography variant={'blockquote'}>
              <blockquote>
                &quot;After all,&quot; he said, &quot;everyone enjoys a good
                joke, so it&apos;s only fair that they should pay for the
                privilege.&quot;
              </blockquote>
            </Typography>
            <Typography variant={'inline_code'}>
              <code>@radix-ui/react-alert-dialog</code>
            </Typography>
          </div>
        </Drawer>
      </main>
    </div>
  );
}
