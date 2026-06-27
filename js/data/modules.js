// modules.js - 模块元数据
const Modules = [
  { id: 'm01', name: '信息类文本阅读', icon: '\uD83D\uDCD6', desc: '论述类/实用类/科普类多材料阅读', fullScore: 19, count: 40 },
  { id: 'm02', name: '文学类文本阅读', icon: '\uD83D\uDCDA', desc: '小说/散文阅读理解与鉴赏', fullScore: 16, count: 40 },
  { id: 'm03', name: '文言文阅读', icon: '\uD83D\uDCDC', desc: '断句/文化常识/翻译/内容理解', fullScore: 20, count: 50 },
  { id: 'm04', name: '古代诗歌阅读', icon: '\uD83C\uDFB6', desc: '诗/词/曲鉴赏分析', fullScore: 9, count: 40 },
  { id: 'm05', name: '名篇名句默写', icon: '\u270D\uFE0F', desc: '新课标必背篇目情景式默写', fullScore: 6, count: 200 },
  { id: 'm06', name: '成语/词语运用', icon: '\uD83D\uDCD8', desc: '近义成语与词语辨析', fullScore: 3, count: 60 },
  { id: 'm07', name: '病句修改', icon: '\uD83D\uDD27', desc: '六大病句类型辨析修改', fullScore: 3, count: 60 },
  { id: 'm08', name: '语句衔接与补写', icon: '\uD83D\uDCC3', desc: '句子复位与语境补写', fullScore: 6, count: 50 },
  { id: 'm09', name: '修辞/句式/压缩', icon: '\uD83C\uDFA8', desc: '修辞辨析/句式变换/语段压缩', fullScore: 6, count: 50 },
  { id: 'm10', name: '写作', icon: '\u270F\uFE0F', desc: '材料作文审题立意与范文', fullScore: 60, count: 30 }
];

// 获取模块信息
function getModule(id) {
  return Modules.find(m => m.id === id) || { id, name: id, icon: '?', desc: '', fullScore: 0, count: 0 };
}