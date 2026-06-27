// views/module-list.js - 专项训练列表
Views.moduleList = {
  render() {
    const app = document.getElementById("app");
    const stats = Store.calcStats();
    const weakIds = new Set(stats.weak.filter(m => m.total > 5 && parseFloat(m.rate) < 70).map(m => m.id));

    let cards = Modules.map(m => {
      const ms = stats.moduleStats[m.id] || { total: 0, correct: 0, rate: "0" };
      const rate = ms.total > 0 ? parseFloat(ms.rate) : 0;
      const isWeak = weakIds.has(m.id);
      const barPct = ms.total > 0 ? rate : 0;

      return '<div class="module-card' + (isWeak ? " weak" : "") + '" onclick="Router.navigate(\'practice\',\'' + m.id + '\')">' +
        "<div class=\"mc-header\"><div class=\"mc-icon\">" + m.icon + '</div><div style="flex:1"><div class="mc-title">' + m.name + "</div><div class=\"mc-desc\">" + m.desc + "</div></div></div>" +
        '<div class="mc-stats">练习 ' + ms.total + '题 | 正确率 ' + (ms.total > 0 ? rate + "%" : "--") + (isWeak ? ' | <span style="color:var(--danger)">需加强</span>' : "") + "</div>" +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + barPct + '%"></div></div>' +
        '<div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap">' +
        '<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();Router.navigate(\'knowledge\',\'' + m.id + '\')">知识点</button>' +
        '<button class="btn btn-sm btn-outline" onclick="event.stopPropagation();Router.navigate(\'practice\',\'' + m.id + '\')">开始练习</button></div></div>';
    });

    app.innerHTML = '<h2 class="page-title">专项训练</h2>' +
      '<p class="page-subtitle">按题型逐项突破，从基础到冲刺。薄弱模块已标红提示。</p>' +
      '<div class="module-grid">' + cards.join("") + '</div>';
  }
};