import React, { useState, useRef } from "react";

type UploadedVideo = {
    fileName: string;
    filePath: string;
    uploadDate: string;
};

const FileUpload = ({ onBackToDashboard }: { onBackToDashboard: () => void }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch existing videos when component mounts
    React.useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/api/videos');
                if (response.ok) {
                    const data = await response.json();
                    setUploadedVideos(data);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        fetchVideos();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);

            // Create a local preview URL
            const fileURL = URL.createObjectURL(e.target.files[0]);
            setPreviewVideo(fileURL);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('video', selectedFile);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', '/api/upload', true);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(progress);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    const newVideo: UploadedVideo = {
                        fileName: response.fileName,
                        filePath: response.filePath,
                        uploadDate: new Date().toISOString(),
                    };

                    setUploadedVideos(prev => [newVideo, ...prev]);
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
                setIsUploading(false);
            };

            xhr.onerror = () => {
                console.error("Upload failed");
                setIsUploading(false);
            };

            xhr.send(formData);
        } catch (error) {
            console.error("Error uploading video:", error);
            setIsUploading(false);
        }
    };

    const handleDownload = (fileName: string) => {
        // Create a direct link to the download endpoint
        const downloadUrl = `/api/download/${encodeURIComponent(fileName)}`;

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName); // Set the download attribute
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
    };

    const handlePreview = (filePath: string) => {
        // Set the preview video to the selected one
        setPreviewVideo(`${window.location.origin}${filePath}`);
    };

    return (
        <div
            className="min-h-screen w-full overflow-y-auto"
            style={{
                background: "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)"
            }}
        >
            <div className="container mx-auto py-8 px-4">
                <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Video Upload</h1>
                        <button
                            onClick={onBackToDashboard}
                            className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left side: Upload and preview */}
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="videoInput"
                                />
                                <label
                                    htmlFor="videoInput"
                                    className="block cursor-pointer py-6 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition"
                                >
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m36-12h-4m-8 0H12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="mt-1">Select a video file or drag and drop</p>
                                </label>
                            </div>

                            {selectedFile && (
                                <div className="bg-gray-100 p-4 rounded-md">
                                    <p className="font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>

                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className={`mt-4 w-full py-2 rounded-md text-black ${isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition`}
                                    >
                                        {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Video'}
                                    </button>
                                </div>
                            )}

                            {previewVideo && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-medium mb-2">Video Preview</h3>
                                    <video
                                        src={previewVideo}
                                        controls
                                        className="w-full rounded-md shadow-md"
                                        style={{ maxHeight: '300px' }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>

                        {/* Right side: List of uploaded videos */}
                        <div>
                            <h3 className="text-xl font-medium mb-4">Your Videos</h3>
                            {uploadedVideos.length === 0 ? (
                                <p className="text-gray-500 italic">No videos uploaded yet</p>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                    {uploadedVideos.map((video, index) => (
                                        <div key={index} className="mb-4 p-4 bg-stone-600 rounded-lg">
                                            <h3 className="text-black mb-2">{video.fileName}</h3>
                                            <div className="flex flex-wrap gap-2">

                                                <button
                                                    onClick={() => handleDownload(video.fileName)}
                                                    className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                            {/* Video player component if needed */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;