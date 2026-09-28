'use client';

import { useRef, useState } from 'react';
import { FileText, X, Loader2, Upload } from 'lucide-react';

export default function PdfUploader({ value, onChange, label }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm">
          <FileText className="w-4 h-4 text-brand shrink-0" />
          <a href={value} target="_blank" rel="noopener" className="text-brand truncate flex-1 hover:underline">{value.split('/').pop()}</a>
          <button type="button" onClick={() => onChange('')} aria-label={`Remove ${label}`}>
            <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border border-dashed border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 hover:border-brand hover:text-brand transition-colors disabled:opacity-60 w-full"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload {label}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
