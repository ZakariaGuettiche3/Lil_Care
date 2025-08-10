import React from 'react';
import { FileText, Image, Video, Music, File } from 'lucide-react'; // Icons for different file types

type FileProps = {
    files: { url: string; type: string; name: string; size: number }[] | null;
};

const FileComponent = ({ files }: FileProps) => {
    const getFileIcon = (type: string) => {

        return <File />;
    };

    const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    return (
        <>
        {(files !== null) && <div className="file-list">
            {files?.map((file, index) => (
                file.type === ("jpg" || "jpeg" || "png" || "gif" || "webp") ? <img key={index} src={file.url} alt="" className="max-w-full h-auto rounded-lg mb-2" /> :
                    <div key={index} className="file-item flex items-center gap-4 p-2 border-b">
                        <div className="file-icon">
                            {getFileIcon(file.type)}
                        </div>
                        <div className="file-details flex-1">
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-name text-sm text-blue-500 underline">
                                {file.name}
                            </a>
                            <div className="file-type text-gray-500 text-sm">{file.type}</div>
                            <div className="file-size text-gray-500 text-sm">{formatFileSize(file.size)}</div>
                        </div>
                    </div>
            ))}
        </div> }
        </>

    );
};

export default FileComponent;
