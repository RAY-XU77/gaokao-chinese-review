// views/mock-exam.js - 模拟考试
Views.mockExam = {
  state: {
    started: false,
    finished: false,
    timeLeft: 9000, // 150分钟 = 9000秒
    timerId: null,
    sectionIndex: 0,
    allQuestions: [],
    answers: {},
    scores: {}
  },

  render() {
    var app = document.getElementById("app");
    var prev = Store.getMockExams();
    var lastExam = prev.length > 0 ? prev[prev.length - 1] : null;

    app.innerHTML = [
      '<h2 class="page-title">模拟考试</h2>',
      '<p class="page-subtitle">完整 150 分钟限时模考，按真实新课标I/II卷结构组卷</p>',
      lastExam ? '<div class="card mb-4"><div style="font-weight:600">上次模考</div><div style="font-size:28px;font-weight:700;color:var(--primary);margin:8px 0">' + lastExam.total + "分</div><div style=\"font-size:13px;color:var(--text-secondary)\">" + lastExam.date + " | 用时 " + Utils.formatTime(lastExam.timeUsed) + "</div></div>" : "",

      '<div class="card mb-4"><div style="font-weight:600;margin-bottom:12px">试卷结构</div>',
      '<div style="font-size:14px;line-height:1.8">',
      "<p><strong>现代文阅读</strong>（35分）—— 信息类文本 + 文学类文本</p>",
      "<p><strong>古代诗文阅读</strong>（35分）—— 文言文 + 诗歌 + 默写</p>",
      "<p><strong>语言文字运用</strong>（20分）—— 成语、病句、衔接、修辞等</p>",
      "<p><strong>写作</strong>（60分）—— 材料作文</p>",
      "</div></div>",

      '<div style="text-align:center;padding:20px">',
      '<button class="btn btn-primary" onclick="Views.mockExam.startExam()" style="font-size:18px;padding:14px 32px">开始模拟考试</button>',
      '<p style="font-size:13px;color:var(--text-secondary);margin-top:8px">考试时间150分钟，请准备好纸笔</p>',
      "</div>"
    ].join("\n");
  },

  startExam() {
    var self = this;
    self.state = {
      started: true,
      finished: false,
      timeLeft: 9000,
      timerId: null,
      sectionIndex: 0,
      allQuestions: [],
      answers: {},
      scores: {}
    };

    // 从各模块抽题组卷
    var exam = this.buildExam();

    var app = document.getElementById("app");
    app.innerHTML = [
      '<div class="mock-exam-timer" id="exam-timer">' + Utils.formatTime(9000) + '</div>',
      '<div id="exam-content"></div>',
      '<div style="text-align:center;margin-top:16px">',
      '<button class="btn btn-outline" onclick="if(confirm(\'确定要交卷吗？\'))Views.mockExam.submitExam()">交卷</button>',
      "</div>"
    ].join("\n");

    self.state.allQuestions = exam;
    self.renderSection();

    self.state.timerId = setInterval(function() {
      self.state.timeLeft--;
      var timerEl = document.getElementById("exam-timer");
      if (timerEl) {
        timerEl.textContent = Utils.formatTime(self.state.timeLeft);
        timerEl.classList.toggle("warning", self.state.timeLeft < 600);
      }
      if (self.state.timeLeft <= 0) {
        clearInterval(self.state.timerId);
        self.submitExam();
      }
    }, 1000);
  },

  buildExam() {
    var exam = [];
    var modOrder = ["m01","m02","m03","m04","m05","m06","m07","m08","m09","m10"];

    modOrder.forEach(function(mid) {
      var qmap = { m01: window.Q01, m02: window.Q02, m03: window.Q03, m04: window.Q04, m05: window.Q05,
        m06: window.Q06, m07: window.Q07, m08: window.Q08, m09: window.Q09, m10: window.Q10 };
      var qs = qmap[mid];
      if (qs && qs.length > 0) {
        // 每个模块抽选部分题目
        var sampleSize = Math.min(qs.length, mid === "m05" ? 6 : (mid === "m10" ? 1 : Math.min(5, qs.length)));
        var picked = Utils.shuffle(qs).slice(0, sampleSize);
        exam = exam.concat(picked.map(function(q) {
          q._examModule = mid;
          return q;
        }));
      }
    });

    return exam;
  },

  renderSection() {
    var q = this.state.allQuestions[this.state.sectionIndex];
    if (!q) {
      this.submitExam();
      return;
    }

    var mod = getModule(q._examModule);
    var container = document.getElementById("exam-content");

    var html = '<div class="mock-exam-section">';
    html += '<div class="section-title">' + mod.name + "</div>";

    if (q.passage) {
      html += '<div class="practice-passage">' + q.passage + "</div>";
      html += q.questions.map(function(sq, si) {
        return renderExamQuestion(sq, q.id + "_e_" + si, si + 1, q.questions.length, mod.name);
      }).join("");
    } else {
      html += renderExamQuestion(q, q.id, 1, 1, mod.name);
    }

    html += "</div>";
    container.innerHTML = html;

    // 给所有选项绑定事件
    container.querySelectorAll(".option-item").forEach(function(el) {
      el.addEventListener("click", function() {
        var optIdx = parseInt(this.dataset.opt);
        var qId = this.dataset.qid;
        var qData = findExamQuestion(qId);

        // 取消同组选中
        this.parentElement.querySelectorAll(".option-item").forEach(function(o) {
          o.classList.remove("selected");
        });
        this.classList.add("selected");

        if (qData) {
          var correct = optIdx === qData.answer;
          Views.mockExam.state.answers[qId] = { answer: optIdx, correct: correct };

          // 自动显示解析
          var expEl = document.getElementById("exp_e_" + qId);
          if (expEl) {
            expEl.classList.remove("hidden");
            expEl.querySelector(".exp-text").textContent = qData.explanation || "";
          }
        }
      });
    });

    // fill 题提交
    container.querySelectorAll(".fill-input").forEach(function(el) {
      el.addEventListener("blur", function() {
        var qId = this.dataset.qid;
        var qData = findExamQuestion(qId);
        if (qData) {
          var correct = this.value.trim() === qData.answer;
          Views.mockExam.state.answers[qId] = { answer: this.value.trim(), correct: correct };
        }
      });
    });

    // 下一题按钮
    var self = this;
    var navHtml = '<div style="display:flex;justify-content:space-between;margin-top:16px">';
    if (self.state.sectionIndex > 0) {
      navHtml += '<button class="btn btn-outline" onclick="Views.mockExam.prevSection()">上一题</button>';
    } else {
      navHtml += "<div></div>";
    }
    navHtml += '<button class="btn btn-primary" onclick="Views.mockExam.nextSection()">下一题 →</button>';
    navHtml += "</div>";
    container.innerHTML += navHtml;
  },

  nextSection() {
    this.state.sectionIndex++;
    this.renderSection();
    window.scrollTo(0, 0);
  },

  prevSection() {
    if (this.state.sectionIndex > 0) {
      this.state.sectionIndex--;
      this.renderSection();
      window.scrollTo(0, 0);
    }
  },

  submitExam() {
    if (this.state.finished) return;
    this.state.finished = true;
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
      this.state.timerId = null;
    }

    var answers = this.state.answers;
    var totalQ = Object.keys(answers).length;
    var correctQ = Object.values(answers).filter(function(a) { return a.correct; }).length;
    var usedTime = 9000 - this.state.timeLeft;

    // 模拟计分
    var rawScore = totalQ > 0 ? Math.round(correctQ / totalQ * 150) : 0;
    var finalScore = Math.min(Math.max(rawScore, 0), 150);

    // 记录
    Store.addMockExam({
      date: Utils.today(),
      total: finalScore,
      correct: correctQ,
      totalQ: totalQ,
      timeUsed: usedTime
    });

    Store.logStudy(Utils.today(), totalQ, correctQ, Math.round(usedTime / 60), ["exam"]);

    var app = document.getElementById("app");
    app.innerHTML = [
      '<div class="card text-center" style="padding:40px">',
      "<h2>考试结束</h2>",
      '<div style="font-size:56px;font-weight:700;color:var(--primary);margin:16px 0">' + finalScore + "分</div>",
      '<div style="font-size:16px;color:var(--text-secondary)">模拟得分（基于客观题自动评分，主观题请对照标准自评）</div>',
      '<div style="margin:12px 0;font-size:14px">答对 ' + correctQ + "/" + totalQ + " 题 | 用时 " + Utils.formatTime(usedTime) + "</div>",

      '<div class="progress-bar" style="max-width:300px;margin:16px auto;height:8px">',
      '<div class="progress-fill" style="width:' + Math.round(finalScore / 150 * 100) + '%;height:8px"></div></div>',

      '<div style="color:var(--text-secondary);font-size:14px">',
      finalScore >= 125 ? '<p style="color:var(--success);font-weight:600">👍 已达目标分！继续保持</p>' :
      '<p>💪 距离125分目标还差 ' + (125 - finalScore) + "分，继续加油！</p>",
      "</div>",

      '<div style="display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap">',
      '<button class="btn btn-primary" onclick="Views.mockExam.startExam()">再考一次</button>',
      '<button class="btn btn-outline" onclick="Router.navigate(\'analytics\')">查看成绩分析</button>',
      '<button class="btn btn-outline" onclick="Router.navigate(\'mistakes\')">查看错题</button>',
      "</div></div>"
    ].join("\n");
  }
};

