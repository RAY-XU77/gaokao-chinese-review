// views/knowledge.js - 知识点详情
Views.knowledge = {
  render(moduleId) {
    const app = document.getElementById("app");
    const mod = getModule(moduleId);
    const kd = KnowledgeData[moduleId];
    if (!kd) {
      app.innerHTML = '<div class="empty-state"><div class="empty-icon">📖</div><h3>暂无知识点内容</h3><p>该模块的知识点正在整理中</p></div>';
      return;
    }

    let contentHtml = kd.content.map(c => {
      if (c.type === "h3") return "<h3>" + c.text + "</h3>";
      if (c.type === "p") return "<p>" + c.text + "</p>";
      if (c.type === "ul") return "<ul>" + c.items.map(i => "<li>" + i + "</li>").join("") + "</ul>";
      if (c.type === "tip") return '<div class="tip-box">💡 ' + c.text + "</div>";
      return "";
    }).join("\n");

    app.innerHTML = [
      '<div class="flex-between" style="margin-bottom:16px">',
      '<div><h2 class="page-title" style="margin-bottom:0">' + mod.name + '</h2><p class="page-subtitle" style="margin-bottom:0">核心知识点梳理</p></div>',
      '<button class="btn btn-outline" onclick="Router.navigate(\'practice\',\'' + moduleId + '\')">← 返回练习</button>',
      "</div>",
      '<div class="card knowledge-content">',
      contentHtml,
      "</div>"
    ].join("\n");
  }
};