/* APA-first citation parser. Deterministic: it never translates or guesses official names. */
(function (root) {
  'use strict';
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function parseAPA(input) {
    let source = clean(input);
    // APA reference URLs may be DOI links or general article links; never treat these as translations.
    let url = '';
    const foundUrl = source.match(/(?:https?:\/\/|doi:\s*10\.)\S+$/i);
    if (foundUrl) {
      url = foundUrl[0].replace(/[\s.,;]+$/, '');
      if (/^doi:/i.test(url)) url = 'https://doi.org/' + url.replace(/^doi:\s*/i, '');
      source = source.slice(0, foundUrl.index).trim();
    }
    const hit = /\(((?:19|20)\d{2})([a-z]?)\)\s*[.．]?\s*/i.exec(source);
    const out = {raw:input || '', authors:'',year:'',title:'',journal:'',details:'',detected_url:url,confident:false};
    if (!hit) { out.title = clean(source); return out; }
    out.year = hit[1];
    out.authors = clean(source.slice(0,hit.index).replace(/[.．\s]+$/,''));
    let body = clean(source.slice(hit.index + hit[0].length)).replace(/[.。]\s*$/, '');
    // Prefer splitting a citation title from its venue only when the trailing text looks like publication metadata.
    // This prevents a working-paper title containing an abbreviation from becoming a fake journal.
    const dots = [...body.matchAll(/[.。．?!？！]\s+/g)];
    let venueAt = -1;
    for (let i = dots.length-1; i >= 0; i--) {
      const tail = body.slice(dots[i].index + dots[i][0].length);
      if (/,\s*(?:\d+\s*(?:\([^)]*\))?|\(\d+\))/.test(tail) || /\b(?:Press|Proceedings|Journal|Review|University)\b/i.test(tail)) {
        venueAt = dots[i].index;
        break;
      }
    }
    // Chinese journals may have a standalone issue (11) rather than a numeric volume.
    if (venueAt < 0 && /[\u3400-\u9fff]/.test(body)) {
      for (const dot of dots) {
        const tail = body.slice(dot.index + dot[0].length);
        if (/(?:,|，)\s*(?:\d+|\(\d+\))/.test(tail)) { venueAt=dot.index; break; }
      }
    }
    if (venueAt >= 0) {
      out.title = clean(body.slice(0,venueAt));
      const tail = clean(body.slice(venueAt + 1));
      // Split journal and citation metadata at first bibliographic comma, not the last comma.
      const comma = tail.search(/[,，]\s*(?=\d|\()/);
      out.journal = clean(comma < 0 ? tail : tail.slice(0,comma));
      out.details = clean(comma < 0 ? '' : tail.slice(comma+1));
    } else {
      out.title = body;
    }
    out.confident = Boolean(out.year && out.title);
    return out;
  }
  function effective(record) {
    const parsed = parseAPA(record.apa || '');
    return {
      ...parsed,
      title: clean(record.title_original) || parsed.title,
      journal: clean(record.journal_original) || parsed.journal,
      year: clean(record.year_override) || parsed.year,
      authors: clean(record.authors_display) || parsed.authors
    };
  }
  root.CitationParser = {parseAPA,effective};
})(typeof window === 'undefined' ? globalThis : window);
