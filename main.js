'use strict';

var obsidian = require('obsidian');

/* ===================================================
   Mandala Chart Plugin for Obsidian  v2.0.9
   Supports: Japanese, English, 中文, 한국어, Español
   =================================================== */

const VIEW_TYPE_MANDALA = 'mandala-chart-view';

// ======================================================
// i18n — Language strings
// ======================================================
const I18N = {
  ja: {
    ribbonTitle:  'マンダラチャートを開く',
    cmdOpen:      'マンダラチャートを開く',
    cmdInsert:    'マンダラチャートをノートに挿入',
    displayText:  'マンダラチャート',
    back:         '← 全体表示',
    print:        '🖨 印刷',
    mainGoal:     'メインゴール',
    theme:        'テーマ',
    themeName:    'テーマ名',
    editThemeName:'✏ テーマ名',
    idea:         'アイデア',
    save:         '保存',
    cancel:       'キャンセル',
    clickEdit:    'クリックして編集',
    clickDetail:  'クリックして詳細表示',
    errNoFile:    '[Mandala] ファイルが見つかりません',
    errSave:      '[Mandala] 保存に失敗: ',
    errPrint:     '印刷ウィンドウを開けませんでした',
    printTitle:   'マンダラチャート',
    tplCenter:    'メインゴール',
    tplTheme:     'テーマ',
    openInView:   '⊞ 全画面で開く',
  },
  en: {
    ribbonTitle:  'Open Mandala Chart',
    cmdOpen:      'Open Mandala Chart',
    cmdInsert:    'Insert Mandala Chart into note',
    displayText:  'Mandala Chart',
    back:         '← Overview',
    print:        '🖨 Print',
    mainGoal:     'Main Goal',
    theme:        'Theme',
    themeName:    'Theme Name',
    editThemeName:'✏ Theme Name',
    idea:         'Idea',
    save:         'Save',
    cancel:       'Cancel',
    clickEdit:    'Click to edit',
    clickDetail:  'Click for details',
    errNoFile:    '[Mandala] File not found',
    errSave:      '[Mandala] Failed to save: ',
    errPrint:     'Could not open print window',
    printTitle:   'Mandala Chart',
    tplCenter:    'Main Goal',
    tplTheme:     'Theme',
    openInView:   '⊞ Open full view',
  },
  zh: {
    ribbonTitle:  '打开曼陀罗图表',
    cmdOpen:      '打开曼陀罗图表',
    cmdInsert:    '在笔记中插入曼陀罗图表',
    displayText:  '曼陀罗图表',
    back:         '← 全览',
    print:        '🖨 打印',
    mainGoal:     '主目标',
    theme:        '主题',
    themeName:    '主题名称',
    editThemeName:'✏ 主题名称',
    idea:         '想法',
    save:         '保存',
    cancel:       '取消',
    clickEdit:    '点击编辑',
    clickDetail:  '点击查看详情',
    errNoFile:    '[Mandala] 找不到文件',
    errSave:      '[Mandala] 保存失败: ',
    errPrint:     '无法打开打印窗口',
    printTitle:   '曼陀罗图表',
    tplCenter:    '主目标',
    tplTheme:     '主题',
    openInView:   '⊞ 全屏打开',
  },
  ko: {
    ribbonTitle:  '만다라 차트 열기',
    cmdOpen:      '만다라 차트 열기',
    cmdInsert:    '노트에 만다라 차트 삽입',
    displayText:  '만다라 차트',
    back:         '← 전체 보기',
    print:        '🖨 인쇄',
    mainGoal:     '메인 목표',
    theme:        '테마',
    themeName:    '테마 이름',
    editThemeName:'✏ 테마 이름',
    idea:         '아이디어',
    save:         '저장',
    cancel:       '취소',
    clickEdit:    '클릭하여 편집',
    clickDetail:  '클릭하여 자세히 보기',
    errNoFile:    '[Mandala] 파일을 찾을 수 없습니다',
    errSave:      '[Mandala] 저장 실패: ',
    errPrint:     '인쇄 창을 열 수 없습니다',
    printTitle:   '만다라 차트',
    tplCenter:    '메인 목표',
    tplTheme:     '테마',
    openInView:   '⊞ 전체 화면으로 열기',
  },
  es: {
    ribbonTitle:  'Abrir gráfico mandala',
    cmdOpen:      'Abrir gráfico mandala',
    cmdInsert:    'Insertar gráfico mandala en nota',
    displayText:  'Gráfico Mandala',
    back:         '← Vista general',
    print:        '🖨 Imprimir',
    mainGoal:     'Objetivo principal',
    theme:        'Tema',
    themeName:    'Nombre del tema',
    editThemeName:'✏ Nombre del tema',
    idea:         'Idea',
    save:         'Guardar',
    cancel:       'Cancelar',
    clickEdit:    'Clic para editar',
    clickDetail:  'Clic para detalles',
    errNoFile:    '[Mandala] Archivo no encontrado',
    errSave:      '[Mandala] Error al guardar: ',
    errPrint:     'No se pudo abrir la ventana de impresión',
    printTitle:   'Gráfico Mandala',
    tplCenter:    'Objetivo principal',
    tplTheme:     'Tema',
    openInView:   '⊞ Abrir a pantalla completa',
  }
};

