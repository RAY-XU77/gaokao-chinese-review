// views/analytics.js - 成绩分析
Views.analytics = {
  render() {
    var app = document.getElementById("app");
    var stats = Store.calcStats();
    var mockExams = Store.getMockExams();
    var logs = Store.getDailyLogs();

    app.innerHTML = [
      '<h2 class="page-title">成绩分析</h2>',
      '<p class="page-subtitle">清晰了解你的学习情况，定位薄弱环节</p>',

      // 各模块雷达图
      '<div class="chart-container" style="margin-bottom:16px">',
      '<div class="chart-title">各模块得分率</div>',
      '<div class="bar-chart">',
      this.renderBarChart(stats.moduleStats),
      "</div></div>",

      // 目标差距
      '<div class="card mb-4">',
      '<div style="font-weight:600;margin-bottom:8px">目标125分差距分析</div>',
      this.renderGapAnalysis(stats),
      "</div>",

      // 模拟考试记录
      mockExams.length > 0 ? '<div class="card mb-4"><div style="font-weight:600;margin-bottom:8px">模拟考试趋势</div>' + this.renderMockTrend(mockExams) + "</div>" : "",

      // 学习统计
      '<div class="card"><div style="font-weight:600;margin-bottom:8px">学习总览</div>' +
      "<p>累计做题：<strong>" + stats.total + "</strong> 题</p>" +
      "<p>答对：<strong>" + stats.correct + "</strong> 题</p>" +
      "<p>答错：<strong>" + stats.wrong + "</strong> 题</p>" +
      "<p>总正确率：<strong>" + stats.rate + "%</strong></p>" +
      "<p>学习天数：<strong>" + Object.keys(logs).length + "</strong> 天</p>" +
      "<p>目标正确率：<strong>83%</strong> " + (parseFloat(stats.rate) >= 83 ? "✅ 已达到" : "⏳ 还差 " + (83 - parseFloat(stats.rate)).toFixed(1) + "%") + "</p></div>"
    ].join("\n");
  },

  renderBarChart(moduleStats) {
    var bars = Modules.map(function(m) {
      var ms = moduleStats[m.id] || { total: 0, correct: 0, rate: "0" };
      var rate = ms.total > 0 ? parseFloat(ms.rate) : 0;
      var cls = rate >= 80 ? "high" : (rate >= 50 ? "medium" : "low");
      return '<div class="bar-row"><div class="bar-label">' + m.name + '</div><div class="bar-track"><div class="bar-fill ' + cls + '" style="width:' + Math.max(rate, 8) + '%">' + (ms.total > 0 ? rate.toFixed(0) + "%" : "--") + "</div></div></div>";
    });
    return bars.join("");
  },

  renderGapAnalysis(stats) {
    var modules = [
      { id: "m01", name: "信息类文本阅读", goal: 19, weight: 19 },
      { id: "m02", name: "文学类文本阅读", goal: 13, weight: 16 },
      { id: "m03", name: "文言文阅读", goal: 16, weight: 20 },
      { id: "m04", name: "古代诗歌阅读", goal: 7, weight: 9 },
      { id: "m05", name: "名篇名句默写", goal: 6, weight: 6 },
      { id: "m06", name: "成语/词语运用", goal: 3, weight: 3 },
      { id: "m07", name: "病句修改", goal: 3, weight: 3 },
      { id: "m08", name: "语句衔接与补写", goal: 6, weight: 6 },
      { id: "m09", name: "修辞/句式/压缩", goal: 5, weight: 6 },
      { id: "m10", name: "写作", goal: 50, weight: 60 }
    ];

    var totalGoal = modules.reduce(function(s, m) { return s + m.goal; }, 0);
    var html = "<p><strong>当前估算总分：</strong>" + (totalGoal > 0 ? totalGoal + "分" : "暂无法估算，请先做题") + " &nbsp;|&nbsp; <strong>目标：125分</strong></p>";
    html += '<table style="width:100%;font-size:13px;margin-top:8px;border-collapse:collapse">';
    html += "<tr style='border-bottom:1px solid var(--border)'><th style='text-align:left;padding:6px'>模块</th><th style='padding:6px'>目标</th><th style='padding:6px'>状态</th></tr>";
    modules.forEach(function(m) {
      var ms = stats.moduleStats[m.id] || { total: 0, correct: 0, rate: "0" };
      var rate = ms.total > 0 ? parseFloat(ms.rate) / 100 : 0.5;
      var est = Math.round(m.goal * Math.min(rate + 0.15, 1)); // 难度系数修正
      var status = est >= m.goal ? "✅" : "⏳";
      html += "<tr style='border-bottom:1px solid var(--border)'><td style='padding:6px'>" + m.name + "</td><td style='text-align:center;padding:6px'>" + m.goal + "分</td><td style='text-align:center;padding:6px'>" + status + " 估算 " + est + "分</td></tr>";
    });
    html += "</table>";
    return html;
  },

  renderMockTrend(exams) {
    if (exams.length === 0) return "<p>暂无模拟考试记录</p>";
    var recent = exams.slice(-5);
    var html = '<div style="display:flex;gap:8px;flex-wrap:wrap">';
    recent.forEach(function(e, i) {
      html += '<div class="stat-card" style="flex:1;min-width:100px;text-align:center">' +
        '<div class="stat-label">第' + (exams.indexOf(e) + 1) + "次</div>" +
        '<div class="stat-value" style="font-size:20px">' + e.total + "分</div>" +
        '<div class="stat-sub">' + e.date.slice(5) + "</div></div>";
    });
    html += "</div>";
    return html;
  }
};