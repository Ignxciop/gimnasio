import React, { useRef, useEffect } from "react";

interface VideoThumbnailProps {
    src: string;
    className?: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
    src,
    className,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            video.currentTime = 0.1;
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            src={src}
            className={className}
            preload="metadata"
            muted
            playsInline
        />
    );
};