/** Detect language from Obsidian/browser locale */
function detectLang() {
  try {
    const locale = (window.moment && window.moment.locale())
      || navigator.language || 'en';
    const code = locale.toLowerCase().split(/[-_]/)[0];
    return I18N[code] || I18N.en;
  } catch(e) { return I18N.en; }
}

// ======================================================
// Pastel Rainbow Color Palette
// 時計回り虹色: NW(赤)→N(橙)→NE(黄緑)→E(緑)→SE(青緑)→S(青)→SW(紫)→W(ピンク)
// ======================================================
const COLORS = {
  center: { bg: '#FFF176', text: '#5C4A00', border: '#F9D800' },
  themes: [
    { bg: '#FFBBBB', light: '#FFF5F5', text: '#7B1A1A', border: '#FF7070' },  // 0 NW 赤
    { bg: '#FFD4A0', light: '#FFF7F1', text: '#7B3A00', border: '#FFB050' },  // 1 N  橙
    { bg: '#EEFFB0', light: '#FAFFEE', text: '#3D6B00', border: '#C8FF50' },  // 2 NE 黄緑
    { bg: '#FFB8DC', light: '#FFF1F8', text: '#7B0050', border: '#FF60AA' },  // 3 W  ピンク
    { bg: '#B0FFB8', light: '#F4FFF5', text: '#1A6B1A', border: '#55FF66' },  // 4 E  緑
    { bg: '#CCB0FF', light: '#F5F0FF', text: '#3D1A7B', border: '#9060FF' },  // 5 SW 紫
    { bg: '#B0CCFF', light: '#F0F5FF', text: '#1A3D7B', border: '#5090FF' },  // 6 S  青
    { bg: '#B0FFEE', light: '#F0FFFA', text: '#1A6B58', border: '#50FFCC' },  // 7 SE 青緑
  ]
};

const MINI_GRID_MAP = [[0,1,2],[3,-1,4],[5,6,7]];
const A_GRID_BMAP   = [[0,1,2],[3,-1,4],[5,6,7]];

