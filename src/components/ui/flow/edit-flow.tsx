'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import getProject from '@/_backend/private/projects/getProject';
import { editProject } from '@/_backend/private/projects/editProject';
import { useFlow } from '@/context/flow-context';
import { showToast } from '../toast';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  name: z.string().min(4, {
    message: 'name length should be 4 characters.',
  }),
  description: z.string(),
});

export default function EditFlow() {
  const { slug, setShowEditDrawer, setFlowName } = useFlow();
  const [loadingData, setLoadingData] = useState(true);
  const [editingData, setEditingData] = useState(false);
  useEffect(() => {
    const getSlug = async () => {
      getProject(slug)
        .then(res => {
          if (res?.isSuccess && res.data?.length) {
            form.setValue('name', res.data[0].name);
            form.setValue('description', res.data[0].description || '');
          } else {
            showToast({ description: res?.message, type: 'error' });
          }
        })
        .catch(er => {
          showToast({ description: er, type: 'error' });
        })
        .finally(() => setLoadingData(false));
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
    setEditingData(true);
    try {
      const response = await editProject({
        description: data.description || '',
        name: data.name,
        id: slug,
      });
      if (response?.data) {
        setFlowName(data.name);
        setShowEditDrawer(false);
        showToast({
          description: response?.message,
          type: 'success',
        });
      } else {
        showToast({
          title: 'Failed',
          description:
            response?.message || response?.error || 'Update app failed',
          type: 'error',
        });
      }
    } catch (error) {
      showToast({
        title: 'Failed',
        description: `Error: ${error}`,
        type: 'error',
      });
    } finally {
      setEditingData(false);
    }
  }
  return (
    <div className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flow Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be name of your flow.
                </FormDescription>
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
          <div className="flex flex-row gap-2">
            <Button
              disabled={editingData}
              onClick={e => {
                e.preventDefault();
                form.reset();
                setShowEditDrawer(false);
              }}
              variant={'outline_secondary'}>
              Close
            </Button>
            <Button
              variant={'secondary'}
              disabled={editingData || loadingData}
              type="submit">
              {editingData && <Loader2 className="animate-spin" />}Edit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
