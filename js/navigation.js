document.addEventListener('DOMContentLoaded', function () {
  const pages = document.querySelectorAll('.page');
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');
  let currentPage = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let isTap = false;
  let isAnimating = false;
  let autoAdvanceTimer;

  // Hide all pages except first one
  pages.forEach((page, index) => {
    if (index === 0) {
      page.classList.add('fade-in');
      startAutoAdvance(); // Start auto-advance for first page
    } else {
      page.style.display = 'none';
    }
  });

  updateProgress();

  // Progress bar events
  progressBar.addEventListener('click', handleProgressClick);
  progressBar.addEventListener('touchstart', handleProgressTouch);

  // Touch events
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isTap = true;
    clearTimeout(autoAdvanceTimer); // Clear timer on user interaction
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

  function startAutoAdvance() {
    clearTimeout(autoAdvanceTimer); // Clear any existing timer
    const currentPageElement = pages[currentPage];
    const paragraphCount = currentPageElement.querySelectorAll('p').length;
    const delay = paragraphCount * 2000; // 2 seconds per paragraph

    if (currentPage < pages.length - 1) {
      autoAdvanceTimer = setTimeout(() => {
        changePage(1);
      }, delay);
    }
  }

  function handleProgressClick(e) {
    if (isAnimating) return;
    clearTimeout(autoAdvanceTimer);
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
    clearTimeout(autoAdvanceTimer);
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
    clearTimeout(autoAdvanceTimer);

    if (tapPosition < 0.3 && currentPage > 0) {
      changePage(-1);
      startAutoAdvance(); // Start auto-advance after going backward
    } else if (tapPosition > 0.7 && currentPage < pages.length - 1) {
      changePage(1);
      startAutoAdvance(); // Start auto-advance after going forward
    }
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < 50) return;
    clearTimeout(autoAdvanceTimer);

    if (swipeDistance > 0 && currentPage > 0) {
      changePage(-1);
    } else if (swipeDistance < 0 && currentPage < pages.length - 1) {
      changePage(1);
    }
  }

  function setupFadeWordsOnPage() {
    const fadeDuration = parseFloat(nextPageElement.dataset.fadeDuration || 1);
    nextPageElement.style.setProperty('--fade-duration', `${fadeDuration}s`);
    currentPageElement.classList.remove('fade-in');
    currentPageElement.classList.add('fade-out');
  }

  function changePage(direction) {
    if (isAnimating) return;
    isAnimating = true;
    clearTimeout(autoAdvanceTimer);

    const currentPageElement = pages[currentPage];
    const nextPage = currentPage + direction;
    const nextPageElement = pages[nextPage];

    const embelishment = ""
    switch (embelishment) {
      case "fade":
        setupFadeWordsOnPage();
        break;
      case "colour":
        applyColorGradient("start", "end", "#ff0000", "#0000ff");
        break;
      default:
        console.log("Unknown fruit");
    }

    setTimeout(() => {
      currentPageElement.style.display = 'none';
      currentPageElement.classList.remove('fade-out');
      currentPage = nextPage;

      nextPageElement.classList.remove('fade-in');
      nextPageElement.style.display = 'block';

      void nextPageElement.offsetWidth;

      const embelishment = ""
      switch (embelishment) {
        case "fade":
          nextPageElement.classList.add('fade-in');
          break;
        case "banana":
          console.log("This is a banana");
          break;
        default:
          console.log("Unknown fruit");
      }


      updateProgress();
      startAutoAdvance(); // Start auto-advance for new page

      setTimeout(() => {
        isAnimating = false;
      }, fadeDuration * 1000 + 100);
    }, 3000);
  }

  function updateProgress() {
    const progressWidth = ((currentPage + 1) / pages.length) * 100;
    progress.style.width = `${progressWidth}%`;
  }
});