function getItemIndex(r, c) {
  return {'0,0':0,'0,1':1,'0,2':2,'1,0':3,'1,2':4,'2,0':5,'2,1':6,'2,2':7}[`${r},${c}`];
}
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function makeDefaultData(t) {
  t = t || I18N.en;
  return { center: t.tplCenter, themes: Array.from({length:8},(_,i)=>({ theme:`${t.tplTheme}${i+1}`, items:Array(8).fill('') })) };
}
function normalizeData(raw) {
  const data = (raw && typeof raw==='object') ? raw : {};
  if (typeof data.center!=='string') data.center='';
  data.center = data.center.trim();
  if (!Array.isArray(data.themes)) data.themes=[];
  while (data.themes.length<8) data.themes.push({theme:'',items:Array(8).fill('')});
  for (const t of data.themes) {
    if (typeof t.theme!=='string') t.theme='';
    // テーマ名の前後の改行・空白を除去（誤入力対策）
    t.theme = t.theme.trim();
    if (!Array.isArray(t.items)) t.items=[];
    while (t.items.length<8) t.items.push('');
    t.items = t.items.slice(0,8).map(v=>typeof v==='string'?v:'');
  }
  return data;
}
function parseData(source) {
  try { return normalizeData(JSON.parse(source.trim())); }
  catch(e) { return makeDefaultData(); }
}

// ======================================================
// Edit Modal
// ======================================================
class EditModal extends obsidian.Modal {
  constructor(app, title, value, lang, onSave) {
    super(app);
    this.editTitle=title; this.currentValue=value; this.lang=lang; this.onSave=onSave;
  }
  onOpen() {
    const {contentEl}=this;
    contentEl.createEl('h3',{text:this.editTitle,cls:'mandala-modal-title'});
    const ta=contentEl.createEl('textarea',{cls:'mandala-modal-textarea'});
    ta.value=this.currentValue; ta.rows=5;
    const row=contentEl.createDiv({cls:'mandala-modal-buttons'});
    row.createEl('button',{text:this.lang.cancel,cls:'mandala-modal-cancel'})
       .addEventListener('click',()=>this.close());
    row.createEl('button',{text:this.lang.save,cls:'mandala-modal-save'})
       .addEventListener('click',()=>{this.onSave(ta.value);this.close();});
    ta.addEventListener('keydown',(e)=>{
      if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){this.onSave(ta.value);this.close();}
      if(e.key==='Escape') this.close();
    });
    setTimeout(()=>{ta.focus();ta.select();},30);
  }
  onClose(){this.contentEl.empty();}
}

// ======================================================
// MandalaRenderer — shared rendering for both view types
// ======================================================
class MandalaRenderer {
  constructor(container, data, onSave, app, sourcePath, component, onOpenInView) {
    this.container=container; this.data=data; this.onSave=onSave; this.app=app;
    this.sourcePath=sourcePath||''; this.component=component||null;
    this.onOpenInView=onOpenInView||null;
    this.t=detectLang();
    this.viewMode='overview'; this.focusIdx=-1;
  }

  /** セルに Markdown を描画（#tag / ## 見出し / [[link]] / **bold** 対応）
   *  @param placeholder 空のときに表示する文字（概要: '·', フォーカス: '+'）
   */
  renderCellMd(el, text, placeholder='+') {
    if(!text){
      el.createEl('span',{cls:'mandala-cell-placeholder',text:placeholder});
      return;
    }
    const wrap=el.createDiv({cls:'mandala-cell-md'});
    try {
      obsidian.MarkdownRenderer.render(this.app, text, wrap, this.sourcePath, this.component);
    } catch(e) {
      wrap.createEl('span',{text});
    }
  }

  editCell(title, value, onUpdate) {
    new EditModal(this.app, title, value, this.t, async (v)=>{
      onUpdate(v);
      this.render();              // 先に再描画（即時反映）
      await this.onSave(this.data); // 保存（エラーは onSave 内で Notice 表示）
    }).open();
  }

  render() {
    this.container.empty();
    this.container.classList.add('mandala-container');
    this.buildToolbar(this.container.createDiv({cls:'mandala-toolbar'}));
    const area=this.container.createDiv({cls:'mandala-area'});
    if(this.viewMode==='overview') this.buildOverview(area);
    else this.buildFocus(area);
  }

