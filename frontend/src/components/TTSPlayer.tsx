import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    IconButton,
    Typography,
    CircularProgress,
    Slider,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import RepeatIcon from '@mui/icons-material/Repeat';
import SpeedIcon from '@mui/icons-material/Speed';

interface TTSPlayerProps {
    audioUrl: string;
    text: string;
}

const TTSPlayer: React.FC<TTSPlayerProps> = ({ audioUrl, text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [repeatCount, setRepeatCount] = useState(0);
    const [currentRepeat, setCurrentRepeat] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    const handlePlay = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.addEventListener('ended', handleAudioEnd);
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            setIsLoading(true);
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error playing audio:', error);
                    setIsLoading(false);
                });
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setCurrentRepeat(0);
        }
    };

    const handleAudioEnd = () => {
        if (repeatCount > 0 && currentRepeat < repeatCount) {
            setCurrentRepeat(prev => prev + 1);
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else {
            setIsPlaying(false);
            setCurrentRepeat(0);
        }
    };

    const handleSpeedChange = (event: Event, newValue: number | number[]) => {
        setPlaybackSpeed(newValue as number);
    };

    const handleRepeatChange = (event: any) => {
        setRepeatCount(event.target.value);
        setCurrentRepeat(0);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {text}
                </Typography>
                <Box display="flex" gap={1}>
                    <IconButton
                        onClick={handlePlay}
                        disabled={isLoading}
                        color="primary"
                    >
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : isPlaying ? (
                            <PauseIcon />
                        ) : (
                            <PlayArrowIcon />
                        )}
                    </IconButton>
                    <IconButton
                        onClick={handleStop}
                        disabled={!isPlaying || isLoading}
                        color="primary"
                    >
                        <StopIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
                <Box display="flex" alignItems="center" gap={1} sx={{ width: 200 }}>
                    <SpeedIcon color="action" />
                    <Slider
                        value={playbackSpeed}
                        onChange={handleSpeedChange}
                        min={0.5}
                        max={2}
                        step={0.1}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}x`}
                    />
                </Box>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Repeat</InputLabel>
                    <Select
                        value={repeatCount}
                        onChange={handleRepeatChange}
                        label="Repeat"
                    >
                        <MenuItem value={0}>No Repeat</MenuItem>
                        <MenuItem value={1}>1x</MenuItem>
                        <MenuItem value={2}>2x</MenuItem>
                        <MenuItem value={3}>3x</MenuItem>
                    </Select>
                </FormControl>

                {repeatCount > 0 && currentRepeat > 0 && (
                    <Typography variant="body2" color="text.secondary">
                        Repeat {currentRepeat}/{repeatCount}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default TTSPlayer; 