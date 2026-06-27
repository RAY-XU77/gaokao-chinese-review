// views/mistake-book.js - 错题本
Views.mistakeBook = {
  render() {
    var app = document.getElementById("app");
    var mistakes = Store.getMistakes();
    var answers = Store.getUserAnswers();
    var mistakeIds = Object.keys(mistakes);
    var filterModule = this._filterModule || "all";

    if (mistakeIds.length === 0) {
      app.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><h3>暂无错题</h3><p>继续保持，你的错题本还是空的！</p></div>';
      return;
    }

    // 按模块筛选
    var filtered = mistakeIds.filter(function(id) {
      if (filterModule === "all") return true;
      return id.startsWith(filterModule);
    });

    // 按未掌握优先排序
    filtered.sort(function(a, b) {
      var ma = mistakes[a], mb = mistakes[b];
      if (ma.mastered !== mb.mastered) return ma.mastered ? 1 : -1;
      return new Date(mb.addedAt) - new Date(ma.addedAt);
    });

    var html = [
      '<h2 class="page-title">错题本</h2>',
      '<p class="page-subtitle">共 ' + mistakeIds.length + ' 道错题，未掌握 ' + mistakeIds.filter(function(id) { return !mistakes[id].mastered; }).length + " 道</p>",

      '<div class="mistake-filters">',
      '<button class="btn btn-sm ' + (filterModule === "all" ? "btn-primary" : "btn-outline") + '" onclick="Views.mistakeBook.filter(\'all\')">全部</button>'
    ];

    Modules.forEach(function(m) {
      var count = mistakeIds.filter(function(id) { return id.startsWith(m.id) && !mistakes[id].mastered; }).length;
      if (count > 0) {
        html.push('<button class="btn btn-sm ' + (filterModule === m.id ? "btn-primary" : "btn-outline") + '" onclick="Views.mistakeBook.filter(\'' + m.id + '\')">' + m.name + " (" + count + ")</button>");
      }
    });

    html.push("</div>");

    if (filtered.length === 0) {
      html.push('<div class="empty-state"><h3>该模块暂无错题</h3></div>');
    } else {
      filtered.forEach(function(qId) {
        var m = mistakes[qId];
        var a = answers[qId] || { answer: "?", correct: false };
        var mod = getModule(qId.slice(0, 3));

        html.push('<div class="mistake-item">');
        html.push('<div class="mi-header"><span class="tag tag-primary">' + mod.name + '</span><span>' + (m.mastered ? "<span class=\"tag tag-easy\">已掌握</span>" : "<span class=\"tag tag-medium\">待复习</span>") + "</span></div>");

        // 显示题目内容
        var qData = findMistakeQuestion(qId);
        if (qData) {
          html.push('<div class="mi-question">' + qData.question + "</div>");
        }

        html.push('<div class="mi-answer">你的答案：<span class="your-ans">' + (typeof a.answer === "number" ? String.fromCharCode(65 + a.answer) : a.answer) + '</span> | 正确答案：<span class="corr-ans">' + (qData ? (typeof qData.answer === "number" ? String.fromCharCode(65 + qData.answer) : qData.answer) : "?") + "</span></div>");

        if (qData && qData.explanation) {
          html.push('<div class="explanation" style="margin-top:8px"><div class="exp-title">解析</div>' + qData.explanation + "</div>");
        }

        html.push('<div style="display:flex;gap:6px;margin-top:8px">');
        if (!m.mastered) {
          html.push('<button class="btn btn-sm btn-primary" onclick="Views.mistakeBook.markMastered(\'' + qId + '\')">标记已掌握</button>');
        } else {
          html.push('<button class="btn btn-sm btn-outline" onclick="Views.mistakeBook.unmark(\'' + qId + '\')">取消掌握</button>');
        }
        html.push('<button class="btn btn-sm btn-outline" onclick="Views.mistakeBook.remove(\'' + qId + '\')">删除</button>');
        html.push("</div></div>");
      });
    }

    app.innerHTML = html.join("\n");
  },

  filter(moduleId) {
    this._filterModule = moduleId;
    this.render();
  },

  markMastered(qId) {
    Store.markMastered(qId);
    this.render();
  },

  unmark(qId) {
    var m = Store.getMistakes();
    if (m[qId]) { m[qId].mastered = false; localStorage.setItem("yuwen_mistakes", JSON.stringify(m)); }
    this.render();
  },

  remove(qId) {
    Store.removeMistake(qId);
    this.render();
  }
};

// 辅助函数：在题目数据中查找
function findMistakeQuestion(qId) {
  var qmap = { m01: window.Q01, m02: window.Q02, m03: window.Q03, m04: window.Q04, m05: window.Q05,
    m06: window.Q06, m07: window.Q07, m08: window.Q08, m09: window.Q09, m10: window.Q10 };
  var mid = qId.slice(0, 3);
  var qs = qmap[mid];
  if (!qs) return null;
  for (var i = 0; i < qs.length; i++) {
    if (qs[i].id === qId) return qs[i];
    if (qs[i].questions) {
      for (var j = 0; j < qs[i].questions.length; j++) {
        if (qs[i].id + "_" + j === qId) return qs[i].questions[j];
      }
    }
  }
  return null;
}