"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Camera, RefreshCw, AlertCircle, Link as LinkIcon, Check } from "lucide-react";

interface ImageUploadSelectorProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspect?: "wide" | "square" | "standard";
  placeholderText?: string;
}

export function ImageUploadSelector({
  value,
  onChange,
  label,
  hint,
  aspect = "wide",
  placeholderText = "Click to browse or drop an image here",
}: ImageUploadSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
      setManualUrl(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
      setManualUrl(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const aspectClass =
    aspect === "square"
      ? "aspect-square max-h-48"
      : aspect === "standard"
      ? "aspect-4/3 max-h-56"
      : "aspect-16/9 max-h-60";

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">{label}</label>
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-normal cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showManualUrl ? "Upload File" : "Paste URL / Path"}</span>
          </button>
        </div>
      )}

      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}

      {errorMessage && (
        <div className="p-2.5 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Manual URL Input mode */}
      {showManualUrl ? (
        <div className="flex gap-2 items-center bg-[#FAFBFD] p-2 border border-slate-200 rounded-lg">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="e.g. /images/shared/product-screens/stock-list.png or /uploads/..."
            className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-600"
          />
          <button
            type="button"
            onClick={() => {
              onChange(manualUrl);
              setShowManualUrl(false);
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            <span>Apply</span>
          </button>
        </div>
      ) : value ? (
        /* Image Preview Box */
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900/5 relative group">
          <div className={`w-full ${aspectClass} relative flex items-center justify-center bg-slate-100 overflow-hidden`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Selected asset"
              className="w-full h-full object-contain"
              onError={(e) => {
                // If relative path fails to render on admin, try prepending website origin if needed
                console.warn("Image preview failed to load:", value);
              }}
            />

            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setManualUrl("");
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-600 truncate max-w-xs">{value}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone / Selector */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#FAFBFD] hover:bg-blue-50/20 ${aspectClass} flex flex-col items-center justify-center`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Uploading image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  {placeholderText}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  PNG, JPG, WebP, or SVG up to 10MB
                </span>
              </div>
              <button
                type="button"
                className="mt-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors pointer-events-none shadow-2xs"
              >
                Select File
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
