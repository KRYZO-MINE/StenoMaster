const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const widths = [320,360,375,390,414,430,480,640,768,820,1024,1280,1440,1920];
const heights = {320:800,360:800,375:812,390:844,414:896,430:932,768:1024,1024:768,1280:800,1440:900,1920:1080};
const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/StenoMaster/, '');
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    const data = await fs.readFile(file);
    const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.txt':'text/plain'}[path.extname(file)] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type':mime}); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu','--disable-accelerated-2d-canvas']});
  let checks = 0;
  try {
    const context = await browser.newContext({reducedMotion:'reduce',hasTouch:true});
    await context.route('https://fonts.googleapis.com/**', route => route.fulfill({contentType:'text/css',body:''}));
    await context.route('https://fonts.gstatic.com/**', route => route.abort());
    const page = await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{ if(message.type()==='error') errors.push(message.text()); });
    await context.route('**/favicon.ico', route => route.fulfill({status:204}));
    const noOverflow = async (label) => {
      const result = await page.evaluate(() => ({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(result.scroll <= result.client + 1, `${label}: ${JSON.stringify(result)}`); checks++;
    };
    const dialogFits = async () => {
      const rect = await page.locator('#media-viewer').boundingBox();
      const viewport = page.viewportSize();
      assert.ok(rect.x >= 0 && rect.x + rect.width <= viewport.width + 1 && rect.y >= 0 && rect.y + rect.height <= viewport.height + 1,JSON.stringify(rect));
      assert.ok(await page.locator('#media-viewer').evaluate(el=>el.scrollWidth<=el.clientWidth+1)); checks++;
    };
    await page.goto(origin+'/gallery.html');
    assert.equal(await page.locator('h1').count(),1);
    for(const width of widths) {
      await page.setViewportSize({width,height:heights[width] || 900});
      await noOverflow(`empty ${width}`);
      if(width<1024) {
        await page.locator('#gallery-menu-toggle').click();
        assert.equal(await page.locator('#gallery-nav').isVisible(),true);
        await noOverflow(`menu ${width}`);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#gallery-nav').isVisible(),false);
        assert.equal(await page.locator('#gallery-menu-toggle').evaluate(el=>el===document.activeElement),true);
      }
    }
    await fs.mkdir(path.join(root,'test-results'),{recursive:true});
    await page.setViewportSize({width:320,height:800});
    await page.screenshot({path:path.join(root,'test-results/gallery-empty-320.png'),fullPage:true});
    assert.equal(await page.locator('.media-card').count(),0);
    assert.equal(await page.locator('#gallery-empty').isVisible(),true);
    await page.evaluate(()=>localStorage.setItem('sm_student_corner','broken JSON'));
    await page.reload();
    assert.equal(await page.locator('#gallery-empty').isVisible(),true);
    // A tiny synthetic video is made only in memory for browser playback testing.
    const videoBytes = await page.evaluate(async () => {
      const canvas=document.createElement('canvas'); canvas.width=160;canvas.height=90;document.body.append(canvas);canvas.scrollIntoView();
      const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#C8102E';ctx.fillRect(0,0,160,90);
      const stream=canvas.captureStream(10), chunks=[];
      const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8'});
      const result=new Promise(resolve=>{recorder.onstop=async()=>{resolve(Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer())));stream.getTracks().forEach(track=>track.stop());};});
      recorder.ondataavailable=event=>chunks.push(event.data);recorder.start();
      let frame=0;const timer=setInterval(()=>{ctx.fillStyle=frame++%2?'#C8102E':'#0A0A0A';ctx.fillRect(0,0,160,90);stream.getVideoTracks()[0].requestFrame();},50);
      await new Promise(resolve=>setTimeout(resolve,1500));clearInterval(timer);recorder.stop();const bytes=await result;canvas.remove();return bytes;
    });
    console.log('Test video bytes:',videoBytes.length,videoBytes.slice(0,8));
    assert.ok(videoBytes.length>200,'Synthetic video must contain encoded frames');
    const fixture = [
      {type:'photo',src:'assets/gallery/test-one.svg',title:'Test photo one',alt:'Synthetic test rectangle',category:'campus'},
      {type:'video',src:'assets/gallery/test-video.webm',title:'Test video',category:'functions'},
      {type:'photo',src:'assets/gallery/test-two.svg',title:'<img src=x onerror=alert(1)>',description:'A long description '+ 'longword'.repeat(25),category:'awards'},
      {type:'photo',src:'javascript:alert(1)',title:'Rejected unsafe URL'},
      {type:'photo',src:'assets/gallery/test-one.svg',title:'Duplicate'}
    ];
    await context.route('**/js/gallery-data.js', route => route.fulfill({contentType:'text/javascript',body:`window.STENO_GALLERY=${JSON.stringify(fixture)};`}));
    await context.route('**/assets/gallery/test-*.svg', route => route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#C8102E"/><text x="60" y="225" fill="white" font-size="40">TEST FIXTURE</text></svg>'}));
    await context.route('**/assets/gallery/test-video.webm', route => route.fulfill({contentType:'video/webm',body:Buffer.from(videoBytes)}));
    await page.evaluate(()=>localStorage.setItem('sm_student_corner',JSON.stringify({placements:[{title:'Legacy photo',image:'assets/gallery/test-legacy.svg'}],awards:[{title:'No image',image:''}]})));
    await page.reload();
    assert.equal(await page.locator('.media-card').count(),4);
    assert.equal(await page.locator('.media-title img').count(),0);
    await page.locator('[data-media-filter="video"]').click();
    assert.equal(await page.locator('.media-card').count(),1);
    await page.locator('.media-card').click();
    await page.waitForFunction(()=>{const v=document.querySelector('#viewer-stage video');return v && (v.readyState>=2 || v.error);});
    assert.equal(await page.locator('#viewer-stage video').evaluate(v=>v.error?.message || ''),'');
    const video = page.locator('#viewer-stage video');
    assert.equal(await video.evaluate(el=>el.autoplay),false);
    await video.evaluate(el=>el.play());
    assert.equal(await video.evaluate(el=>el.paused),false);
    await page.locator('#viewer-close').click();
    await page.waitForFunction(()=>!document.querySelector('#viewer-stage video'));
    assert.equal(await page.locator('#viewer-stage video').count(),0);
    await page.selectOption('#gallery-category','awards');
    assert.equal(await page.locator('#gallery-empty').isVisible(),true);
    await page.locator('#gallery-reset').click();
    assert.equal(await page.locator('.media-card').count(),4);
    await page.locator('[data-media-filter="photo"]').tap();
    assert.equal(await page.locator('.media-card').count(),3);
    await page.locator('[data-media-filter="all"]').click();
    await fs.mkdir(path.join(root,'test-results'),{recursive:true});
    for(const width of widths) {
      await page.setViewportSize({width,height:heights[width] || 900});
      await noOverflow(`populated ${width}`);
      if([320,1440].includes(width)) await page.screenshot({path:path.join(root,`test-results/gallery-${width}.png`),fullPage:true});
      await page.locator('.media-card').first().click();
      await dialogFits(); await noOverflow(`photo dialog ${width}`);
      await page.locator('#viewer-next').click();
      await page.waitForFunction(()=>{const v=document.querySelector('#viewer-stage video');return v && (v.readyState>=2 || v.error);});
    assert.equal(await page.locator('#viewer-stage video').evaluate(v=>v.error?.message || ''),'');
      await dialogFits(); await noOverflow(`video dialog ${width}`);
      await page.locator('#viewer-next').click();
      await dialogFits();
      if(width===320) await page.screenshot({path:path.join(root,'test-results/gallery-dialog-320.png')});
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.locator('#viewer-position').textContent(),'2 / 4');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#media-viewer').isVisible(),false);
      assert.equal(await page.locator('.media-card').first().evaluate(el=>el===document.activeElement),true);
    }
    await page.goto(origin+'/StenoMaster/gallery.html');
    assert.equal(await page.locator('.media-card').count(),4);
    await noOverflow('subpath deployment');
    assert.deepEqual(errors,[]);
    assert.equal(await page.locator('body').innerText().then(text=>text.includes('Explore courses ?')),false);
    // The old single-page navigation must allow the new independent-page link.
    await page.evaluate(()=>localStorage.removeItem('sm_student_corner'));
    await page.goto(origin+'/index.html');
    await page.locator('nav a[href="gallery.html"]').waitFor({state:'attached'});
    await page.locator('nav a[href="gallery.html"]').evaluate(el=>el.click());
    await page.waitForURL('**/gallery.html');
    assert.equal(await page.locator('h1').count(),1);
    assert.deepEqual(errors,[]);
    // No-JavaScript navigation and fallback stay usable.
    const noJS = await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});
    await noJS.route('https://fonts.googleapis.com/**', route => route.fulfill({contentType:'text/css',body:''}));
    const fallback = await noJS.newPage(); await fallback.goto(origin+'/gallery.html');
    assert.equal(await fallback.locator('#gallery-nav').isVisible(),true);
    assert.equal(await fallback.locator('noscript').isVisible(),true);
    const noJsLayout=await fallback.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth,
      offenders:[...document.querySelectorAll('body *')].filter(el=>el.getClientRects().length&&el.getBoundingClientRect().right>innerWidth+1).map(el=>({element:el.tagName+'.'+el.className,right:el.getBoundingClientRect().right,width:el.getBoundingClientRect().width})).slice(0,10)
    }));
    assert.ok(noJsLayout.scrollWidth<=320,JSON.stringify(noJsLayout));
    await noJS.close();
    const result={status:'passed',widths,overflowAndDialogChecks:checks,consoleErrors:errors,checks:['empty state','mobile menu and Escape','filters and reset','category intersection','safe text rendering','unsafe URL rejection','deduplication','legacy data','corrupt storage fallback','actual video playback','video cleanup','dialog next/previous/arrow keys/Escape/focus return','subpath hosting','no-JS fallback','touch filtering','homepage gallery link']};
    await fs.writeFile(path.join(root,'test-results/gallery-results.json'),JSON.stringify(result,null,2));
    console.log(JSON.stringify(result,null,2));
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
