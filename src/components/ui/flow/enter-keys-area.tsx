import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../input';
import { Button } from '../button';
import { Label } from '../label';
import { updateFlowKeys } from '@/_backend/private/projects/updateFlowKeys';
import { useFlow } from '@/context/flow-context';
import { toast } from 'sonner';

export type APIData = Record<string, string>;
export type RequiredKeysType = Record<string, boolean>;

interface ISideDrawer {
  open: boolean;
  onClose: () => void;
  apiDataFields: RequiredKeysType;
  onKeysSaved: (data: APIData) => void;
}

export default function EnterKeys({
  open,
  onClose,
  apiDataFields,
  onKeysSaved,
}: ISideDrawer) {
  const { slug, apiKeys, setAPIKeys } = useFlow();
  const [isOpen, setIsOpen] = useState(open);
  const [APIKeyValues, setAPIKeyValues] = useState<APIData>(apiKeys);
  const [errors, setError] = useState<APIData>({});
  const [updating, setUpdating] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string>();
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onCloseHandler = () => {
    onClose();
    setIsOpen(false);
  };

  const validateRequiredKeys = () => {
    let fieldCounter = 0;
    const newErrors = { ...errors };
    for (let i = 0; i < Object.keys(apiDataFields).length; i++) {
      const key = Object.keys(apiDataFields)[i];
      const found = Object.keys(APIKeyValues).find(
        apiKeyLabel => apiKeyLabel === key,
      );
      if (found) {
        fieldCounter++;
        delete newErrors[key];
      } else {
        newErrors[key] = `${key} key is required.`;
      }
    }
    setError(newErrors);
    return fieldCounter === Object.keys(apiDataFields).length;
  };

  const onSaveHandler = async (keys: APIData) => {
    if (!validateRequiredKeys()) return;
    setUpdating(true);
    try {
      const response = await updateFlowKeys({
        apiKeys: JSON.stringify(keys),
        flow_id: slug,
      });
      toast(response?.message);
      if (response?.isSuccess) {
        onKeysSaved(keys);
        setAPIKeys(keys);
      }
    } catch (error) {
      toast(`FAILED: ${error}`);
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
    <div
      className={`fixed top-0 right-0 h-full w-[300px] bg-zinc-800 shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold bg-gradient-to-tl from-blue-400 to-blue-500 bg-clip-text text-transparent">
          Enter Required Keys
        </h2>
        <button
          onClick={onCloseHandler}
          className="text-zinc-200 hover:text-zinc-100 bg-gradient-to-br from-red-500 to-indigo-800 p-2 rounded-full">
          <X />
        </button>
      </div>
      <div className="h-[0.5px] bg-gradient-to-r from-blue-400 to-blue-500" />
      <p>Delete keys</p>
      {Object.keys(apiKeys).map(key => {
        return (
          <Button
            onClick={() => deleteKeyHandler(key)}
            key={key}
            disabled={!!deletingKey}>
            {deletingKey === key ? 'Deleting ' : ''}
            {key}
          </Button>
        );
      })}

      <p>Edit keys</p>
      {Object.keys(apiDataFields).map(key => {
        return (
          <div key={key}>
            <Label>ENter Key {key}</Label>
            <Input
              type="password"
              placeholder={key}
              value={APIKeyValues[key] ?? ''}
              onChange={e => {
                setAPIKeyValues({
                  ...APIKeyValues,
                  [key]: e.target.value,
                });
              }}
            />
            <p className="text-red-700">{errors[key] || ''}</p>
          </div>
        );
      })}
      <Button onClick={() => onSaveHandler(APIKeyValues)} disabled={updating}>
        {updating ? 'Saving' : 'Save'} Keys
      </Button>
    </div>
  );
}
