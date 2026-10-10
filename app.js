'use strict';
const LINE_URL='https://lin.ee/sT1UukY';
const defs={
 event:{n:1,title:'何が起きた？',question:'最近、心に引っかかった出来事をひとつ教えてもらえますか？',note:'そのとき、何がありましたか？ うまくまとめなくて大丈夫です。',placeholder:'今回整理したい出来事を、ひとつだけ。名前などは書かなくても大丈夫です。'},
 emotion:{n:2,title:'そのとき何を感じた？',question:'そのとき、どんな気持ちがありましたか？',note:'ひとつでも、いくつかあっても大丈夫です。',hints:['不安','悲しさ','怒り','寂しさ','悔しさ','モヤモヤ']},
 fear:{n:3,title:'本当は何が怖かった？',question:'もしその出来事に、あなたにとって「怖い意味」があったとしたら、何が起きるのが怖かったでしょう？',note:'怖くなかったときは、そのまま「怖くなかった」で大丈夫です。',hints:['嫌われる','責められる','大切にされなくなる','迷惑をかける','関係が壊れる','失敗する']},
 depth1:{n:3,title:'その奥にある感覚（任意）',question:'今書いた言葉は、あなたにとってどんな意味を持っている感じがしますか？',note:'もっと深い答えを探す必要はありません。ここで終えても大丈夫です。'},
 depth2:{n:3,title:'もう少しだけ（任意）',question:'そのとき、自分のことをどんなふうに感じそうですか？',note:'言葉にならなければ、そのまま次へ進めます。'},
 need:{n:4,title:'本当はどうしてほしかった？',question:'本当は、どうしてほしかったですか？',hints:['分かってほしかった','助けてほしかった','大切にしてほしかった','そっとしておいてほしかった','選ばせてほしかった','安心したかった']},
 own:{n:4,title:'自分はどうしたかった？（任意）',question:'相手や周りをいったん横に置けるとしたら、あなた自身は本当はどうしたかったと思いますか？',note:'さっき書いた本音のままでも大丈夫です。'},
 role:{n:5,title:'どんな自分でいなきゃと思った？',question:'そのとき、「私はこうしなきゃ」「こういう自分でいなきゃ」と思っていたものはありますか？',hints:['いい人でいなきゃ','頑張らなきゃ','我慢しなきゃ','相手を優先しなきゃ','迷惑をかけちゃいけない','本音を言っちゃいけない']},
 rule:{n:6,title:'今も守っている心のルール',question:'ここまでの言葉は、あなたの中で何かつながっている感じがしますか？',note:'つながりを感じるなら、あなたの言葉で書いてみてください。見つからなくても大丈夫です。'},
 setting:{n:7,title:'これから選びたい新しい設定',question:'その心のルールを責めずに少しゆるめるなら、これからどんな言葉を自分に渡してあげたいですか？',note:'今は信じられない言葉に変える必要はありません。「〜してもいいかもしれない」くらいでも大丈夫です。'},
 action:{n:7,title:'今日のやさしい一歩（任意）',question:'今日出てきた新しい設定を大切にするとしたら、今日か明日にできそうな「小さな一歩」はありますか？',note:'決めずにシートへ進んでも大丈夫です。'},
 reflect:{title:'並べてみて、気づいたこと',question:'最初に感じていた問題と、今ここに並んでいるものを見比べてみて、あなた自身は何か気づくことや感じることはありますか？',note:'結論を出さなくても大丈夫です。あなたが感じたことを、そのまま。'}
};
const order=['event','emotion','fear','need','role','rule','setting','action'];
const state={page:'intro',answers:{},history:[],confirmed:false,edit:null,ack:'',hint:false,paused:false};
const app=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const value=k=>state.answers[k]||'';
const missing=v=>!v||['パス','わからない','思い出せない','どれも違う','特にない','話したくない'].includes(v.trim());
const quote=(k,label)=>value(k)?`<div><div class="quote-label">${esc(label||defs[k].title)}</div><blockquote class="quote">${esc(value(k))}</blockquote></div>`:'';
const button=(text,action,kind='ghost')=>`<button class="btn ${kind}" data-do="${action}">${text}</button>`;
function go(page,push=true){if(push)state.history.push(state.page);state.page=page;state.hint=false;render();window.scrollTo({top:0,behavior:'instant'});app.querySelector('h1,h2')?.focus({preventScroll:true});}
function capture(){const el=document.getElementById('answer');if(el)state.answers[state.page]=el.value.trim();}
function next(key){return ({event:'emotion',emotion:'fear',fear:'need',depth1:'need',depth2:'need',need:'role',own:'role',role:'rule',rule:'confirm',setting:'action',action:'summary',reflect:'finish'})[key];}
function saveAndGo(target){capture();if(state.page==='rule')state.confirmed=false;if(state.edit){if(state.page==='rule'&&!missing(value('rule'))){go('confirm');return;}const end=state.edit;state.edit=null;go(end);return;}state.ack=missing(value(state.page))?'無理に言葉にせず、そのまま進めます。':'書いてくれた言葉を、そのまま残しました。';go(target||next(state.page));}
function tools(){return `<div class="row no-print">${state.history.length?button('ひとつ前へ','back'):''}${button('少し休む','pause')}${button('今日はここまで','stop')}</div><div class="center no-print"><button class="quiet" data-do="safety">今、つらさや危険を感じているとき</button></div>`;}
function intro(){return `<section class="screen"><div class="kicker">ひとつの出来事から、自分の内側へ。</div><h1 tabindex="-1" class="title big intro-title"><span class="grad">人生パターン</span><span class="grad">整理シート</span></h1><hr class="rule"><div class="lead"><p>同じ悩みの根っこを、<br>あなた自身の言葉で見つめていく。</p><p>最近モヤモヤした出来事をひとつ選び、<br>「そのとき、自分の中で何が起きていたんだろう？」<br>を1問ずつ整理します。</p></div><div class="flow"><span>出来事</span><span>感情</span><span>怖さ</span><span>本音</span><span>心のルール</span><span>新しい設定</span></div><div class="panel intro-note">うまく話さなくて大丈夫です。<br>あなた自身の感覚を大切にして進めます。<br>「わからない」「パス」「今日はここまで」も選べます。</div>${button('自分のペースではじめる','start','primary')}<p class="privacy">入力した内容をもとにシートを作るセルフワークです。AIによる分析や診断は行いません。回答はサーバーに送信・保存されません。ページを閉じたり再読み込みすると消えるため、残したいときはシートを保存してください。</p></section>`;}
function question(){const k=state.page,d=defs[k];let context='';
 if(k==='rule')context=`<div class="panel compare">${quote('fear')}${quote('need')}${quote('role')}</div>`;
 if(k==='role')context=quote('need','ここまでに書いた本音');
 if(k==='depth1')context=quote('fear');if(k==='depth2')context=quote('depth1');
 if(k==='setting'&&state.confirmed)context=quote('rule','自分で確認した心のルール');
 if(k==='reflect')context=`<div class="panel compare"><div class="kicker">最初に見えていた問題</div>${quote('event')}<div class="compare-arrow">↓</div><div class="kicker">整理していく中で出てきたもの</div>${['emotion','fear','need','role'].map(x=>quote(x)).join('')}${state.confirmed?quote('rule'):''}${quote('setting')}</div>`;
 const hint=state.hint&&d.hints?`<p class="hint">近い言葉だけ選べます。どれも違って大丈夫です。</p><div class="optional">${d.hints.map(x=>`<button class="chip" data-word="${esc(x)}">${esc(x)}</button>`).join('')}</div>`:'';
 return `<section class="screen">${d.n?`<div class="progress"><span>STEP ${d.n} / 7</span><div class="bar"><span style="width:${d.n/7*100}%"></span></div></div>`:''}<h2 tabindex="-1" class="title" style="font-size:23px">${esc(d.title)}</h2>${state.ack?`<p class="ack">${esc(state.ack)}</p>`:''}${context}<p class="qtext">${esc(d.question)}</p>${d.note?`<p class="hint">${esc(d.note)}</p>`:''}<div><label class="answer-label" for="answer">あなたの言葉</label><textarea id="answer" maxlength="4000" placeholder="${esc(d.placeholder||'思いつく言葉を、そのまま書いてみてください。')}">${esc(value(k))}</textarea><div class="answer-meta"><span>ひとことでも大丈夫です。</span><span id="count">${value(k).length} / 4000</span></div></div>${hint}${d.hints&&!state.hint?`<div class="center"><button class="quiet" data-do="hint">言葉が出にくいので、例を見る</button></div>`:''}${button(state.edit?'この言葉に変更する':k==='action'?'シートにまとめる':k==='reflect'?'振り返りを終える':'この言葉で次へ','next','primary')}<div class="optional">${button('わからない','unknown')}${button(state.edit?'この項目を外す':'パスする','skip')}${k==='fear'?button('怖くなかった','no-fear'):''}</div>${!state.edit&&['fear','depth1','need'].includes(k)?`<div class="center"><button class="quiet" data-do="deeper">${k==='need'?'自分がどうしたかったかも書く（任意）':'この言葉をもう少し見てみる（任意）'}</button></div>`:''}${tools()}</section>`;}
