document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  let currentPage = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let isTap = false;
  let isAnimating = false;

  // Hide all pages except first one
  pages.forEach((page, index) => {
    if (index !== 0) page.style.display = 'none';
  });

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
    currentPageElement.classList.add('fade-out');

    setTimeout(() => {
      currentPageElement.style.display = 'none';
      currentPageElement.classList.remove('fade-out');
      currentPage += direction;

      const nextPageElement = pages[currentPage];
      nextPageElement.style.display = 'block';
      nextPageElement.classList.add('fade-out');

      requestAnimationFrame(() => {
        nextPageElement.classList.remove('fade-out');
        setTimeout(() => {
          isAnimating = false;
        }, 300);
      });
    }, 300);
  }
});
