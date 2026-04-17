(function () {
  'use strict';

  // ===== DOM references =====
  var sidebar = document.getElementById('sidebar');
  var sidebarOverlay = document.getElementById('sidebarOverlay');
  var mobileToggle = document.getElementById('mobileToggle');
  var companySelect = document.getElementById('companySelect');
  var navItems = document.querySelectorAll('.nav-item[data-screen]');
  var screens = document.querySelectorAll('.screen');
  var navAmianto = document.getElementById('navAmianto');

  // ===== Company data for empresa dashboard =====
  var companyData = {
    solutal: {
      name: 'Solutal',
      facturacion: '\u20ac52.300',
      pendiente: '\u20ac31.900',
      obras: '8',
      pendFacturar: '2',
      operarios: '6',
      vehiculos: '4'
    },
    aplital: {
      name: 'Aplital',
      facturacion: '\u20ac31.200',
      pendiente: '\u20ac8.200',
      obras: '3',
      pendFacturar: '0',
      operarios: '4',
      vehiculos: '2'
    },
    ccv: {
      name: 'CCV - Confor Clim\u00e1tico',
      facturacion: '\u20ac28.400',
      pendiente: '\u20ac4.100',
      obras: '4',
      pendFacturar: '1',
      operarios: '3',
      vehiculos: '2'
    },
    imper: {
      name: 'Imper Confort',
      facturacion: '\u20ac8.750',
      pendiente: '\u20ac0',
      obras: '2',
      pendFacturar: '0',
      operarios: '2',
      vehiculos: '1'
    },
    jardin: {
      name: 'Jard\u00edn 1900',
      facturacion: '\u20ac6.800',
      pendiente: '\u20ac6.800',
      obras: '1',
      pendFacturar: '0',
      operarios: '3',
      vehiculos: '1'
    }
  };

  // ===== Navigate to screen =====
  function showScreen(screenId) {
    screens.forEach(function (s) {
      s.classList.remove('active');
    });

    var target = document.getElementById('screen-' + screenId);
    if (target) {
      target.classList.add('active');
    }

    // Update active nav
    navItems.forEach(function (item) {
      item.classList.remove('active');
    });
    navItems.forEach(function (item) {
      if (item.getAttribute('data-screen') === screenId) {
        item.classList.add('active');
      }
    });

    // Close mobile sidebar
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  }

  // ===== Handle dashboard based on company =====
  function handleDashboard() {
    var company = companySelect.value;
    if (company === 'todas') {
      showScreen('dashboard-grupo');
    } else {
      updateEmpresaDashboard(company);
      showScreen('dashboard-empresa');
    }
  }

  function updateEmpresaDashboard(company) {
    var data = companyData[company];
    if (!data) return;

    document.getElementById('empresaDashTitle').textContent = data.name;
    document.getElementById('empFacturacion').textContent = data.facturacion;
    document.getElementById('empPendiente').textContent = data.pendiente;
    document.getElementById('empObras').textContent = data.obras;
    document.getElementById('empPendFacturar').textContent = data.pendFacturar;
    document.getElementById('empOperarios').textContent = data.operarios;
    document.getElementById('empVehiculos').textContent = data.vehiculos;
  }

  // ===== Handle Amianto visibility =====
  function updateAmiantoVisibility() {
    var company = companySelect.value;
    navAmianto.style.display = (company === 'solutal') ? 'flex' : 'none';
  }

  // ===== Nav click handlers =====
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var screenId = this.getAttribute('data-screen');

      // "dashboard" goes to grupo or empresa depending on selector
      if (screenId === 'dashboard') {
        handleDashboard();
        return;
      }

      showScreen(screenId);
    });
  });

  // ===== Company selector =====
  companySelect.addEventListener('change', function () {
    updateAmiantoVisibility();

    // If currently on dashboard, switch to correct one
    var activeDashGrupo = document.getElementById('screen-dashboard-grupo').classList.contains('active');
    var activeDashEmpresa = document.getElementById('screen-dashboard-empresa').classList.contains('active');

    if (activeDashGrupo || activeDashEmpresa) {
      handleDashboard();
    }
  });

  // ===== Tab switching (facturacion) =====
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = this.getAttribute('data-tab');
      if (tab === 'recibidas') {
        showScreen('facturacion-recibidas');
      } else if (tab === 'emitidas') {
        showScreen('facturacion-emitidas');
      }
    });
  });

  // ===== Obra link clicks =====
  document.addEventListener('click', function (e) {
    var obraLink = e.target.closest('.obra-link');
    if (obraLink) {
      showScreen('obra-individual');
    }
  });

  // ===== Doc card clicks (bandeja → detalle) =====
  document.addEventListener('click', function (e) {
    // Skip if clicking a button
    if (e.target.closest('button')) return;
    // Check if click is inside a ready doc-card
    var el = e.target;
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains('doc-card') && el.classList.contains('ready')) {
        showScreen('doc-detalle');
        return;
      }
      el = el.parentElement;
    }
  });

  // ===== Back button from doc detail =====
  var btnBack = document.getElementById('btnBackBandeja');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      showScreen('bandeja');
    });
  }

  // ===== Mobile sidebar =====
  mobileToggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });

  sidebarOverlay.addEventListener('click', function () {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });

  // ===== Initialize =====
  updateAmiantoVisibility();

  // Animate bars on load
  setTimeout(function () {
    document.querySelectorAll('.bar-fill').forEach(function (bar) {
      var w = bar.style.width;
      bar.style.width = '0%';
      setTimeout(function () {
        bar.style.width = w;
      }, 100);
    });
  }, 200);

})();
