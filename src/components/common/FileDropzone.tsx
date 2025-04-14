"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { Upload, CheckCircle, AlertCircle } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  maxSizeMB?: number;
  acceptExt?: string[];
  errorMessage?: string | null;
}

export default function FileDropzone({
  onFileSelect,
  selectedFile,
  maxSizeMB = 100,
  acceptExt = [".h5"],
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const MAX_FILE_SIZE = maxSizeMB * 1024 * 1024;

  const simulateUpload = () => {
    setUploading(true);
    setUploaded(false);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const reset = () => {
    setError(null);
    setUploadProgress(0);
    setUploading(false);
    setUploaded(false);
    onFileSelect(null);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "application/octet-stream": acceptExt,
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError("檔案格式錯誤或大小超過 100MB");
        reset();
        return;
      }

      const file = acceptedFiles[0];

      const isValidFormat = acceptExt.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isValidFormat) {
        setError(`檔案格式錯誤，僅接受 ${acceptExt.join(", ")}`);
        reset();
        return;
      }

      setError(null);
      onFileSelect(file);
      simulateUpload();
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        {...getRootProps({
          className:
            "w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition",
        })}
      >
        <input {...getInputProps()} />

        {/* 🔄 正在上傳 */}
        {uploading && (
          <>
            <p className="text-muted-foreground">正在上傳模型檔案...</p>
            <Progress value={uploadProgress} className="mt-4" />
          </>
        )}

        {/* ✅ 上傳完成 */}
        {uploaded && selectedFile && (
          <div className="space-y-1">
            <p className="text-green-600 font-medium flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" /> 上傳成功：{selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              大小：{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="mt-2"
            >
              重新選擇檔案
            </Button>
          </div>
        )}

        {/* ⛔ 錯誤 */}
        {error && (
          <p className="text-red-500 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        )}

        {/* ☁️ 預設畫面 */}
        {!uploading && !uploaded && !error && (
          <>
            <p className="text-muted-foreground">
              拖曳模型檔案到這裡，或點擊選擇檔案（支援 .h5 格式）
            </p>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="mt-3 px-4 py-2 text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              選擇檔案
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