function renderExamQuestion(q, qId, num, total, modName) {
  var html = '<div class="question-block" data-qid="' + qId + '">';
  if (total > 1) html += '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">' + modName + " 第" + num + "题</div>";
  html += '<div class="question-text">' + q.question + "</div>";

  if (q.type === "fill") {
    html += '<textarea class="fill-input" data-qid="' + qId + '" rows="2" placeholder="请输入答案..."></textarea>';
  } else if (q.options) {
    html += '<div class="options-list">';
    q.options.forEach(function(opt, oi) {
      var label = String.fromCharCode(65 + oi);
      html += '<div class="option-item" data-qid="' + qId + '" data-opt="' + oi + '">' +
        '<span class="option-label">' + label + ".</span> " + opt.replace(/^[A-Z][.、．]\s*/, "") +
        "</div>";
    });
    html += "</div>";
  }

  html += '<div class="explanation hidden" id="exp_e_' + qId + '"><div class="exp-title">解析</div><div class="exp-text"></div></div>';
  html += "</div>";
  return html;
}

function findExamQuestion(qId) {
  var qs = Views.mockExam.state.allQuestions;
  for (var i = 0; i < qs.length; i++) {
    if (qs[i].id === qId) return qs[i];
    if (qs[i].questions) {
      for (var j = 0; j < qs[i].questions.length; j++) {
        if (qs[i].id + "_e_" + j === qId) return qs[i].questions[j];
      }
    }
  }
  return null;
}