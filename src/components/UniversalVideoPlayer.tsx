import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { WebView } from 'react-native-webview';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Colors } from '../theme';

interface UniversalVideoPlayerProps {
    url: string;
    height?: number;
    style?: any;
    shouldPlay?: boolean;
    isLooping?: boolean;
    isMuted?: boolean;
    contentFit?: 'contain' | 'cover' | 'fill';
    onEnded?: () => void;
    showControls?: boolean;
}

const DirectVideoPlayer = ({ url, shouldPlay, isLooping, isMuted, contentFit = 'contain', onEnded, showControls = true, style }: { url: string, shouldPlay?: boolean, isLooping?: boolean, isMuted?: boolean, contentFit?: 'contain' | 'cover' | 'fill', onEnded?: () => void, showControls?: boolean, style?: any }) => {
    // Expo Video hook must be outside conditional returns
    const player = useVideoPlayer(url, (videoPlayer) => {
        videoPlayer.loop = isLooping || false;
        videoPlayer.muted = isMuted || false;
        if (shouldPlay) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    });

    useEffect(() => {
        const subscription = player.addListener('playToEnd', () => {
            if (onEnded) onEnded();
        });
        return () => {
            subscription.remove();
        };
    }, [player, onEnded]);

    return (
        <VideoView
            style={[styles.playerContent, style?.backgroundColor ? { backgroundColor: style.backgroundColor } : {}]}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={showControls} // Controlado explícitamente desde las props
            contentFit={contentFit}
        />
    );
};

export default function UniversalVideoPlayer({ 
    url, 
    height = 220, 
    style, 
    shouldPlay = false, 
    isLooping = false, 
    isMuted = false,
    contentFit = 'contain',
    onEnded,
    showControls = true,
}: UniversalVideoPlayerProps) {

    // 1. Detección de YouTube
    const extractVideoID = (inputUrl: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = inputUrl.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const youtubeId = extractVideoID(url);

    if (youtubeId) {
        return (
            <View style={[styles.container, style, { height }]}>
                <YoutubeIframe 
                    height={height} 
                    play={shouldPlay} 
                    videoId={youtubeId} 
                    volume={isMuted ? 0 : 100}
                    onChangeState={(state: string) => {
                        if (state === 'ended' && onEnded) {
                            onEnded();
                        }
                    }}
                />
            </View>
        );
    }

    // 2. Detección de Video Directo / Drive
    const isDrive = url.includes('drive.google.com');
    let finalUrl = url;

    if (isDrive) {
        // Intentar extraer la ID tanto del formato /view como del formato uc?export=download
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        
        if (match && match[1]) {
            // Utilizamos el endpoint uc?export=download que expo-video puede intentar leer como un .mp4 falso
            finalUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }
    }

    // 3. Renderizar Video Directo (ya sea el MP4 o el Google Drive transformado)
    return (
        <View style={[styles.container, style, { height }]}>
            <DirectVideoPlayer 
                url={finalUrl} 
                shouldPlay={shouldPlay} 
                isLooping={isLooping} 
                isMuted={isMuted} 
                contentFit={contentFit}
                onEnded={onEnded}
                showControls={showControls}
                style={style}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    playerContent: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    }
});
