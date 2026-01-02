import React, { useRef, useEffect, useState } from "react";

interface VideoThumbnailProps {
    src: string;
    className?: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
    src,
    className,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        setIsLoaded(false);
        setHasError(false);

        const handleLoadedMetadata = () => {
            video.currentTime = 0.1;
        };

        const handleLoadedData = () => {
            setIsLoaded(true);
        };

        const handleError = () => {
            setHasError(true);
            setIsLoaded(false);
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("error", handleError);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("error", handleError);
        };
    }, [src]);

    if (hasError) {
        return (
            <div
                className={className}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-secondary)",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                }}
            >
                Error al cargar video
            </div>
        );
    }

    return (
        <>
            {!isLoaded && (
                <div
                    className={className}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--bg-secondary)",
                        color: "var(--text-muted)",
                        fontSize: "12px",
                    }}
                >
                    Cargando...
                </div>
            )}
            <video
                ref={videoRef}
                src={src}
                className={className}
                preload="metadata"
                muted
                playsInline
                style={{ display: isLoaded ? "block" : "none" }}
            />
        </>
    );
};
