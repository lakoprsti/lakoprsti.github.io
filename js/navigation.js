document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');
  let currentPage = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let isTap = false;
  let isAnimating = false;

  // Hide all pages except first one
  pages.forEach((page, index) => {
    if (index === 0) {
      page.classList.add('fade-in');
    } else {
      page.style.display = 'none';
    }
  });

  updateProgress();

  // Hide all pages except first one
  pages.forEach((page, index) => {
    if (index !== 0) page.style.display = 'none';
  });

  // Progress bar events
  progressBar.addEventListener('click', handleProgressClick);
  progressBar.addEventListener('touchstart', handleProgressTouch);

  // Touch events
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isTap = true;
  });

  document.addEventListener('touchmove', () => {
    isTap = false;
  });

  document.addEventListener('touchend', (e) => {
    if (isAnimating) return;
    touchEndX = e.changedTouches[0].clientX;
    if (isTap) {
      handleTap(touchEndX);
    } else {
      handleSwipe();
    }
  });

  function handleProgressClick(e) {
    if (isAnimating) return;
    const rect = progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const targetPage = Math.min(Math.floor(position * pages.length), pages.length - 1);
    if (targetPage !== currentPage) {
      changePage(targetPage > currentPage ? 1 : -1);
    }
  }

  function handleProgressTouch(e) {
    e.preventDefault();
    if (isAnimating) return;
    const rect = progressBar.getBoundingClientRect();
    const touch = e.touches[0];
    const position = (touch.clientX - rect.left) / rect.width;
    const targetPage = Math.min(Math.floor(position * pages.length), pages.length - 1);
    if (targetPage !== currentPage) {
      changePage(targetPage > currentPage ? 1 : -1);
    }
  }

  function handleTap(x) {
    const screenWidth = window.innerWidth;
    const tapPosition = x / screenWidth;

    if (tapPosition < 0.3 && currentPage > 0) {
      changePage(-1);
    } else if (tapPosition > 0.7 && currentPage < pages.length - 1) {
      changePage(1);
    }
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance > 0 && currentPage > 0) {
      changePage(-1);
    } else if (swipeDistance < 0 && currentPage < pages.length - 1) {
      changePage(1);
    }
  }

  function changePage(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const currentPageElement = pages[currentPage];
    const nextPage = currentPage + direction;
    const nextPageElement = pages[nextPage];

    // Get fade duration from data attribute or default to 1
    const fadeDuration = parseFloat(nextPageElement.dataset.fadeDuration || 1);
    nextPageElement.style.setProperty('--fade-duration', `${fadeDuration}s`);

    currentPageElement.classList.remove('fade-in');
    currentPageElement.classList.add('fade-out');

    setTimeout(() => {
      currentPageElement.style.display = 'none';
      currentPageElement.classList.remove('fade-out');
      currentPage = nextPage;

      nextPageElement.classList.remove('fade-in');
      nextPageElement.style.display = 'block';

      void nextPageElement.offsetWidth;
      nextPageElement.classList.add('fade-in');

      updateProgress();

      setTimeout(() => {
        isAnimating = false;
      }, fadeDuration * 1000 + 500);
    }, 3000);
  }

  function updateProgress() {
    const progressWidth = ((currentPage + 1) / pages.length) * 100;
    progress.style.width = `${progressWidth}%`;
  }
});
