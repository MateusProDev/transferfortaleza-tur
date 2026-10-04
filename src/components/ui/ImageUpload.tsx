"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  compact?: boolean;
  banner?: boolean;
}

export default function ImageUpload({ onImageUpload, currentImage, label = "Imagem", compact = false, banner = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentImage || "");
  }, [currentImage]);

  const uploadFile = async (file: File) => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setPreview(data.url);
      onImageUpload(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const handleRemove = () => {
    setPreview("");
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const previewContainerClass = banner
    ? "relative aspect-video w-full max-w-sm"
    : compact
      ? "relative h-24 w-24"
      : "relative";
  const previewImageClass = banner
    ? "h-full w-full rounded-lg border border-gray-200 bg-gray-50 object-contain p-2"
    : compact
      ? "h-24 w-24 rounded-lg border border-gray-200 bg-gray-50 object-contain p-2"
      : "h-48 w-full rounded-lg object-cover";
  const uploadContainerClass = banner
    ? "flex aspect-video w-full max-w-sm cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400"
    : compact
      ? "flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-2 text-center transition-colors hover:border-gray-400"
      : "cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400";

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      
      {preview ? (
        <div className={previewContainerClass}>
          <img
            src={preview}
            alt="Preview"
            className={previewImageClass}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={uploadContainerClass}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Fazendo upload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Clique para fazer upload ou arraste uma imagem
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPEG, PNG, WebP (máx. 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {banner && (
        <p className="text-xs text-gray-500">
          Recomendação: imagem horizontal 16:9, preferencialmente 1200 x 675 px.
        </p>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}