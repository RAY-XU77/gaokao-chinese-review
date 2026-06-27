// views/home.js - 首页
window.Views = window.Views || {};

Views.home = {
  render() {
    const app = document.getElementById('app');
    const stats = Store.calcStats();
    const today = Utils.today();
    const logs = Store.getDailyLogs();
    const todayLog = logs[today] || { questionsDone: 0, correct: 0, timeMinutes: 0 };
    const settings = Store.getSettings();
    const totalQuestions = 620;

    let weakHtml = '';
    if (stats.weak.length > 0) {
      weakHtml = stats.weak.slice(0, 3).map(m => {
        const info = Utils.getModuleInfo(m.id);
        return '<div class="stat-card danger">' +
          '<div class="stat-label">' + info.name + '</div>' +
          '<div class="stat-value">' + m.rate + '%</div>' +
          '<div class="stat-sub">正确率偏低，建议优先复习</div></div>';
      }).join('');
    }

    let weakSection = '';
    if (stats.weak.length > 0 && todayLog.questionsDone === 0) {
      weakSection = '<div class="card" style="margin-top:16px">' +
        '<div style="font-weight:600;margin-bottom:12px">薄弱模块提醒</div>' +
        '<div class="stats-grid">' + weakHtml + '</div>' +
        '<button class="btn btn-primary mt-2" onclick="Router.navigate(\'modules\')">去薄弱模块练习</button></div>';
    }

    app.innerHTML = [
      '<h2 class="page-title">学习首页</h2>',
      '<p class="page-subtitle">目标：高考语文 125 分 | 距离2027年高考还有约1年</p>',
      '<div class="stats-grid">',
      '<div class="stat-card"><div class="stat-label">今日做题</div><div class="stat-value">' + todayLog.questionsDone + '</div><div class="stat-sub">目标 ' + settings.dailyGoal + ' 题/天</div></div>',
      '<div class="stat-card' + (todayLog.questionsDone > 0 ? ' success' : '') + '"><div class="stat-label">今日正确率</div><div class="stat-value">' + (todayLog.questionsDone > 0 ? Math.round(todayLog.correct / todayLog.questionsDone * 100) : '--') + '%</div><div class="stat-sub">' + (todayLog.questionsDone > 0 ? '答对' + todayLog.correct + '题' : '今天还没有做题') + '</div></div>',
      '<div class="stat-card"><div class="stat-label">累计做题</div><div class="stat-value">' + stats.total + '</div><div class="stat-sub">总正确率 ' + stats.rate + '%</div></div>',
      '<div class="stat-card"><div class="stat-label">总体正确率</div><div class="stat-value">' + stats.rate + '%</div><div class="stat-sub">目标83% | 错题 ' + stats.wrong + '题</div></div>',
      '<div class="stat-card"><div class="stat-label">学习时长</div><div class="stat-value">' + Utils.formatHour(todayLog.timeMinutes) + '</div><div class="stat-sub">今日累计</div></div>',
      '<div class="stat-card"><div class="stat-label">题库进度</div><div class="stat-value">' + Math.round(stats.total / totalQuestions * 100) + '%</div><div class="stat-sub">' + stats.total + '/' + totalQuestions + ' 题</div></div>',
      '</div>',
      weakSection,
      '<div class="card" style="margin-top:16px"><div class="flex-between"><div><div style="font-weight:600">快速开始</div><div style="font-size:13px;color:var(--text-secondary)">选择你要训练的方向</div></div></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">',
      '<button class="btn btn-primary" onclick="Router.navigate(\'modules\')">进入专项训练</button>',
      '<button class="btn btn-outline" onclick="Router.navigate(\'exam\')">模拟考试</button>',
      '<button class="btn btn-outline" onclick="Router.navigate(\'mistakes\')">查看错题本</button>',
      '<button class="btn btn-outline" onclick="Router.navigate(\'analytics\')">成绩分析</button></div></div>',
      '<div class="card" style="margin-top:16px"><div style="font-weight:600;margin-bottom:8px">目标125分策略</div><div style="font-size:13px;line-height:1.7;color:var(--text-secondary)">',
      '<p>现代文阅读 <strong>28-30</strong>/35分 | 古诗文阅读 <strong>28-30</strong>/35分</p>',
      '<p>语言文字运用 <strong>18-19</strong>/20分 | 写作 <strong>50-52</strong>/60分</p>',
      '<p style="margin-top:4px;color:var(--primary);font-weight:600">当前总体正确率 ' + stats.rate + '%，目标 83%</p></div></div>'
    ].join('\n');
  }
};
