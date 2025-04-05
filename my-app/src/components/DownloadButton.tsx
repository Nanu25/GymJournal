// my-app/src/components/DownloadButton.tsx
import React, { useState } from "react";

interface DownloadButtonProps {
    fileName: string;
    buttonText?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
                                                           fileName,
                                                           buttonText = "Download Video"
                                                       }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);

            // Create a direct download link to the file
            const downloadUrl = `/api/download/${encodeURIComponent(fileName)}`;

            // Create an anchor element and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download video. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
            {isDownloading ? "Downloading..." : buttonText}
        </button>
    );
};

export default DownloadButton;