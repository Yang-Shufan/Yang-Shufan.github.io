/* Public site renderer for Pages CMS JSON files. No sign-in or editing code on public pages. */
(() => {
  'use strict';
  const $ = (sel) => document.querySelector(sel);
  const node = (tag, klass, value) => {
    const el = document.createElement(tag);
    if (klass) el.className = klass;
    if (value !== undefined && value !== null) el.textContent = String(value);
    return el;
  };
  const first = (...parts) => parts.find(x => x !== undefined && x !== null && String(x).trim() !== '') || '';
  const sorted = arr => (Array.isArray(arr) ? arr : []).filter(x => x && x.visible !== false)
    .map((x,i) => ({...x,__idx:i}))
    .sort((a,b) => (Number(a.order ?? 9999) - Number(b.order ?? 9999)) || (a.__idx - b.__idx));
  function localOrExternal(url) {
    const u = String(url || '').trim();
    if (!u) return null;
    if (/^https?:\/\//i.test(u)) return u;
    if (/^(?:javascript|data|vbscript):/i.test(u)) return null;
    if (/^\/?[\w\p{L}]/u.test(u) && !u.includes('..') && !u.startsWith('//')) return u.replace(/^\/+/, '');
    return null;
  }
  const link = (url,cls,text) => {
    const a = node('a',cls,text);
    a.href = localOrExternal(url) || '#';
    a.target='_blank'; a.rel='noopener noreferrer';
    return a;
  };
  function appendInline(el,input) {
    // Tiny, safe markdown subset for owner-managed About text: **bold** and [label](https://...).
    const s=String(input||'');
    const re=/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
    let cursor=0,m;
    while ((m=re.exec(s))) {
      if (m.index>cursor) el.append(document.createTextNode(s.slice(cursor,m.index)));
      const chunk=m[0];
      if (chunk.startsWith('**')) el.append(node('strong','',chunk.slice(2,-2)));
      else { const hit=/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/.exec(chunk); if(hit) el.append(link(hit[2],'',hit[1])); }
      cursor=m.index+chunk.length;
    }
    if (cursor<s.length) el.append(document.createTextNode(s.slice(cursor)));
  }
  function renderProfile(p) {
    if (!p || typeof p!=='object') return;
    const cn=$('.cn-name'), en=$('.identity h1'), hero=$('.hero-overline');
    if(cn) cn.textContent=first(p.chinese_name,cn.textContent);
    if(en) en.textContent=first(p.english_name,en.textContent);
    if(hero) hero.textContent=first(p.hero_name,hero.textContent);
    if($('.role')) $('.role').textContent=first(p.role,$('.role').textContent);
    if($('.institution')) $('.institution').replaceChildren(document.createTextNode(first(p.school,'')),document.createElement('br'),document.createTextNode(first(p.university,'')));
    if($('.sidebar-email span')) $('.sidebar-email span').textContent=first(p.email,'');
    if($('.topbar-contact-static')) $('.topbar-contact-static').textContent=first(p.email,'');
    if($('#hero-heading')) {
      const title=$('#hero-heading');
      const l1=node('span','hero-line',first(p.hero_line_one,'State–Citizen Interaction'));
      const l2=node('span','hero-line'); l2.append(node('span','hero-amp','&'),document.createTextNode(' '+first(p.hero_line_two,'Government Action')));
      title.replaceChildren(l1,l2);
    }
    if($('.hero-subtitle')) $('.hero-subtitle').textContent=first(p.hero_subtitle,'');
    if($('.research-tags') && Array.isArray(p.research_tags)) $('.research-tags').replaceChildren(...p.research_tags.filter(Boolean).map(x=>node('li','',x)));
    if($('.section-body.prose') && Array.isArray(p.about_paragraphs)) {
      const paragraphs=p.about_paragraphs.filter(Boolean).map(str => {const el=node('p');appendInline(el,str);return el;});
      $('.section-body.prose').replaceChildren(...paragraphs);
    }
    if($('.portrait-frame img') && localOrExternal(p.portrait)) $('.portrait-frame img').src=localOrExternal(p.portrait);
    // Pages CMS writes the selected hero photo path into profile.json.
    // Only the image changes; the responsive crop and warm gradient remain CSS-controlled.
    const background=localOrExternal(p.hero_background);
    if (background && $('.hero-building')) {
      $('.hero-building').style.backgroundImage='url('+JSON.stringify(background)+')';
    }
    if(p.section_titles && typeof p.section_titles === 'object') {
      const headings = [
        ['about','about'],['education','education'],['publications','publications'],
        ['working_papers','working-papers'],['talks','talks'],['activities','activities']
      ];
      headings.forEach(([key,id])=>{
        const newTitle=p.section_titles[key];if(!newTitle)return;
        const heading=$('#'+id+' .section-title-row h2');if(heading) heading.textContent=newTitle;
        const nav=$('.main-nav a[href="#'+id+'"]');if(nav)nav.textContent=newTitle;
      });
    }
    const cv=$('.cv-btn');
    if(cv) {
      if(p.cv_button_text) {const textParts=[...cv.childNodes].filter(n=>n.nodeType===3);if(textParts.length)textParts[0].textContent=' '+p.cv_button_text+' ';}
      const u=localOrExternal(p.cv);
      if(u) {cv.href=u;cv.hidden=false;} else {cv.hidden=true;}
    }
    if($('.footer p') && p.footer_note) {
      const footer=$('.footer p');
      footer.replaceChildren(document.createTextNode('© '+new Date().getFullYear()+' '+first(p.english_name,'Shufan Yang')+'. '+p.footer_note));
    }
  }
  function renderEducation(list){
    const target=$('.education-list'); if(!target || !Array.isArray(list)) return;
    const frag=document.createDocumentFragment();
    sorted(list).forEach(x=>{
      const item=node('div','edu-item'), time=node('span','edu-time',x.period), info=node('div','edu-info');
      const h=node('h3'); const safe=localOrExternal(x.url);
      h.append(safe?link(safe,'',x.university):document.createTextNode(x.university||''));
      info.append(h,node('p','',x.degree));
      const school=[first(x.school,''),[x.city,x.country].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
      info.append(node('p','edu-school',school));
      item.append(time,info,node('div','edu-monogram',x.abbreviation||''));frag.append(item);
    }); target.replaceChildren(frag);
  }
  function appendAuthorLine(el, record, parsed) {
    const display=String(parsed.authors||'').trim();
    let authors=[];
    if (record.authors_display) authors=display.split(/\s*;\s*/).filter(Boolean);
    else if (/\s*&\s*/.test(display)) authors=display.split(/\s*(?:,?\s*&\s*)/).filter(Boolean);
    else authors=[display];
    if(!authors.length) authors=[''];
    authors.forEach((name,i)=>{
      if(i>0) el.append(document.createTextNode(i===authors.length-1?' & ':', '));
      const norm=String(name).toLowerCase().replace(/[^a-z\u3400-\u9fff]/g,'');
      const me=norm.includes('shufanyang') || norm.includes('yangshufan') || norm==='yangs' || norm==='杨书帆';
      el.append(me?node('strong','',name):document.createTextNode(name));
      const cor=String(record.corresponding_author||'').toLowerCase().replace(/[^a-z\u3400-\u9fff]/g,'');
      if(cor && (norm===cor || (cor.includes('shufanyang')&&me) || (cor==='杨书帆'&&me))) {
        const star=node('sup','corresponding-star','*');star.title='Corresponding author';el.append(star);
      }
    });
  }
  function makePaper(record,index,working) {
    const p=window.CitationParser.effective(record);
    const cn=record.language==='zh' || (!record.language && /[\u3400-\u9fff]/.test(p.title));
    const wrapper=node('li','paper'+(working?'':' publication-paper'));
    const number=node('div','paper-n'); number.append(node('span','',working?String(index+1).padStart(2,'0'):first(p.year,'')));
    const main=node('div','paper-main');
    const h=node('h3','',p.title || String(record.apa||''));
    if(cn) h.setAttribute('lang','zh-CN'); main.append(h);
    // No machine translation: only display supplied, explicitly edited English text.
    if(cn && record.english_title) {const translation=node('p','paper-translation',record.english_title);translation.setAttribute('lang','en');main.append(translation);}
    const metaRow=node('div','paper-meta-row'),meta=node('div','paper-meta');
    const authors=node('p','paper-authors');appendAuthorLine(authors,record,p); meta.append(authors);
    if(!working && p.journal) {
      const journal=node('p','paper-journal');
      let journalName;
      if(cn) {
        journalName=node('em');journalName.setAttribute('lang','zh-CN');journalName.textContent=`《${p.journal.replace(/^《|》$/g,'')}》`;
        journal.append(journalName);
        if(record.english_journal) journal.append(document.createTextNode(' ('),node('em','',record.english_journal),document.createTextNode(')'));
      } else journal.append(node('em','',p.journal));
      if(p.details) journal.append(document.createTextNode(', '+p.details.replace(/[.。]$/, '')));
      journal.append(document.createTextNode('.'+(cn?' (in Chinese)':'')));
      meta.append(journal);
    }
    metaRow.append(meta);
    const url=localOrExternal(first(record.article_pdf,record.article_url,p.detected_url));
    if(url){const read=link(url,'read-article','Read article');read.setAttribute('aria-label','Read article: '+(p.title||''));read.append(node('span','', '↗'));metaRow.append(read);}
    main.append(metaRow);wrapper.append(number,main);return wrapper;
  }
  function renderPapers(list,targetSelector,working){
    const target=$(targetSelector);if(!target||!Array.isArray(list)) return;
    const items=sorted(list).map((x,i)=>makePaper(x,i,working)); target.replaceChildren(...items);
    if(!working){const note=$('.corresponding-note');if(note) note.hidden=!list.some(x=>x.visible!==false && x.corresponding_author);}
  }
  function renderConferences(list){
    const target=$('.talks-list');if(!target||!Array.isArray(list)) return;
    const elements=sorted(list).map(x=>{
      const outer=node('div','talk-item');outer.append(node('div','talk-year',x.year));
      const content=node('div','talk-content'); const name=node('h3','',x.name_original||'');
      if(x.language==='zh') name.setAttribute('lang','zh-CN'); content.append(name);
      if(x.language==='zh' && x.name_english) content.append(node('p','talk-translation',x.name_english));
      const location=[x.city,x.country].filter(Boolean).join(', ');
      const venue=[x.host_institution,location].filter(Boolean).join(' · ');
      if(venue) content.append(node('p','talk-venue',venue));
      outer.append(content);return outer;
    }); target.replaceChildren(...elements);
  }
  function renderActivities(list){
    const target=$('.activities-list');if(!target||!Array.isArray(list)) return;
    target.replaceChildren(...sorted(list).map(x=>{
      const outer=node('div','activity-item');outer.append(node('div','activity-time',x.period));
      const content=node('div','activity-main');content.append(node('h3','',x.role));
      const p=node('p','',x.organization); if(x.organization_original) p.append(node('span','',` (${x.organization_original})`));
      content.append(p);outer.append(content);return outer;
    }));
  }
  async function fetchJSON(name) {
    const response=await fetch('data/'+name+'.json',{cache:'no-store'});
    if(!response.ok) throw new Error(name+' HTTP '+response.status);
    return response.json();
  }
  async function init(){
    const loaders=[
      ['profile',renderProfile],['education',renderEducation],
      ['publications',x=>renderPapers(x,'.paper-list:not(.working-list)',false)],
      ['working-papers',x=>renderPapers(x,'.working-list',true)],
      ['conferences',renderConferences],['activities',renderActivities]
    ];
    await Promise.all(loaders.map(async ([name,render])=>{
      try {render(await fetchJSON(name));}
      catch(err) {console.warn('[academic-site] Cannot update '+name+'; keeping static fallback.',err);}
    }));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
