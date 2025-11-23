// Gallery Modal Module
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('gallery-modal');
        this.modalImage = document.getElementById('modal-image');
        this.modalCaption = document.getElementById('modal-caption');
        this.closeBtn = document.getElementById('modal-close');
        this.currentImageIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.collectGalleryImages();
        this.bindEvents();
        this.addKeyboardNavigation();
    }

    collectGalleryImages() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        this.images = Array.from(galleryItems).map(item => ({
            src: item.dataset.src || item.querySelector('img').src,
            caption: item.dataset.caption || item.querySelector('img').alt
        }));
    }

    bindEvents() {
        // Open modal on gallery item click
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                e.preventDefault();
                const img = galleryItem.querySelector('img');
                const index = Array.from(document.querySelectorAll('.gallery-item')).indexOf(galleryItem);
                this.openModal(img.src, galleryItem.dataset.caption, index);
            }
        });

        // Close modal events
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
    }

    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.modal || !this.modal.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.showPreviousImage();
                    break;
                case 'ArrowRight':
                    this.showNextImage();
                    break;
            }
        });
    }

    openModal(src, caption, index = 0) {
        if (!this.modal) return;

        this.currentImageIndex = index;
        this.modalImage.src = src;
        this.modalCaption.textContent = caption || '';
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Preload adjacent images
        this.preloadAdjacentImages();
    }

    closeModal() {
        if (!this.modal) return;

        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showNextImage() {
        if (this.images.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateModalContent();
    }

    showPreviousImage() {
        if (this.images.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateModalContent();
    }

    updateModalContent() {
        const image = this.images[this.currentImageIndex];
        this.modalImage.src = image.src;
        this.modalCaption.textContent = image.caption || '';
    }

    preloadAdjacentImages() {
        // Preload next and previous images for smoother navigation
        const preloadIndices = [
            (this.currentImageIndex - 1 + this.images.length) % this.images.length,
            (this.currentImageIndex + 1) % this.images.length
        ];

        preloadIndices.forEach(index => {
            const img = new Image();
            img.src = this.images[index].src;
        });
    }
}

// Initialize Gallery Modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryModal();
});