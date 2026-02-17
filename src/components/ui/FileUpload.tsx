import { useState, useRef } from 'react';
import { Upload, X, Loader2, File, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    label: string;
    accept?: string;
    value?: string;
    type?: 'image' | 'video' | 'any';
    bucket?: string;
}

export default function FileUpload({ onUploadComplete, label, accept, value, type = 'any', bucket = 'uploads' }: FileUploadProps) {
    const { uploadFile } = useStore();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        // Generate a clean filename: timestamp-name
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const path = `${type}s/${Date.now()}_${cleanName}`;

        const { publicUrl, error: uploadError } = await uploadFile(bucket, path, file);

        if (uploadError) {
            setError(uploadError);
            setIsUploading(false);
        } else if (publicUrl) {
            onUploadComplete(publicUrl);
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white/50">{label}</label>

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden
                    ${value ? 'border-green-500/20 bg-green-500/5' : 'border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.04]'}
                    ${isUploading ? 'pointer-events-none' : ''}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    className="hidden"
                />

                <div className="p-6 flex flex-col items-center justify-center text-center">
                    {isUploading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                            <p className="text-sm text-white/60 font-medium">Uploading your file...</p>
                        </>
                    ) : value ? (
                        <>
                            {type === 'image' && (
                                <div className="mb-4 relative group/img">
                                    <img src={value} alt="Preview" className="h-32 w-auto rounded-xl object-cover shadow-2xl border border-white/10" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            )}
                            {type === 'video' && (
                                <div className="mb-4 p-4 bg-white/5 rounded-xl flex items-center gap-3">
                                    <File className="w-6 h-6 text-blue-400" />
                                    <div className="text-left">
                                        <p className="text-xs text-white/80 font-medium truncate max-w-[200px]">Video Linked</p>
                                        <p className="text-[10px] text-white/20 truncate max-w-[200px]">{value}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" />
                                Change File
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-white/20 group-hover:text-purple-400 transition-colors" />
                            </div>
                            <p className="text-sm text-white/60 font-medium">Click to upload or drag and drop</p>
                            <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest font-bold">
                                {type === 'image' ? 'PNG, JPG up to 5MB' : 'MP4, MOV up to 100MB'}
                            </p>
                        </>
                    )}
                </div>

                {value && !isUploading && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onUploadComplete('');
                        }}
                        className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all z-10"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20">{error}</p>
            )}
        </div>
    );
}
