// app.js - 应用主入口
(function() {
  // 在页面加载前注册路由
  document.addEventListener('DOMContentLoaded', function() {
    // 注册所有路由
    Router.register('home', () => Views.home.render());
    Router.register('modules', () => Views.moduleList.render());
    Router.register('practice', (moduleId) => Views.practice.render(moduleId));
    Router.register('knowledge', (moduleId) => Views.knowledge.render(moduleId));
    Router.register('exam', () => Views.mockExam.render());
    Router.register('mistakes', () => Views.mistakeBook.render());
    Router.register('analytics', () => Views.analytics.render());
    Router.register('record', () => Views.record.render());

    // 初始化路由
    Router.init();
  });
})();