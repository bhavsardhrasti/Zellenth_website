'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { CheckboxInput } from '@/components/ui/inputs/CheckboxInput';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { apiFetch } from '@/lib/api/client';

interface LaminateRecord {
  _id: string;
  name: string;
  code: string;
}

interface DoorExclusionsEditorProps {
  doorId: string;
}

export function DoorExclusionsEditor({ doorId }: DoorExclusionsEditorProps) {
  const [laminates, setLaminates] = useState<LaminateRecord[]>([]);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [initialExcludedIds, setInitialExcludedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<{ items: LaminateRecord[] }>('/api/laminates?limit=100'),
      apiFetch<{ excludedLaminateIds: string[] }>(`/api/doors/${doorId}`),
    ])
      .then(([laminatesResponse, doorResponse]) => {
        if (laminatesResponse.success) setLaminates(laminatesResponse.data?.items ?? []);
        if (doorResponse.success && doorResponse.data) {
          const ids = new Set(doorResponse.data.excludedLaminateIds);
          setExcludedIds(ids);
          setInitialExcludedIds(ids);
        }
      })
      .finally(() => setIsLoading(false));
  }, [doorId]);

  const hasChanges = useMemo(() => {
    if (excludedIds.size !== initialExcludedIds.size) return true;
    for (const id of excludedIds) {
      if (!initialExcludedIds.has(id)) return true;
    }
    return false;
  }, [excludedIds, initialExcludedIds]);

  const filteredLaminates = useMemo(() => {
    if (!search.trim()) return laminates;
    const term = search.trim().toLowerCase();
    return laminates.filter(
      (laminate) =>
        laminate.name.toLowerCase().includes(term) || laminate.code.toLowerCase().includes(term),
    );
  }, [laminates, search]);

  function toggle(id: string) {
    setExcludedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    const response = await apiFetch(`/api/doors/${doorId}/exclusions`, {
      method: 'PATCH',
      body: JSON.stringify({ excludedLaminateIds: Array.from(excludedIds) }),
    });

    setIsSaving(false);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setInitialExcludedIds(new Set(excludedIds));
    toast.success('Exclusions updated');
  }

  return (
    <div className="bg-surface shadow-card rounded-md flex max-w-2xl flex-col gap-4 p-6">
      <div>
        <h2 className="font-display text-h2 text-text-primary">Laminate Exclusions</h2>
        <p className="text-body-sm text-text-secondary mt-1">
          By default every active laminate is compatible with this door. Check any laminate that
          should be excluded.
        </p>
      </div>

      {isLoading ? (
        <p className="text-body-sm text-text-secondary">Loading laminates...</p>
      ) : (
        <>
          <TextInput
            icon={Search}
            placeholder="Search laminates"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            wrapperClassName="max-w-xs"
          />
          <div className="border-border max-h-72 overflow-y-auto rounded-sm border">
            {filteredLaminates.map((laminate) => (
              <div key={laminate._id} className="border-border border-b px-3 py-2 last:border-b-0">
                <CheckboxInput
                  label={`${laminate.name} (${laminate.code})`}
                  checked={excludedIds.has(laminate._id)}
                  onChange={() => toggle(laminate._id)}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-body-sm text-error-text">{error}</p>}

          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaving || !hasChanges}
            className="w-fit"
          >
            Save exclusions
          </Button>
        </>
      )}
    </div>
  );
}
