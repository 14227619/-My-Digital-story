// Music Player Module
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('background-music');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.playIcon = document.getElementById('play-icon');
        this.pauseIcon = document.getElementById('pause-icon');
        this.prevBtn = document.getElementById('prev-track-btn');
        this.nextBtn = document.getElementById('next-track-btn');
        this.songTitle = document.getElementById('song-title');
        this.volumeSlider = document.getElementById('volume-slider');

        this.playlist = [
            { src: 'music/song1.mp3', title: 'Our Special Song' },
            { src: 'music/song2.mp3', title: 'Campus Memories' },
            { src: 'music/song3.mp3', title: 'Dreamy Nights' }
        ];

        this.currentTrackIndex = parseInt(localStorage.getItem('currentTrackIndex')) || 0;
        this.volume = parseFloat(localStorage.getItem('volume')) || 0.5;
        this.isPlaying = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTrack(this.currentTrackIndex);
        this.setVolume(this.volume);
        this.checkPlaylistAvailability();
    }

    bindEvents() {
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextTrack());
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousTrack());
        }

        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }

        if (this.audio) {
            this.audio.addEventListener('ended', () => this.nextTrack());
            this.audio.addEventListener('error', (e) => this.handleAudioError(e));
        }
    }

    async checkPlaylistAvailability() {
        const availableTracks = [];

        for (const track of this.playlist) {
            try {
                const response = await fetch(track.src, { method: 'HEAD' });
                if (response.ok) {
                    availableTracks.push(track);
                }
            } catch (error) {
                console.warn(`Track not available: ${track.title} (${track.src})`);
            }
        }

        if (availableTracks.length === 0) {
            console.warn('No music tracks available. Music player will be hidden.');
            this.hideMusicPlayer();
            return;
        }

        this.playlist = availableTracks;
        this.loadTrack(Math.min(this.currentTrackIndex, this.playlist.length - 1));
    }

    hideMusicPlayer() {
        const playerContainer = document.getElementById('music-player-container');
        if (playerContainer) {
            playerContainer.style.display = 'none';
        }
    }

    loadTrack(index) {
        if (!this.playlist[index]) return;

        this.currentTrackIndex = index;
        const track = this.playlist[index];

        if (this.audio) {
            this.audio.src = track.src;
            this.audio.load();
        }

        if (this.songTitle) {
            this.songTitle.textContent = track.title;
        }

        localStorage.setItem('currentTrackIndex', index);

        // If it was playing before, continue playing
        if (this.isPlaying) {
            this.playTrack();
        }
    }

    playTrack() {
        if (!this.audio) return;

        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayPauseButton(true);
                })
                .catch(error => {
                    console.warn('Autoplay prevented:', error);
                    this.isPlaying = false;
                    this.updatePlayPauseButton(false);
                });
        }
    }

    pauseTrack() {
        if (!this.audio) return;

        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayPauseButton(false);
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseTrack();
        } else {
            this.playTrack();
        }
    }

    nextTrack() {
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.playTrack();
        }
    }

    previousTrack() {
        const prevIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(prevIndex);
        if (this.isPlaying) {
            this.playTrack();
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.audio) {
            this.audio.volume = volume;
        }
        if (this.volumeSlider) {
            this.volumeSlider.value = volume * 100;
        }
        localStorage.setItem('volume', volume);
    }

    updatePlayPauseButton(isPlaying) {
        if (!this.playIcon || !this.pauseIcon) return;

        if (isPlaying) {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
            this.playPauseBtn.setAttribute('title', 'Pause Music');
        } else {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
            this.playPauseBtn.setAttribute('title', 'Play Music');
        }
    }

    handleAudioError(error) {
        console.error('Audio error:', error);
        // Try to load next track if current one fails
        this.nextTrack();
    }
}

// Initialize Music Player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});