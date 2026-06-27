// views/record.js - 学习记录
Views.record = {
  render() {
    var app = document.getElementById("app");
    var logs = Store.getDailyLogs();
    var dates = Object.keys(logs).sort();
    var totalDays = dates.length;
    var totalQ = dates.reduce(function(s, d) { return s + logs[d].questionsDone; }, 0);
    var totalCorrect = dates.reduce(function(s, d) { return s + logs[d].correct; }, 0);
    var totalTime = dates.reduce(function(s, d) { return s + logs[d].timeMinutes; }, 0);

    // 连续学习天数
    var streak = this.calcStreak(dates);
    var today = Utils.today();

    app.innerHTML = [
      '<h2 class="page-title">学习记录</h2>',
      '<p class="page-subtitle">记录你的每一次进步</p>',

      '<div class="stats-grid">',
      '<div class="stat-card"><div class="stat-label">学习天数</div><div class="stat-value">' + totalDays + "</div><div class=\"stat-sub\">累计</div></div>",
      '<div class="stat-card success"><div class="stat-label">连续学习</div><div class="stat-value">' + streak + "</div><div class=\"stat-sub\">天</div></div>",
      '<div class="stat-card"><div class="stat-label">总题量</div><div class="stat-value">" + totalQ + "</div><div class=\"stat-sub\">累计</div></div>",
      '<div class="stat-card"><div class="stat-label">总学习时长</div><div class="stat-value">" + Utils.formatHour(totalTime) + "</div><div class=\"stat-sub\">加油！</div></div>",
      "</div>",

      '<div class="card"><div style="font-weight:600;margin-bottom:12px">学习日历</div>',
      this.renderCalendar(logs, dates, today),
      "</div>",

      '<div class="card mt-4"><div style="font-weight:600;margin-bottom:8px">最近学习记录</div>',
      this.renderRecentLogs(dates, logs),
      "</div>"
    ].join("\n");
  },

  calcStreak(dates) {
    if (dates.length === 0) return 0;
    var sorted = dates.slice().sort().reverse();
    var streak = 0;
    var today = new Date();
    var checkDate = new Date(today);

    for (var i = 0; i < 365; i++) {
      var ds = checkDate.toISOString().slice(0, 10);
      if (sorted.indexOf(ds) !== -1) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // 今天没学，检查昨天
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      } else {
        break;
      }
    }
    return streak;
  },

  renderCalendar(logs, dates, today) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = '<div style="display:flex;flex-direction:column;gap:4px">';

    // 星期头部
    html += '<div class="record-week">';
    ["日","一","二","三","四","五","六"].forEach(function(d) {
      html += '<div style="width:36px;text-align:center;font-size:11px;color:var(--text-secondary)">' + d + "</div>";
    });
    html += "</div>";

    var date = 1;
    for (var w = 0; w < 6; w++) {
      html += '<div class="record-week">';
      for (var d = 0; d < 7; d++) {
        if (w === 0 && d < firstDay) {
          html += '<div class="record-day" style="background:transparent"></div>';
        } else if (date > daysInMonth) {
          html += '<div class="record-day" style="background:transparent"></div>';
        } else {
          var ds = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(date).padStart(2, "0");
          var hasData = logs[ds] !== undefined;
          var cls = "record-day";
          if (ds === today) cls += " today";
          if (hasData && ds === today) cls += " has-data";
          else if (hasData) cls += " has-data";
          html += '<div class="' + cls + '" title="' + ds + (hasData ? " 学习了" + logs[ds].timeMinutes + "分钟" : "") + '">' + date + "</div>";
          date++;
        }
      }
      html += "</div>";
      if (date > daysInMonth) break;
    }
    html += "</div>";
    return html;
  },

  renderRecentLogs(dates, logs) {
    if (dates.length === 0) return '<div class="empty-state" style="padding:20px"><p>还没有学习记录，快去练习吧！</p></div>';
    var recent = dates.slice(-7).reverse();
    var html = '<table style="width:100%;font-size:13px">';
    html += "<tr style='border-bottom:1px solid var(--border)'><th style='text-align:left;padding:6px'>日期</th><th style='padding:6px'>题量</th><th style='padding:6px'>正确率</th><th style='padding:6px'>时长</th></tr>";
    recent.forEach(function(d) {
      var log = logs[d];
      var rate = log.questionsDone > 0 ? Math.round(log.correct / log.questionsDone * 100) : 0;
      html += "<tr style='border-bottom:1px solid var(--border)'>" +
        "<td style='padding:6px'>" + d + " " + Utils.dayOfWeek(d) + "</td>" +
        "<td style='text-align:center;padding:6px'>" + log.questionsDone + "题</td>" +
        "<td style='text-align:center;padding:6px'>" + rate + "%</td>" +
        "<td style='text-align:center;padding:6px'>" + Utils.formatHour(log.timeMinutes) + "</td></tr>";
    });
    html += "</table>";
    return html;
  }
};