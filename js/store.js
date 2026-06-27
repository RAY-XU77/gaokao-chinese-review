// store.js - localStorage 数据管理
const Store = {
  _prefix: 'yuwen_',

  _key(k) { return this._prefix + k; },

  get(key, def) {
    try {
      const d = JSON.parse(localStorage.getItem(this._key(key)));
      return d !== null ? d : def;
    } catch { return def; }
  },

  set(key, val) {
    localStorage.setItem(this._key(key), JSON.stringify(val));
  },

  // 作答记录: { qId: { answer, correct, time, date } }
  getUserAnswers() { return this.get('answers', {}); },
  saveAnswer(qId, answer, correct, time) {
    const a = this.getUserAnswers();
    a[qId] = { answer, correct, time: time || 0, date: new Date().toISOString().slice(0,10) };
    this.set('answers', a);
  },

  // 错题本: { qId: { addedAt, reviewed, mastered } }
  getMistakes() { return this.get('mistakes', {}); },
  addMistake(qId) {
    const m = this.getMistakes();
    if (!m[qId]) m[qId] = { addedAt: new Date().toISOString().slice(0,10), reviewed: 0, mastered: false };
    this.set('mistakes', m);
  },
  markReviewed(qId) {
    const m = this.getMistakes();
    if (m[qId]) { m[qId].reviewed++; this.set('mistakes', m); }
  },
  markMastered(qId) {
    const m = this.getMistakes();
    if (m[qId]) { m[qId].mastered = true; this.set('mistakes', m); }
  },
  removeMistake(qId) {
    const m = this.getMistakes();
    delete m[qId];
    this.set('mistakes', m);
  },

  // 模拟考试记录
  getMockExams() { return this.get('mockExams', []); },
  addMockExam(record) {
    const e = this.getMockExams();
    record.id = Date.now();
    e.push(record);
    this.set('mockExams', e);
  },

  // 每日学习记录
  getDailyLogs() { return this.get('dailyLogs', {}); },
  logStudy(date, qCount, correct, minutes, modules) {
    const d = this.getDailyLogs();
    if (d[date]) {
      d[date].questionsDone += qCount;
      d[date].correct += correct;
      d[date].timeMinutes += minutes;
      d[date].modules = [...new Set([...d[date].modules, ...modules])];
    } else {
      d[date] = { questionsDone: qCount, correct, timeMinutes: minutes, modules };
    }
    this.set('dailyLogs', d);
  },

  // 设置
  getSettings() { return this.get('settings', { targetScore: 125, dailyGoal: 30 }); },
  saveSettings(s) { this.set('settings', s); },

  // 统计
  calcStats() {
    const answers = this.getUserAnswers();
    const mistakes = this.getMistakes();
    const total = Object.keys(answers).length;
    const correct = Object.values(answers).filter(a => a.correct).length;
    const rate = total > 0 ? (correct / total * 100).toFixed(1) : 0;

    // 各模块统计
    const moduleStats = {};
    const modules = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10'];
    modules.forEach(m => {
      const qs = Object.entries(answers).filter(([id]) => id.startsWith(m));
      const tot = qs.length;
      const cor = qs.filter(([,a]) => a.correct).length;
      moduleStats[m] = { total: tot, correct: cor, rate: tot > 0 ? (cor/tot*100).toFixed(1) : 0 };
    });

    // 找出最薄弱模块（正确率最低）
    const weak = modules
      .map(m => ({ id: m, ...moduleStats[m] }))
      .filter(m => m.total > 0)
      .sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate));

    return { total, correct, wrong: total - correct, rate, moduleStats, weak: weak.slice(0, 3) };
  }
};