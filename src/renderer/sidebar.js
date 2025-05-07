document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.sidebar');

  if (!sidebar) {
    console.error('Sidebar element not found');
    return;
  }

  // Get toggle button
  const toggleButton = document.getElementById('sidebar-toggle');

  if (!toggleButton) {
    console.error('Toggle button not found');
    return;
  }

  console.log('Toggle button found:', toggleButton);

  // Check if sidebar state is saved in localStorage
  const sidebarState = localStorage.getItem('sidebarCollapsed');
  if (sidebarState === 'true') {
    sidebar.classList.add('collapsed');

    // Apply collapsed state to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.marginRight = '70px';
    }
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

    // Update button title
    toggleButton.setAttribute('title', isCollapsed ? 'عرض القائمة' : 'طي القائمة');

    console.log('Sidebar collapsed state:', isCollapsed);
  });

  console.log('Sidebar toggle functionality initialized');
});