  buildToolbar(tb) {
    const t=this.t;
    if(this.viewMode==='focus') {
      tb.createEl('button',{text:t.back,cls:'mandala-btn'})
        .addEventListener('click',()=>{this.viewMode='overview';this.render();});
    }
    const crumb=tb.createEl('span',{cls:'mandala-breadcrumb'});
    if(this.viewMode==='focus'){
      const th=this.data.themes[this.focusIdx];
      crumb.textContent=`${this.data.center||t.mainGoal} › ${th.theme||t.theme+(this.focusIdx+1)}`;
    } else {
      crumb.textContent=this.data.center||t.printTitle;
    }
    tb.createDiv({cls:'mandala-spacer'});
    // コードブロック埋め込み時のみ「全画面で開く」ボタンを表示
    if(this.onOpenInView){
      tb.createEl('button',{text:t.openInView,cls:'mandala-btn'})
        .addEventListener('click',()=>this.onOpenInView(this.data));
    }
    tb.createEl('button',{text:t.print,cls:'mandala-btn'})
      .addEventListener('click',()=>this.print());
  }

  buildOverview(area) {
    const grid=area.createDiv({cls:'mandala-overview'});
    for(let mgr=0;mgr<3;mgr++){
      for(let mgc=0;mgc<3;mgc++){
        const ti=MINI_GRID_MAP[mgr][mgc];
        const borderColor=ti===-1?COLORS.center.border:COLORS.themes[ti].border;
        const bgColor=ti===-1?'#FFFDE7':COLORS.themes[ti].light;
        // wrap に border/overflow/radius を持たせる（CSS に依存しない inline style）
        const wrap=grid.createDiv({cls:'mandala-mini-wrap'});
        wrap.style.border=`2px solid ${borderColor}`;
        wrap.style.borderRadius='8px';
        wrap.style.overflow='hidden';
        wrap.style.aspectRatio='1 / 1';
        const mini=wrap.createDiv({cls:'mandala-mini'});
        mini.style.backgroundColor=bgColor;
        if(ti===-1) this.buildAGrid(mini);
        else this.buildBGrid(mini,ti);
      }
    }
  }

  buildAGrid(mini) {
    const t=this.t;
    for(let r=0;r<3;r++){
      for(let c=0;c<3;c++){
        const bi=A_GRID_BMAP[r][c];
        const cell=mini.createDiv({cls:'mandala-cell mandala-cell-circle-host'});
        if(bi===-1){
          cell.style.backgroundColor='#FFFDE7';
          // 中央メインゴールは四角（丸なし）
          const circle=cell.createDiv({cls:'mandala-circle mandala-circle-main mandala-square-main'});
          circle.style.cssText=`background:${COLORS.center.bg};color:${COLORS.center.text};border-color:${COLORS.center.border}`;
          circle.createEl('span',{text:this.data.center||''});
          cell.title=t.clickEdit;
          cell.addEventListener('click',()=>{this.editCell(t.mainGoal,this.data.center,v=>{this.data.center=v;});});
        } else {
          const col=COLORS.themes[bi];
          cell.style.backgroundColor=col.light;
          const circle=cell.createDiv({cls:'mandala-circle mandala-circle-theme'});
          circle.style.cssText=`background:${col.bg};color:${col.text};border-color:${col.border}`;
          circle.createEl('span',{text:this.data.themes[bi].theme||''});
          cell.title=t.clickDetail;
          cell.addEventListener('click',()=>{this.viewMode='focus';this.focusIdx=bi;this.render();});
        }
      }
    }
  }

