"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

type Article = {
  id: number;
  headline: string;
  source: string;
  url: string;
  datetime: number;
  summary: string;
  image: string;
};

export function NewsList({ symbol }: { symbol: string }) {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/news/${symbol}`)
      .then((r) => r.json())
      .then((d) => !cancelled && setNews(d.news || []))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [symbol]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 dark:border-[var(--border)] dark:bg-[var(--surface)]">
      <h3 className="text-base font-semibold">Latest News</h3>

      {loading ? (
        <p className="mt-4 text-sm text-[var(--text-subtle)]">Loading…</p>
      ) : news.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--text-subtle)]">No recent news for this symbol.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {news.map((a) => (
            <li key={a.id}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 rounded-xl p-2 hover:bg-[var(--surface-hover)] dark:hover:bg-[var(--surface-hover)]"
              >
                {a.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.image}
                    alt=""
                    className="h-16 w-24 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium leading-snug">
                    {a.headline}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
                    {a.summary}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-[var(--text-subtle)]">
                    <span>{a.source}</span>
                    <span>·</span>
                    <span>{new Date(a.datetime * 1000).toLocaleDateString()}</span>
                    <ExternalLink size={10} />
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
