'use client';
import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Input } from '../input';
import { Button } from '../button';
import { updateFlowKeys } from '@/_backend/private/projects/updateFlowKeys';
import { useFlow } from '@/context/flow-context';

import { Typography } from '../typography';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { showToast } from '../toast';

export type APIData = Record<string, string>;
export type RequiredKeysType = Record<string, boolean>;

interface ISideDrawer {
  onClose: () => void;
  apiDataFields: RequiredKeysType;
  onKeysSaved: (data: APIData) => void;
}

const getDefaultValues = (
  apiDataFields: RequiredKeysType,

  defaultData: Record<string, string>,
) => {
  const defaultValues: Record<string, string> = {};
  Object.entries(apiDataFields).forEach(([key]) => {
    defaultValues[key] = defaultData[key] || '';
  });

  return defaultValues;
};

export default function EnterKeys({
  onClose,
  apiDataFields,
  onKeysSaved,
}: ISideDrawer) {
  const [requiredAPIInputKeys, setRequiredAPIInputKeys] =
    useState<RequiredKeysType>(apiDataFields);

  const fieldSchema = Object.entries(apiDataFields).reduce((acc, [key]) => {
    acc[key] = z.string().min(2, {
      message: `Please enter valid ${key} key`,
    });
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);

  // Final Zod object schema
  const FormSchema = z.object(fieldSchema);
  const { slug, apiKeys, setAPIKeys, setShowKeyInputArea } = useFlow();

  useEffect(() => {
    if (
      Object.keys(apiDataFields).length === 0 &&
      Object.keys(apiKeys).length > 0
    ) {
      // use must coming from setting
      const newObject: RequiredKeysType = {};
      Object.keys(apiKeys).map(key => {
        newObject[key] = true;
      });
      setRequiredAPIInputKeys(newObject);
    } else {
      setRequiredAPIInputKeys(apiDataFields);
    }
  }, [apiDataFields, apiKeys]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: getDefaultValues(requiredAPIInputKeys, apiKeys),
    defaultValues: getDefaultValues(requiredAPIInputKeys, apiKeys),
  });

  const [APIKeyValues, setAPIKeyValues] = useState<APIData>(apiKeys);
  const [errors, setError] = useState<APIData>({});
  const [updating, setUpdating] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string>();

  const onCloseHandler = () => {
    onClose();
  };

  const validateRequiredKeys = () => {
    let fieldCounter = 0;
    const formValues = form.getValues();
    const newErrors = { ...errors };

    for (let i = 0; i < Object.keys(formValues).length; i++) {
      const key = Object.keys(formValues)[i];
      const hasValue = !!formValues[key];
      if (hasValue) {
        fieldCounter++;
        delete newErrors[key];
      } else {
        newErrors[key] = `${key} key is required.`;
      }
    }
    setError(newErrors);
    return fieldCounter === Object.keys(formValues).length;
  };

  const onSaveHandler = async (keys: APIData) => {
    if (!validateRequiredKeys()) return;
    form.getValues();
    setUpdating(true);
    try {
      const response = await updateFlowKeys({
        apiKeys: JSON.stringify(keys),
        flow_id: slug,
      });
      if (response?.isSuccess) {
        showToast({ description: response.message, type: 'success' });

        onKeysSaved(keys);
        setAPIKeys(keys);
      } else {
        showToast({
          description: 'Failed to update keys. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      showToast({ description: `FAILED: ${error}`, type: 'error' });
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };
  const deleteKeyHandler = async (key: string) => {
    setDeletingKey(key);
    const newKeys = { ...APIKeyValues };
    delete newKeys[key];
    await onSaveHandler(newKeys);
    setAPIKeyValues(newKeys);
    setDeletingKey('');
  };
  return (
    <div className={'p-4 w-2xl'}>
      <div className="py-2 flex justify-between items-center">
        <Typography className="font-semibold" variant={'h2'}>
          Manage Keys
        </Typography>
        <Button onClick={onCloseHandler} size={'icon'}>
          <X />
        </Button>
      </div>
      {!!Object.keys(apiKeys).length && (
        <div className="mb-4 flex flex-col gap-2">
          <Typography variant={'h4'}>Delete keys</Typography>
          <div className="flex flex-row gap-2">
            {Object.keys(apiKeys).map(key => {
              return (
                <Button
                  type="button"
                  className="capitalize"
                  onClick={e => {
                    e.preventDefault();
                    deleteKeyHandler(key);
                  }}
                  key={key}
                  variant={'outline_destructive'}
                  disabled={!!deletingKey}>
                  {deletingKey === key ? 'Deleting ' : ''}
                  {key} <X />
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {Object.keys(requiredAPIInputKeys).length > 0 ? (
        <>
          <Typography variant={'h4'}>Add keys</Typography>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {
                onSaveHandler(form.getValues()).finally(() => {
                  setShowKeyInputArea(false);
                });
              })}
              className="w-full space-y-6 py-4">
              {Object.keys(requiredAPIInputKeys).map(key => {
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel className="capitalize">{key}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter key here..."
                              {...field}
                              defaultValue={field.value || ''}
                              type="password"
                            />
                          </FormControl>
                          <FormMessage>{errors[key]}</FormMessage>
                        </FormItem>
                      );
                    }}
                  />
                );
              })}

              <div className="flex flex-row gap-2">
                <Button
                  onClick={e => {
                    e.preventDefault();
                    form.reset();
                    onCloseHandler();
                  }}
                  variant={'outline_destructive'}>
                  Close
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="animate-spin" />}
                  Submit
                </Button>
              </div>
            </form>
          </Form>
          <Typography variant={'blockquote'} className="text-lg">
            &quot;Privacy is a myth — and so is security. But still, all we can
            really do today is trust... and press Submit.&quot;
            <br />
            <span className="font-bold">-Sam Chandraberg</span>
          </Typography>
        </>
      ) : (
        <>
          <Typography variant={'p'} className="text-xl italic text-c-secondary">
            No keys needed for this flow, you&squot;re all set for now!
          </Typography>
          <Typography variant={'blockquote'} className="text-lg">
            &quot;Sometimes, the most powerful tools need no keys.
            <br />
            Just intention... and a click.&quot;
            <br />
            <span className="font-bold">- Flow Engine</span>
          </Typography>
        </>
      )}
    </div>
  );
}
