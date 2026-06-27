// router.js - 基于 hash 的 SPA 路由
const Router = {
  routes: {},
  currentRoute: null,

  register(viewName, fn) {
    this.routes[viewName] = fn;
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const hash = location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    const view = parts[0];
    const params = parts.slice(1);

    if (this.routes[view]) {
      this.currentRoute = view;
      this.routes[view](...params);
      this.updateNav(view);
    } else {
      location.hash = 'home';
    }
  },

  updateNav(view) {
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
      const href = a.getAttribute('href').slice(1);
      a.classList.toggle('active', href === view || href === view.split('/')[0]);
    });
  },

  navigate(view, ...params) {
    location.hash = view + (params.length ? '/' + params.join('/') : '');
  }
};