  buildBGrid(mini, ti) {
    const t=this.t, col=COLORS.themes[ti];
    for(let r=0;r<3;r++){
      for(let c=0;c<3;c++){
        const cell=mini.createDiv({cls:'mandala-cell'});
        if(r===1&&c===1){
          cell.classList.add('mandala-cell-circle-host');
          cell.style.backgroundColor=col.light;
          const circle=cell.createDiv({cls:'mandala-circle mandala-circle-theme'});
          circle.style.cssText=`background:${col.bg};color:${col.text};border-color:${col.border}`;
          circle.createEl('span',{text:this.data.themes[ti].theme||''});
          cell.title=t.clickDetail;
          cell.addEventListener('click',()=>{this.viewMode='focus';this.focusIdx=ti;this.render();});
        } else {
          const ii=getItemIndex(r,c);
          cell.classList.add('mandala-cell-item');
          cell.style.backgroundColor=col.light;
          cell.style.border=`1px solid ${col.border}80`;
          cell.style.borderRadius='3px';
          const txt=this.data.themes[ti].items[ii];
          if(!txt) cell.classList.add('mandala-cell-empty');
          // 概要グリッドにも Markdown 描画を適用（placeholder は小さな '·'）
          this.renderCellMd(cell, txt, '·');
          cell.title=t.clickEdit;
          cell.addEventListener('click',()=>{
            const label=`${this.data.themes[ti].theme||t.theme+(ti+1)} › ${t.idea} ${ii+1}`;
            this.editCell(label,this.data.themes[ti].items[ii],v=>{this.data.themes[ti].items[ii]=v;});
          });
        }
      }
    }
  }

  buildFocus(area) {
    const t=this.t, ti=this.focusIdx, theme=this.data.themes[ti], col=COLORS.themes[ti];
    const hdr=area.createDiv({cls:'mandala-focus-header'});
    hdr.style.borderLeftColor=col.border;
    const title=hdr.createEl('h2',{cls:'mandala-focus-title',text:theme.theme||`${t.theme} ${ti+1}`});
    title.style.color=col.text;
    hdr.createEl('button',{text:t.editThemeName,cls:'mandala-btn mandala-btn-sm'})
       .addEventListener('click',()=>{this.editCell(t.themeName,theme.theme,v=>{this.data.themes[ti].theme=v;});});

    const nav=area.createDiv({cls:'mandala-focus-nav'});
    for(let i=0;i<8;i++){
      const c=COLORS.themes[i];
      const pill=nav.createEl('button',{cls:'mandala-nav-pill'+(i===ti?' is-active':''),text:this.data.themes[i].theme||`T${i+1}`});
      pill.style.cssText=`background:${c.bg};color:${c.text};border-color:${c.border}`;
      if(i===ti) pill.style.boxShadow=`0 0 0 3px ${col.border}`;
      pill.addEventListener('click',()=>{this.focusIdx=i;this.render();});
    }

    const grid=area.createDiv({cls:'mandala-focus-grid'});
    grid.style.backgroundColor=col.light; grid.style.borderColor=col.border;

    for(let r=0;r<3;r++){
      for(let c=0;c<3;c++){
        const cell=grid.createDiv({cls:'mandala-focus-cell'});
        if(r===1&&c===1){
          cell.classList.add('mandala-focus-cell-center');
          cell.style.background=col.bg; cell.style.color=col.text; cell.style.borderColor=col.border;
          cell.createEl('span',{text:theme.theme||`${t.theme} ${ti+1}`});
          cell.addEventListener('click',()=>{this.editCell(t.themeName,theme.theme,v=>{this.data.themes[ti].theme=v;});});
        } else {
          const ii=getItemIndex(r,c);
          cell.classList.add('mandala-focus-cell-item');
          cell.style.borderColor=col.border+'80';
          const txt=theme.items[ii];
          if(!txt) cell.classList.add('is-empty');
          // Markdown 描画（#tag / ## 見出し / [[link]] 対応）
          this.renderCellMd(cell, txt);
          cell.addEventListener('click',()=>{
            this.editCell(`${theme.theme||t.theme} › ${t.idea} ${ii+1}`,theme.items[ii],v=>{this.data.themes[ti].items[ii]=v;});
          });
        }
      }
    }
  }

