document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.sidebar');

  if (!sidebar) {
    console.error('Sidebar element not found');
    return;
  }

  // Get sidebar header
  const sidebarHeader = document.querySelector('.sidebar-header');

  if (!sidebarHeader) {
    console.error('Sidebar header not found');
    return;
  }

  // Get toggle button or create it if it doesn't exist
  let toggleButton = document.getElementById('sidebar-toggle');

  if (!toggleButton) {
    // Create toggle button
    toggleButton = document.createElement('button');
    toggleButton.id = 'sidebar-toggle';
    toggleButton.className = 'sidebar-toggle';
    toggleButton.setAttribute('title', 'تبديل القائمة');
    toggleButton.innerHTML = '<span>≡</span>';

    // Add toggle button to sidebar header
    sidebarHeader.insertBefore(toggleButton, sidebarHeader.firstChild);

    console.log('Toggle button created and added to sidebar header');
  } else {
    console.log('Toggle button found:', toggleButton);
  }

  // Add data-title attribute to nav items for tooltip when sidebar is collapsed
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const textSpan = item.querySelector('span:not(.icon)');
    if (textSpan) {
      item.setAttribute('data-title', textSpan.textContent.trim());
    }
  });

  // Set sidebar to collapsed by default, unless explicitly set to expanded
  const sidebarState = localStorage.getItem('sidebarCollapsed');

  // If no state is saved or state is true, collapse the sidebar
  if (sidebarState !== 'false') {
    sidebar.classList.add('collapsed');

    // Apply collapsed state to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.marginRight = '70px';
    }

    // Update localStorage to remember this state
    localStorage.setItem('sidebarCollapsed', 'true');

    // Set initial icon state
    const iconElement = toggleButton.querySelector('span');
    if (iconElement) {
      iconElement.textContent = '≡';
      iconElement.style.transform = 'rotate(0deg)';
    }

    // Set initial button title
    toggleButton.setAttribute('title', 'عرض القائمة');
  }

  // Add click event to toggle button
  toggleButton.addEventListener('click', function (e) {
    console.log('Toggle button clicked');

    // Toggle sidebar class
    sidebar.classList.toggle('collapsed');

    // Save sidebar state to localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);

    // Apply collapsed state to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.marginRight = isCollapsed ? '70px' : '280px';
    }

    // Update button title and icon
    toggleButton.setAttribute('title', isCollapsed ? 'عرض القائمة' : 'طي القائمة');

    // Update icon direction based on collapsed state
    const iconElement = toggleButton.querySelector('span');
    if (iconElement) {
      iconElement.textContent = isCollapsed ? '≡' : '≡';
      iconElement.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
    }

    console.log('Sidebar collapsed state:', isCollapsed);
  });

  console.log('Sidebar toggle functionality initialized');
});
