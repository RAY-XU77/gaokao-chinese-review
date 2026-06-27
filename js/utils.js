// utils.js - 工具函数
const Utils = {
  // 格式化时间 (秒 -> MM:SS)
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  },

  // 格式化小时
  formatHour(minutes) {
    if (minutes < 60) return minutes + '分钟';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h + '小时' + (m ? m + '分钟' : '');
  },

  // 今日日期
  today() { return new Date().toISOString().slice(0,10); },

  // 星期几
  dayOfWeek(dateStr) {
    const days = ['日','一','二','三','四','五','六'];
    return '周' + days[new Date(dateStr).getDay()];
  },

  // 获取模块信息
  getModuleInfo(id) {
    const infos = {
      m01: { name: '信息类文本阅读', icon: '\uD83D\uDCD6', color: '#2563eb', full: 19 },
      m02: { name: '文学类文本阅读', icon: '\uD83D\uDCDA', color: '#7c3aed', full: 16 },
      m03: { name: '文言文阅读', icon: '\uD83D\uDCDC', color: '#b45309', full: 20 },
      m04: { name: '古代诗歌阅读', icon: '\uD83C\uDFB6', color: '#0891b2', full: 9 },
      m05: { name: '名篇名句默写', icon: '\u270D\uFE0F', color: '#059669', full: 6 },
      m06: { name: '成语/词语运用', icon: '\uD83D\uDCD8', color: '#d97706', full: 3 },
      m07: { name: '病句修改', icon: '\uD83D\uDD27', color: '#dc2626', full: 3 },
      m08: { name: '语句衔接与补写', icon: '\uD83D\uDCC3', color: '#0891b2', full: 6 },
      m09: { name: '修辞/句式/压缩', icon: '\uD83C\uDFA8', color: '#db2777', full: 6 },
      m10: { name: '写作', icon: '\u270F\uFE0F', color: '#1f2937', full: 60 },
    };
    return infos[id] || { name: id, icon: '\u2753', color: '#6b7280', full: 0 };
  },

  // 难度标签
  difficultyLabel(d) {
    return ['基础','进阶','冲刺'][d-1] || '基础';
  },
  difficultyTag(d) {
    return ['tag-easy','tag-medium','tag-hard'][d-1] || 'tag-easy';
  },

  // 渲染进度条
  renderProgress(rate, barOnly) {
    const p = Math.min(rate, 100);
    const html = '<div class="progress-bar"><div class="progress-fill" style="width:'+p+'%"></div></div>';
    if (barOnly) return html;
    return '<div class="flex-between"><span class="mc-stats">正确率 ' + p + '%</span>' + html + '</div>';
  },

  // 随机打乱数组
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // 根据难度过滤题目
  filterByDifficulty(questions, diff) {
    return questions.filter(q => q.difficulty === diff);
  },

  // 题目文本中的填空占位符
  fillBlanks(text, answer) {
    return text.replace(/_{3,}/g, answer || '______');
  }
};