function confirm(){if(missing(value('rule'))){state.confirmed=false;state.page=state.edit||'setting';state.edit=null;return render();}return `<section class="screen"><div class="qid">STEP 6 · 自分で確かめる</div><h2 tabindex="-1" class="title">この言葉は、しっくりきますか？</h2>${quote('rule','あなたから出てきた言葉')}<p class="qtext">この言葉は、自分を守るために持っていた「心のルール」に近い感じはしますか？</p><p class="hint">あなたが確認した言葉だけを、心のルールとしてシートに残します。</p>${button('近い感じがする','confirm-yes','primary')}${button('言葉を直したい','confirm-edit')}${button('まだわからない・採用しない','confirm-no')}${tools()}</section>`;}
function entries(){const rows=[['event','① 何が起きた？'],['emotion','② そのとき何を感じた？'],['fear','③ 本当は何が怖かった？']];for(const k of ['depth1','depth2'])if(value(k))rows.push([k,k==='depth1'?'その奥から出てきたもの':'その奥で感じた自分']);rows.push(['need','④ 本当はどうしてほしかった？']);if(value('own'))rows.push(['own','自分は本当はどうしたかった？']);rows.push(['role','⑤ どんな自分にならなきゃと思った？'],['rule','⑥ 今も守っている心のルール'],['setting','⑦ これから選びたい新しい設定']);if(value('action'))rows.push(['action','今日のやさしい一歩']);if(value('reflect'))rows.push(['reflect','自分で気づいたこと']);return rows;}
function shown(k){return k==='rule'&&!state.confirmed?'まだ確認していません':value(k)||'今回は書いていません';}
function cards(edit=true){return `<div class="summary-grid">${entries().map(([k,l])=>`<article class="summary-card"><div class="card-head"><h3>${esc(l)}</h3>${edit?`<button class="edit no-print" data-edit="${k}">直す・外す</button>`:''}</div><p class="${!value(k)||(k==='rule'&&!state.confirmed)?'empty':''}">${esc(shown(k))}</p></article>`).join('')}</div>`;}
function sheetText(){return ['ちなつ式 人生パターン整理シート','今回見えてきた私の人生パターン',state.paused?'途中までの整理':'',...entries().map(([k,l])=>l+'\n'+shown(k))].filter(Boolean).join('\n\n');}
function exportTools(){return `<div class="actions no-print">${button('シートをコピー','copy','primary')}<div class="row">${button('テキストで保存','download')}${button('印刷・PDFに保存','print')}</div><p id="status" role="status" class="toast"></p><div id="copy-fallback"></div></div>`;}
function summary(finish=false){return `<section class="screen"><div class="kicker">CHINATSU METHOD</div><h1 tabindex="-1" class="title" style="font-size:26px">今回見えてきた<br><span class="grad">私の人生パターン</span></h1><hr class="rule"><p class="hint">${state.paused?'今日はここまで。書いたところまでを、そのまま残します。':'あなたが書いた言葉を、そのまま並べました。'}</p>${cards()}${exportTools()}${!finish&&!state.paused?`<div class="panel no-print"><p class="hint">最初の出来事と、内側から出てきた言葉。<br>並べて見たとき、どんな感じがするでしょう。</p><div class="center" style="margin-top:16px">${button('並べて振り返る','reflect','primary')}</div></div>`:''}${finish?`<div class="panel closing"><p>今回出てきた反応を、性格の悪さや弱さとして責める必要はありません。</p><p>これまで人とのつながりや安心、自分自身を守るために身につけてきた方法だった可能性もあります。</p><p>「こんな反応をする私はダメ」ではなく、「私はこんなときに、こうやって自分を守ろうとするんだな」と、自分のことを知っていくことを大切にしてください。</p></div><div class="panel closing no-print"><h2 class="title" style="font-size:20px">もう少し深く整理したい方へ</h2><p>今回は、ひとつの出来事から見えるパターンを整理しました。</p><p>同じような反応が複数の場面で繰り返されている場合、その奥には、自分では気づきにくい「心の前提」が関係していることもあります。</p><p>もっと深く、自分が繰り返している人生の構造を知りたい方には、ちなつの「人生構造リーディング」をご案内しています。</p><a class="btn line" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">公式LINEで案内を見る</a><p class="privacy">シートを共有したいときだけ、コピーした内容をLINEに貼り付けて送れます。自動送信はされません。</p></div><p class="qtext no-print">まとめの中で、違う・直したい・外したい言葉はありますか？</p><p class="hint no-print">各項目の「直す・外す」から変更できます。</p>`:''}${state.paused?`<div class="center no-print">${button('さっきの続きに戻る','resume','primary')}</div>`:''}<div class="center no-print">${button('別の出来事で新しくはじめる','reset')}</div><p class="privacy no-print">回答はこのページを開いている間だけ保持します。閉じる前に、必要な内容をコピー・保存してください。</p></section>`;}
function render(){let html;if(state.page==='intro')html=intro();else if(defs[state.page])html=question();else if(state.page==='confirm'){html=confirm();if(html===undefined)return;}else if(state.page==='pause')html=`<section class="screen"><h1 tabindex="-1" class="title">いったん、ひと休み。</h1><p class="lead">今、答えを出さなくても大丈夫です。<br>ページを開いたままなら、続きから再開できます。</p>${button('続きから再開する','resume','primary')}${button('ここまでをシートにする','stop')}<p class="privacy">ページを閉じたり再読み込みすると回答は消えます。残したいときは、ここまでをシートにして保存してください。</p></section>`;else if(state.page==='reset')html=`<section class="screen"><h1 tabindex="-1" class="title">新しくはじめますか？</h1><p class="lead">現在の回答はすべて消えます。<br>残したい内容は、先に保存してください。</p>${button('回答を消してはじめる','reset-yes','primary')}${button('シートへ戻る','reset-no')}</section>`;else html=summary(state.page==='finish');app.innerHTML=html;bind();}
async function copy(){const text=sheetText();try{await navigator.clipboard.writeText(text);document.getElementById('status').textContent='コピーしました。必要なところに貼り付けて保存できます。';}catch{document.getElementById('copy-fallback').innerHTML='<label class="answer-label" for="manual-copy">下の文章を選択してコピーしてください。</label><textarea id="manual-copy" readonly></textarea>';const ta=document.getElementById('manual-copy');ta.value=text;ta.focus();ta.select();document.getElementById('status').textContent='自動コピーできなかったため、手動コピー用の文章を表示しました。';}}
function bind(){document.getElementById('answer')?.addEventListener('input',e=>{document.getElementById('count').textContent=e.target.value.length+' / 4000';});app.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{state.edit=state.page;state.ack='';go(b.dataset.edit);});app.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{const ta=document.getElementById('answer');ta.value=(ta.value?ta.value+'、':'')+b.dataset.word;ta.dispatchEvent(new Event('input'));ta.focus();});app.querySelectorAll('[data-do]').forEach(b=>b.onclick=()=>act(b.dataset.do));}
function act(a){
 if(a==='start'){go('event');return;}
 if(a==='next'){const t=document.getElementById('answer');if(!t.value.trim()){t.focus();document.getElementById('count').textContent='空欄で進むときは「パスする」を選べます。';return;}const input=t.value.trim();if(['今日はここまで','やめたい','しんどい'].includes(input)){state.resume=state.page;go('pause');return;}saveAndGo();return;}
 if(a==='skip'||a==='unknown'||a==='no-fear'){document.getElementById('answer').value=a==='unknown'?'わからない':a==='no-fear'?'怖くなかった':'';saveAndGo();return;}
 if(a==='hint'){capture();state.hint=true;render();return;}
 if(a==='deeper'){capture();if(missing(value(state.page))||value(state.page)==='怖くなかった'){saveAndGo();return;}saveAndGo(({fear:'depth1',depth1:'depth2',need:'own'})[state.page]);return;}
 if(a==='back'){capture();state.ack='';go(state.history.pop()||'intro',false);return;}
 if(a==='pause'){capture();state.resume=state.page;go('pause');return;}
 if(a==='stop'){capture();if(state.page!=='pause')state.resume=state.page;state.paused=true;state.edit=null;go('summary');return;}
 if(a==='resume'){state.paused=false;go(state.resume||'event');return;}
 if(a==='confirm-edit'){go('rule');return;}
 if(a==='confirm-yes'||a==='confirm-no'){state.confirmed=a==='confirm-yes';const to=state.edit||'setting';state.edit=null;go(to);return;}
 if(a==='reflect'){state.ack='';go('reflect');return;}
 if(a==='copy'){copy();return;}
 if(a==='print'){window.print();return;}
 if(a==='download'){const blob=new Blob([sheetText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='人生パターン整理シート.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
 if(a==='reset'){state.returnTo=state.page;go('reset');return;}
 if(a==='reset-no'){go(state.returnTo||'summary');return;}
 if(a==='reset-yes'){Object.assign(state,{page:'intro',answers:{},history:[],confirmed:false,edit:null,ack:'',hint:false,paused:false,resume:null});render();return;}
 if(a==='safety'){capture();document.getElementById('safety').showModal();}
}
document.getElementById('safe-close').onclick=()=>document.getElementById('safety').close();
document.getElementById('safe-stop').onclick=()=>{document.getElementById('safety').close();act('pause');};
window.addEventListener('beforeunload',e=>{if(Object.values(state.answers).some(Boolean)||document.getElementById('answer')?.value.trim()){e.preventDefault();e.returnValue='';}});
render();
