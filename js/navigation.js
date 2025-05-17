document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');
  let currentPage = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let isTap = false;
  let isAnimating = false;

  let isDragging = false;

  // Add drag events
  progressBar.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  progressBar.addEventListener('touchmove', handleProgressTouch);
  progressBar.addEventListener('touchend', endDrag);

  function startDrag() {
    isDragging = true;
  }

  function drag(e) {
    if (!isDragging || isAnimating) return;
    const rect = progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    navigateToPosition(position);
  }

  function endDrag() {
    isDragging = false;
  }


  updateProgress();

  // Add progress bar interaction
  progressBar.addEventListener('click', handleProgressClick);
  progressBar.addEventListener('touchstart', handleProgressTouch);

  function handleProgressClick(e) {
    if (isAnimating) return;
    const rect = progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    navigateToPosition(position);
  }

  function handleProgressTouch(e) {
    e.preventDefault(); // Prevent page scrolling
    if (isAnimating) return;
    const rect = progressBar.getBoundingClientRect();
    const touch = e.touches[0];
    const position = (touch.clientX - rect.left) / rect.width;
    navigateToPosition(position);
  }

  function navigateToPosition(position) {
    const totalPages = pages.length;
    const targetPage = Math.min(Math.floor(position * totalPages), totalPages - 1);

    if (targetPage !== currentPage) {
      const direction = targetPage > currentPage ? 1 : -1;
      const steps = Math.abs(targetPage - currentPage);

      let count = 0;
      function animateSteps() {
        if (count < steps) {
          changePage(direction);
          count++;
          setTimeout(animateSteps, 300);
        }
      }
      animateSteps();
    }
  }

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

      updateProgress();

      requestAnimationFrame(() => {
        nextPageElement.classList.remove('fade-out');
        setTimeout(() => {
          isAnimating = false;
        }, 300);
      });
    }, 300);
  }

  function updateProgress() {
    const totalPages = pages.length;
    const progressWidth = ((currentPage + 1) / totalPages) * 100;
    progress.style.width = `${progressWidth}%`;
  }
});
