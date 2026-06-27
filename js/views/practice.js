// views/practice.js - 答题练习页
(function() {
  // 当前练习状态
  let state = {
    moduleId: "",
    mode: "all",    // all | easy | medium | hard | timed
    questions: [],
    currentIndex: 0,
    answered: false,
    results: { total: 0, correct: 0 },
    timerId: null,
    timeLeft: 0,
    startTime: 0,
    passageGroup: null  // 当前正在做的 passage 组
  };

  // 获取题目函数（在 question data 加载后调用）
  function getQuestions(modId) {
    var qmap = {
      m01: window.Q01,
      m02: window.Q02,
      m03: window.Q03,
      m04: window.Q04,
      m05: window.Q05,
      m06: window.Q06,
      m07: window.Q07,
      m08: window.Q08,
      m09: window.Q09,
      m10: window.Q10
    };
    return qmap[modId] || [];
  }

  // 渲染单个问题
  function renderQuestion(q, index, total) {
    var mod = getModule(state.moduleId);
    var html = "";
    var diffTag = ["tag-easy","tag-medium","tag-hard"][q.difficulty-1] || "tag-easy";
    var diffLabel = ["基础","进阶","冲刺"][q.difficulty-1] || "基础";

    // 进度
    html += '<div class="practice-progress">第 ' + (index+1) + ' / ' + total + ' 题 <span class="tag ' + diffTag + '">' + diffLabel + "</span></div>";

    // 如果是 passage 类型
    if (q.passage) {
      html += '<div class="practice-passage">' + q.passage + "</div>";
      // 渲染该 passage 下的所有子题
      html += q.questions.map(function(sq, si) {
        return renderSingleQuestion(sq, q.id + "_" + si, si + 1, q.questions.length);
      }).join("");
    } else {
      // 独立题目
      html += renderSingleQuestion(q, q.id, 1, 1);
    }

    return html;
  }

  function renderSingleQuestion(q, qId, num, total) {
    var html = '<div class="question-block" data-qid="' + qId + '">';
    if (total > 1) html += '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px">小题 ' + num + "/" + total + "</div>";
    html += '<div class="question-text">' + q.question + "</div>";

    if (q.type === "fill") {
      html += '<textarea class="fill-input" rows="3" placeholder="请输入答案..."></textarea>';
    } else if (q.options) {
      html += '<div class="options-list">';
      q.options.forEach(function(opt, oi) {
        var label = String.fromCharCode(65 + oi);
        html += '<div class="option-item" data-opt="' + oi + '" onclick="Views.practice.selectOption(this, \'' + qId + '\', ' + oi + ')">' +
          '<span class="option-label">' + label + ".</span> " + opt.replace(/^[A-Z][.、．]\s*/, "") +
          "</div>";
      });
      html += "</div>";
    }

    html += '<div class="explanation hidden" id="exp_' + qId + '"><div class="exp-title">解析</div><div class="exp-text"></div></div>';
    html += "</div>";
    return html;
  }

  Views.practice = {
    render(moduleId) {
      state.moduleId = moduleId;
      var mod = getModule(moduleId);
      var allQuestions = getQuestions(moduleId);
      if (!allQuestions || allQuestions.length === 0) {
        document.getElementById("app").innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><h3>暂无题目数据</h3><p>' + mod.name + "的题目正在加载中</p></div>";
        return;
      }

      state.questions = Utils.shuffle(allQuestions);
      state.currentIndex = 0;
      state.answered = false;
      state.results = { total: 0, correct: 0 };
      state.mode = "all";
      state.passageGroup = null;

      var app = document.getElementById("app");
      app.innerHTML = [
        '<div class="flex-between" style="margin-bottom:16px">',
        '<div><h2 class="page-title" style="margin-bottom:0">' + mod.name + '</h2><p class="page-subtitle" style="margin-bottom:0">选择练习模式</p></div>',
        '<button class="btn btn-outline" onclick="Router.navigate(\'knowledge\',\'' + moduleId + '\')">📖 知识点</button>',
        "</div>",
        '<div class="mode-selector">',
        '<button class="mode-btn active" data-mode="all" onclick="Views.practice.setMode(\'all\')">全部题目</button>',
        '<button class="mode-btn" data-mode="easy" onclick="Views.practice.setMode(\'easy\')">🌟 基础</button>',
        '<button class="mode-btn" data-mode="medium" onclick="Views.practice.setMode(\'medium\')">⭐⭐ 进阶</button>',
        '<button class="mode-btn" data-mode="hard" onclick="Views.practice.setMode(\'hard\')">⭐⭐⭐ 冲刺</button>',
        '<button class="mode-btn" data-mode="timed" onclick="Views.practice.setMode(\'timed\')">⏱ 计时闯关</button>',
        "</div>",
        '<div id="practice-content"></div>'
      ].join("\n");

      this.startPractice();
    },

    setMode(mode) {
      state.mode = mode;
      document.querySelectorAll(".mode-btn").forEach(function(b) {
        b.classList.toggle("active", b.dataset.mode === mode);
      });
      this.startPractice();
    },

    startPractice() {
      var allQ = getQuestions(state.moduleId);
      if (!allQ || allQ.length === 0) return;

      if (state.mode === "timed") {
        // 计时模式：随机选10题，限时10分钟
        state.questions = Utils.shuffle(allQ).slice(0, 10);
      } else if (state.mode === "easy") {
        state.questions = Utils.shuffle(allQ.filter(function(q) { return q.difficulty === 1; }));
      } else if (state.mode === "medium") {
        state.questions = Utils.shuffle(allQ.filter(function(q) { return q.difficulty === 2; }));
      } else if (state.mode === "hard") {
        state.questions = Utils.shuffle(allQ.filter(function(q) { return q.difficulty === 3; }));
      } else {
        state.questions = Utils.shuffle(allQ);
      }

      if (state.questions.length === 0) {
        document.getElementById("practice-content").innerHTML = '<div class="empty-state"><h3>该难度暂无题目</h3></div>';
        return;
      }

      state.currentIndex = 0;
      state.answered = false;
      state.results = { total: 0, correct: 0 };
      state.passageGroup = null;

      if (state.mode === "timed") {
        state.timeLeft = 600; // 10分钟
        state.timerId = setInterval(function() {
          state.timeLeft--;
          var timerEl = document.getElementById("timed-timer-display");
          if (timerEl) {
            timerEl.textContent = Utils.formatTime(state.timeLeft);
            timerEl.classList.toggle("warning", state.timeLeft < 60);
          }
          if (state.timeLeft <= 0) {
            clearInterval(state.timerId);
            Views.practice.finishPractice();
          }
        }, 1000);
      }

      this.showQuestion();
    },

    showQuestion() {
      if (state.currentIndex >= state.questions.length) {
        this.finishPractice();
        return;
      }

      state.answered = false;
      var q = state.questions[state.currentIndex];
      var container = document.getElementById("practice-content");

      var header = "";
      if (state.mode === "timed") {
        if (!document.getElementById("timed-timer")) {
          container.innerHTML = '<div id="timed-timer" class="timed-timer"><span>计时闯关</span><span class="timer-display" id="timed-timer-display">' + Utils.formatTime(state.timeLeft) + "</span></div><div id=\"question-area\"></div>";
        }
        document.getElementById("question-area").innerHTML = renderQuestion(q, state.currentIndex, state.questions.length);
      } else {
        container.innerHTML = renderQuestion(q, state.currentIndex, state.questions.length);
      }

      // 滚动到顶部
      window.scrollTo(0, 0);
    },

    selectOption(el, qId, optIndex) {
      if (state.answered) return;
      state.answered = true;

      // 找到对应的题目数据
      var q = findQuestion(qId);
      if (!q) return;

      // 高亮选择
      var parent = el.parentElement;
      parent.querySelectorAll(".option-item").forEach(function(o) { o.classList.add("disabled"); });
      el.classList.add("selected");

      // 判题
      var correct = optIndex === q.answer;
      var correctEl = parent.querySelector('[data-opt="' + q.answer + '"]');
      if (correctEl) correctEl.classList.add("correct");
      if (!correct) el.classList.add("wrong");

      // 记录
      Store.saveAnswer(qId, optIndex, correct, 0);
      if (!correct) Store.addMistake(qId);
      state.results.total++;
      if (correct) state.results.correct++;
      Store.logStudy(Utils.today(), 1, correct ? 1 : 0, 0, [state.moduleId]);

      // 显示解析
      showExplanation(qId, q.explanation);

      // 自动进入下一题
      var self = this;
      setTimeout(function() {
        if (state.mode === "timed" && state.timerId) {
          // timed 模式下手动控制
        }
        state.currentIndex++;
        self.showQuestion();
      }, 1200);
    },

    submitFill(qId) {
      if (state.answered) return;
      state.answered = true;

      var q = findQuestion(qId);
      if (!q) return;

      var input = document.querySelector('[data-qid="' + qId + '"] .fill-input');
      if (!input) return;
      var userAns = input.value.trim();
      input.classList.add(userAns === q.answer ? "correct" : "wrong");

      var correct = userAns === q.answer;
      Store.saveAnswer(qId, userAns, correct, 0);
      if (!correct) Store.addMistake(qId);
      state.results.total++;
      if (correct) state.results.correct++;
      Store.logStudy(Utils.today(), 1, correct ? 1 : 0, 0, [state.moduleId]);

      showExplanation(qId, q.explanation);
    },

    finishPractice() {
      if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }

      var mod = getModule(state.moduleId);
      var total = state.results.total;
      var correct = state.results.correct;
      var rate = total > 0 ? Math.round(correct / total * 100) : 0;

      document.getElementById("practice-content").innerHTML = [
        '<div class="card text-center" style="padding:40px">',
        '<div style="font-size:48px;margin-bottom:12px">' + (rate >= 80 ? "🎉" : rate >= 50 ? "👍" : "💪") + "</div>",
        "<h3>本次练习完成！</h3>",
        '<div style="font-size:36px;font-weight:700;color:var(--primary);margin:12px 0">' + correct + "/" + total + "</div>",
        '<div style="font-size:18px;color:var(--text-secondary)">正确率 ' + rate + "%</div>",
        '<div class="progress-bar" style="max-width:300px;margin:16px auto;height:8px">',
        '<div class="progress-fill" style="width:' + rate + '%;height:8px;border-radius:4px"></div></div>',
        '<div style="display:flex;gap:8px;justify-content:center;margin-top:20px">',
        '<button class="btn btn-primary" onclick="Views.practice.startPractice()">再练一次</button>',
        '<button class="btn btn-outline" onclick="Router.navigate(\'modules\')">返回模块列表</button>',
        '<button class="btn btn-outline" onclick="Router.navigate(\'mistakes\')">查看错题</button>',
        "</div></div>"
      ].join("\n");
    }
  };

  // 根据题目ID查找题目数据
  function findQuestion(qId) {
    var allQ = getQuestions(state.moduleId);
    if (!allQ) return null;

    // 先找独立题目
    for (var i = 0; i < allQ.length; i++) {
      if (allQ[i].id === qId) return allQ[i];
      // 再找 passage 下的子题
      if (allQ[i].questions) {
        for (var j = 0; j < allQ[i].questions.length; j++) {
          var subId = allQ[i].id + "_" + j;
          if (subId === qId) return allQ[i].questions[j];
        }
      }
    }
    return null;
  }

  function showExplanation(qId, explanation) {
    var el = document.getElementById("exp_" + qId);
    if (el) {
      el.classList.remove("hidden");
      el.querySelector(".exp-text").textContent = explanation || "解析正在更新...";
    }
  }
})();