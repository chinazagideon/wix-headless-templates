'use client';
import { useState } from 'react';

type Candidate = {
  name?: string;
  formatted_address?: string;
  place_id?: string;
};

export default function PlaceIdFinderPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const url = new URL('/api/google-place-search', window.location.origin);
      url.searchParams.set('q', q);
      const res = await fetch(url.toString(), { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setError(data?.error || `HTTP ${res.status}`);
      } else {
        setResults(data?.results || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch {}
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <br />
        <br />

        <br />
        <br />

        <br />

        <h1 className="text-2xl font-semibold mb-4 text-black">
          Find Google Place ID
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Search your business name and address. Select a result and copy its
          Place ID.
        </p>

        <form onSubmit={onSearch} className="flex gap-2 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. IcanMovers, Winnipeg"
            className="flex-1 rounded border px-3 py-2 text-black"
          />
          <button
            type="submit"
            disabled={loading || !q.trim()}
            className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <ul className="space-y-3">
          {results.map((r, i) => (
            <li key={i} className="rounded border p-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{r.name || 'Unnamed place'}</p>
                  <p className="text-sm text-gray-600">{r.formatted_address}</p>
                  {r.place_id && (
                    <code className="mt-1 block text-xs text-gray-700 break-all">
                      {r.place_id}
                    </code>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copy(r.place_id)}
                    className="rounded bg-gray-900 text-white px-3 py-2"
                  >
                    Copy ID
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
