// Hide extra tabs from Expo Router that are not part of the main 4 tabs
function hideExtraTabs() {
  const tabs = document.querySelectorAll('a[role="tab"]');
  
  // Keep only the first 4 tabs (الاستكشاف, البحث, المفضلة, الملف الشخصي)
  // Hide all tabs after the 4th one
  tabs.forEach((tab, index) => {
    if (index >= 4) {
      tab.style.display = 'none';
      tab.style.visibility = 'hidden';
      tab.style.width = '0';
      tab.style.height = '0';
      tab.style.padding = '0';
      tab.style.margin = '0';
      tab.style.border = 'none';
      tab.style.pointerEvents = 'none';
      tab.style.position = 'absolute';
      tab.style.left = '-9999px';
      tab.setAttribute('aria-hidden', 'true');
      tab.setAttribute('tabindex', '-1');
    }
  });
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideExtraTabs);
} else {
  hideExtraTabs();
}

// Also run periodically to catch dynamically added tabs
setInterval(hideExtraTabs, 500);