  print() {
    const html=this.buildPrintHTML();
    // Obsidian (Electron) ではポップアップがブロックされるため
    // Node.js の fs でテンポラリファイルに書き出し、OS のブラウザで開く
    try {
      const os=require('os'), fs=require('fs'), path=require('path');
      const {shell}=require('electron');
      const tmp=path.join(os.tmpdir(),'mandala-chart-print.html');
      fs.writeFileSync(tmp,html,'utf8');
      shell.openPath(tmp);
    } catch(e){
      // フォールバック: window.open でそのまま開く
      try {
        const w=window.open('','_blank');
        if(!w){new obsidian.Notice(this.t.errPrint);return;}
        w.document.write(html);
        w.document.close();
        setTimeout(()=>w.print(),700);
      } catch(e2){
        new obsidian.Notice(this.t.errPrint);
        console.error('[Mandala print]',e2);
      }
    }
  }

  buildPrintHTML() {
    const d=this.data, t=this.t; let cells='';
    for(let row=0;row<9;row++){
      for(let col=0;col<9;col++){
        const mgr=Math.floor(row/3),mgc=Math.floor(col/3),lr=row%3,lc=col%3;
        const ti=MINI_GRID_MAP[mgr][mgc];
        let text='',cellBg='#fff',circleBg='',circleText='',isCircle=false;
        const bR=(col===2||col===5)?'border-right:2px solid #bbb;':'';
        const bB=(row===2||row===5)?'border-bottom:2px solid #bbb;':'';
        if(ti===-1){
          if(lr===1&&lc===1){text=d.center;isCircle=true;cellBg='#FFFDE7';circleBg=COLORS.center.bg;circleText=COLORS.center.text;}
          else{const bi=A_GRID_BMAP[lr][lc];if(bi>=0){text=d.themes[bi].theme;isCircle=true;cellBg=COLORS.themes[bi].light;circleBg=COLORS.themes[bi].bg;circleText=COLORS.themes[bi].text;}}
        } else {
          const clr=COLORS.themes[ti];
          if(lr===1&&lc===1){text=d.themes[ti].theme;isCircle=true;cellBg=clr.light;circleBg=clr.bg;circleText=clr.text;}
          else{const ii=getItemIndex(lr,lc);text=d.themes[ti].items[ii]||'';cellBg=clr.light;}
        }
        if(isCircle) cells+=`<div class="c" style="background:${cellBg};${bR}${bB}"><div class="circ" style="background:${circleBg};color:${circleText}">${esc(text)}</div></div>`;
        else cells+=`<div class="c" style="background:${cellBg};${bR}${bB}">${esc(text)}</div>`;
      }
    }
    return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">
<title>${esc(t.printTitle)}${d.center?' - '+esc(d.center):''}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Hiragino Sans','Meiryo',Arial,sans-serif;background:#f0f0f0;display:flex;justify-content:center;padding:8mm}.wrap{background:white;padding:6mm;width:280mm}h1{text-align:center;font-size:12pt;margin-bottom:4mm;color:#444}.grid{display:grid;grid-template-columns:repeat(9,1fr);grid-template-rows:repeat(9,1fr);width:100%;aspect-ratio:1;border:2px solid #888}.c{display:flex;align-items:center;justify-content:center;font-size:5.5pt;padding:1px;word-break:break-all;line-height:1.2;border:0.5px solid rgba(0,0,0,0.1)}.circ{width:82%;aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;font-size:5pt;font-weight:bold;padding:2px;word-break:break-all;border:1px solid rgba(255,255,255,0.5)}@media print{@page{size:A4 landscape;margin:6mm}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{margin:0;padding:0;background:white;display:flex;justify-content:center;align-items:flex-start}.wrap{width:auto;padding:0;display:flex;flex-direction:column;align-items:center}h1{font-size:9pt;margin-bottom:2mm;text-align:center}.grid{width:185mm;height:185mm;font-size:5.5pt}}</style>
</head><body><div class="wrap">
<h1>${esc(t.printTitle)}${d.center?'：'+esc(d.center):''}</h1>
<div class="grid">${cells}</div></div></body></html>`;
  }
}

// ======================================================
// MandalaComponent — ノートのコードブロック: 何も表示しない（全画面のみ）
// ======================================================
class MandalaComponent extends obsidian.MarkdownRenderChild {
  constructor(source, containerEl, ctx, app, plugin) {
    super(containerEl);
    this.source=source; this.ctx=ctx; this.app=app; this.plugin=plugin;
  }
  onload(){
    // コードブロック領域を非表示にする
    this.containerEl.style.display='none';
  }
}

// ======================================================
// MandalaView — dedicated tab opened from ribbon icon
// ======================================================
class MandalaView extends obsidian.ItemView {
  constructor(leaf, plugin){super(leaf);this.plugin=plugin;this.renderer=null;}
  getViewType(){return VIEW_TYPE_MANDALA;}
  getDisplayText(){return detectLang().displayText;}
  getIcon(){return 'layout-grid';}
  async onOpen(){
    const saved=await this.plugin.loadData();
    // ソースファイルパスを保持（保存時に書き戻すため）
    this._sourcePath = saved?._sourcePath || '';
    const data=normalizeData(saved||{});
    // If completely empty, fill with localized defaults
    if(!data.center && data.themes.every(t=>!t.theme)){
      const t=detectLang();
      data.center=t.tplCenter;
      data.themes.forEach((th,i)=>{if(!th.theme) th.theme=`${t.tplTheme}${i+1}`;});
    }
    this.contentEl.empty();
    // 専用タブ判定クラスを付与（縦幅フィット用 CSS で使用）
    this.contentEl.classList.add('is-mandala-view');
    this.renderer=new MandalaRenderer(this.contentEl,data,async(d)=>{
      // plugin data に保存（sourcePath も維持）
      await this.plugin.saveData({...d, _sourcePath:this._sourcePath});
      // ノートのコードブロックにも書き戻す（埋め込みビューと同期）
      if(this._sourcePath) await this.saveToSourceFile(d);
    },this.app,'',this);
    this.renderer.render();
  }
  async saveToSourceFile(data){
    if(!this._sourcePath) return;
    try {
      const file=this.app.vault.getAbstractFileByPath(this._sourcePath);
      if(!file||!(file instanceof obsidian.TFile)) return;
      const raw=await this.app.vault.read(file);
      const newSrc=JSON.stringify(data,null,2);
      const hasCRLF=raw.includes('\r\n');
      const content=raw.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
      const OPEN='```mandala\n', CLOSE='\n```';
      const openIdx=content.indexOf(OPEN);
      if(openIdx===-1){
        const OPEN2='~~~mandala\n', CLOSE2='\n~~~';
        const o2=content.indexOf(OPEN2);
        if(o2===-1) return;
        const c2=content.indexOf(CLOSE2,o2+OPEN2.length);
        if(c2===-1) return;
        const result=content.slice(0,o2)+OPEN2+newSrc+CLOSE2+content.slice(c2+CLOSE2.length);
        await this.app.vault.modify(file,hasCRLF?result.replace(/\n/g,'\r\n'):result);
      } else {
        const closeIdx=content.indexOf(CLOSE,openIdx+OPEN.length);
        if(closeIdx===-1) return;
        const result=content.slice(0,openIdx)+OPEN+newSrc+CLOSE+content.slice(closeIdx+CLOSE.length);
        await this.app.vault.modify(file,hasCRLF?result.replace(/\n/g,'\r\n'):result);
      }
    } catch(e){ console.error('[Mandala saveToSourceFile]',e); }
  }
  async onClose(){}
}

// ======================================================
// Plugin Entry Point
// ======================================================
class MandalaChartPlugin extends obsidian.Plugin {
  async onload(){
    // Register dedicated view
    this.registerView(VIEW_TYPE_MANDALA,(leaf)=>new MandalaView(leaf,this));

    // Ribbon icon (left sidebar)
    const t=detectLang();
    this.addRibbonIcon('layout-grid',t.ribbonTitle,async()=>{await this.activateView();});

    // Code block renderer
    this.registerMarkdownCodeBlockProcessor('mandala',(source,el,ctx)=>{
      ctx.addChild(new MandalaComponent(source,el,ctx,this.app,this));
    });

    // Commands
    this.addCommand({id:'mandala-open-view',name:t.cmdOpen,callback:async()=>{await this.activateView();}});
    this.addCommand({
      id:'mandala-chart-insert',name:t.cmdInsert,
      editorCallback:(editor)=>{
        const lang=detectLang();
        const themes=Array.from({length:8},(_,i)=>`    { "theme": "${lang.tplTheme}${i+1}", "items": ["","","","","","","",""] }`).join(',\n');
        const tpl=`{\n  "center": "${lang.tplCenter}",\n  "themes": [\n${themes}\n  ]\n}`;
        editor.replaceSelection('\n```mandala\n'+tpl+'\n```\n');
      }
    });

    // mandala ブロックを含むノートを開いたら、そのタブを全画面ビューに置き換える
    this.registerEvent(this.app.workspace.on('file-open',async(file)=>{
      if(!file||file.extension!=='md') return;
      // ノートタブを取得しておく（setTimeout後は activeLeaf が変わる可能性あり）
      const noteLeaf=this.app.workspace.getMostRecentLeaf();
      setTimeout(async()=>{
        try {
          const content=await this.app.vault.cachedRead(file);
          const norm=content.replace(/\r\n/g,'\n');
          const OPEN='```mandala\n';
          const openIdx=norm.indexOf(OPEN);
          if(openIdx===-1) return;
          const closeIdx=norm.indexOf('\n```',openIdx+OPEN.length);
          if(closeIdx===-1) return;
          const json=norm.slice(openIdx+OPEN.length,closeIdx);
          const data=JSON.parse(json);
          await this.saveData({...data,_sourcePath:file.path});

          const mandalaLeaves=this.app.workspace.getLeavesOfType(VIEW_TYPE_MANDALA);
          if(mandalaLeaves.length>0){
            // 既存の全画面タブを更新してフォーカス → ノートタブを閉じる
            const mLeaf=mandalaLeaves[0];
            if(mLeaf.view?.onOpen) await mLeaf.view.onOpen();
            this.app.workspace.revealLeaf(mLeaf);
            if(noteLeaf&&noteLeaf!==mLeaf) noteLeaf.detach();
          } else if(noteLeaf){
            // ノートタブ自体をマンダラビューに置き換える（新タブを作らない）
            await noteLeaf.setViewState({type:VIEW_TYPE_MANDALA,active:true});
            this.app.workspace.revealLeaf(noteLeaf);
          } else {
            await this.activateView();
          }
        } catch(e){ console.error('[Mandala] auto-open failed',e); }
      },200);
    }));

    console.log('[Mandala Chart] loaded v2.0.9');
  }

  async activateView(){
    const {workspace}=this.app;
    let leaf=workspace.getLeavesOfType(VIEW_TYPE_MANDALA)[0];
    if(!leaf){
      leaf=workspace.getLeaf('tab');
      await leaf.setViewState({type:VIEW_TYPE_MANDALA,active:true});
    } else {
      // 既存のビューがある場合: data.json の最新データで強制再描画
      const view=leaf.view;
      if(view && typeof view.onOpen==='function') await view.onOpen();
    }
    workspace.revealLeaf(leaf);
  }

  onunload(){console.log('[Mandala Chart] unloaded');}
}

module.exports = MandalaChartPlugin;
