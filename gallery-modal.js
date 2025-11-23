document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeModalBtn = document.getElementById('modal-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const openModal = (src, caption) => {
        modalImage.src = src;
        modalCaption.textContent = caption;
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        modal.classList.remove('visible');
        document.body.style.overflow = ''; // Restore scrolling
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.dataset.src;
            const caption = item.dataset.caption;
            openModal(src, caption);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    // Close modal by clicking on the overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});











