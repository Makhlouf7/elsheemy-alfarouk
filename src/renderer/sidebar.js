document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      setTimeout(function () {
        if (typeof applySidebarState === 'function') {
          applySidebarState();
        }
      }, 0);
    }
  });

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

    // Get the parent anchor element
    const parentAnchor = item.closest('a');
    if (parentAnchor) {
      // Add click event to prevent sidebar toggle when clicking on nav items
      item.addEventListener('click', function (e) {
        // If sidebar is collapsed, prevent event bubbling to avoid toggling sidebar
        if (sidebar.classList.contains('collapsed')) {
          // Stop event propagation
          e.stopPropagation();

          // Navigate to the link directly
          window.location.href = parentAnchor.getAttribute('href');
        }
      });
    }
  });

  function applySidebarState(forceState = null) {
    let isCollapsed;

    if (forceState !== null) {
      isCollapsed = forceState;
    } else {
      const sidebarState = localStorage.getItem('sidebarCollapsed');
      isCollapsed = sidebarState !== 'false';
    }

    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.marginRight = isCollapsed ? '70px' : '280px';
      mainContent.style.width = isCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 280px)';
    }

    const iconElement = toggleButton.querySelector('span');
    if (iconElement) {
      iconElement.textContent = '≡';
      iconElement.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
    }

    toggleButton.setAttribute('title', isCollapsed ? 'عرض القائمة' : 'طي القائمة');

    localStorage.setItem('sidebarCollapsed', isCollapsed);

    return isCollapsed;
  }

  window.applySidebarState = applySidebarState;

  const isCollapsed = applySidebarState();

  toggleButton.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const currentState = sidebar.classList.contains('collapsed');
    const newState = !currentState;

    applySidebarState(newState);
  });

  document.querySelectorAll('.sidebar .icon').forEach(icon => {
    icon.addEventListener('click', function (e) {
      if (sidebar.classList.contains('collapsed')) {
        e.stopPropagation();
      }
    });
  });
});
