'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect } from 'react';
import getProject from '@/_backend/private/projects/getProject';
import { editProject } from '@/_backend/private/projects/editProject';

const FormSchema = z.object({
  name: z.string().min(3, {
    message: 'name length should be 3 characters.',
  }),
  description: z.string(),
});

export default function EditFlow({ slug }: { slug: string }) {
  useEffect(() => {
    const getSlug = async () => {
      getProject(slug)
        .then(res => {
          if (res?.isSuccess && res.data?.length) {
            form.setValue('name', res.data[0].name);
            form.setValue('description', res.data[0].description || '');
          } else {
            toast(res?.message);
          }
        })
        .catch(er => {
          toast(er);
        });
      // form.setValue()
    };
    getSlug();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await editProject({
      description: data.description || '',
      name: data.name,
      id: slug,
    });
    if (response?.data) {
      redirect('/flow/' + slug);
    } else {
      toast(response?.message || response?.error || 'Update app failed');
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flow Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>This will be name of your App.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Edit</Button>
      </form>
    </Form>
  );
}
