"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiClient } from "@/lib/api/client";
import {
  ExternalLink,
  Loader2,
  RefreshCw,
  Globe,
  Check,
} from "lucide-react";

interface HeroVariant {
  id: string;
  key: string;
  name: string;
  description: string | null;
  status: string;
  config: any;
  createdAt: string;
  updatedAt: string;
}

interface PublishState {
  publishedVariant: { id: string; name: string; key: string } | null;
  draftVariant: { id: string; name: string; key: string } | null;
}

interface HeroDashboardResponse {
  variants: HeroVariant[];
  publishState: PublishState | null;
}

export default function AdminHeroPage() {
  const [data, setData] = useState<HeroDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<HeroDashboardResponse>("/admin/hero");
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load hero variants");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      await apiClient.post(`/admin/hero/${id}/publish`, {});
      await fetchHeroData();
    } catch (err: any) {
      alert(err.message || "Failed to publish hero");
    } finally {
      setPublishingId(null);
    }
  };

  const publishedVariant = data?.variants.find(
    (v) => v.id === data.publishState?.publishedVariant?.id
  );
  const otherVariants =
    data?.variants.filter(
      (v) => v.id !== data.publishState?.publishedVariant?.id
    ) || [];

  return (
    <AdminShell>
      {/* Page Header */}
      <PageHeader
        title="Heroes"
        subtitle="Manage and publish the hero section design for the main landing page."
        breadcrumbs={[{ label: "Website" }, { label: "Heroes" }]}
        actions={
          <button
            onClick={fetchHeroData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-[#E5EAF2] rounded-lg shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#2563EB]" : "text-slate-400"}`} />
            <span>Sync</span>
          </button>
        }
      />

      {error ? (
        <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
          <p>{error}</p>
          <button onClick={fetchHeroData} className="font-medium underline hover:text-rose-900 cursor-pointer">
            Retry
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB] mb-2" />
          <p className="text-xs font-medium">Loading CMS configuration...</p>
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Currently Live Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Currently Live</h2>
            </div>

            {publishedVariant ? (
              <div className="bg-white rounded-xl border border-[#E5EAF2] p-6 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live on Production
                    </span>

                    <h3 className="text-xl font-semibold text-slate-900 mt-1">
                      {publishedVariant.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                      {publishedVariant.description || "Active storefront design variant."}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        Key: <strong className="font-mono font-medium text-slate-700">{publishedVariant.key}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Updated: {new Date(publishedVariant.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-5">
                      <a
                        href={process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-[#FAFBFD] hover:bg-slate-100 border border-[#E5EAF2] rounded-lg transition-colors"
                      >
                        <span>View Live Storefront</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                  </div>

                  {/* Scaled Preview Frame */}
                  <div className="hidden sm:block w-80 lg:w-96 h-48 bg-slate-50 rounded-lg border border-[#E5EAF2] overflow-hidden relative shrink-0 shadow-inner">
                    <iframe
                      src={process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"}
                      className="absolute top-0 left-0 w-[1440px] h-[900px] origin-top-left pointer-events-none"
                      style={{ transform: "scale(0.2666)" }}
                      tabIndex={-1}
                      title="Hero Live Preview"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-[#E5EAF2] rounded-xl p-8 text-center text-slate-400 text-xs">
                No hero variant is currently published.
              </div>
            )}
          </div>

          {/* Available Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Available Variants</h2>
              <span className="text-xs text-slate-500">{data.variants.length} total registered</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.variants.map((variant) => {
                const isLive = variant.id === publishedVariant?.id;
                const isPublishing = publishingId === variant.id;

                return (
                  <div
                    key={variant.id}
                    className={`bg-white rounded-xl border p-5 shadow-2xs flex flex-col justify-between transition-colors ${
                      isLive ? "border-emerald-300 ring-1 ring-emerald-200" : "border-[#E5EAF2] hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {variant.name}
                        </h4>
                        {isLive ? (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Live
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-[#FAFBFD] text-slate-500 border border-[#E5EAF2]">
                            Variant
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {variant.description || "Storefront variant configuration."}
                      </p>

                      <div className="mt-3 pt-3 border-t border-[#E5EAF2] text-[11px] text-slate-400 flex items-center justify-between font-mono">
                        <span>{variant.key}</span>
                        <span>{new Date(variant.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#E5EAF2] flex items-center justify-between">
                      <a
                        href={`http://localhost:3000/?preview_variant=${variant.key}&hero=${variant.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>

                      {isLive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <Check className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePublish(variant.id)}
                          disabled={isPublishing}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          {isPublishing ? "Publishing..." : "Publish Live"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
