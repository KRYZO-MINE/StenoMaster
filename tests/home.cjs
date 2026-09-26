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
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu']});
 try {
  const context=await browser.newContext({hasTouch:true});
  await context.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.origin===origin) return route.continue();
   return route.fulfill({contentType:url.pathname.endsWith('.css')||url.hostname==='fonts.googleapis.com'?'text/css':'text/html',body:''});
  });
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:320,height:800});await page.goto(origin+'/index.html');
  assert.equal(await page.locator('#admin-dashboard-btn, #admin-overlay, #admin-login-form').count(),0);
  assert.equal(await page.locator('.footer-bottom').innerText().then(t=>t.includes('Admin:')),false);
  assert.equal(await page.locator('.designer-credit').getAttribute('href'),'https://github.com/Kryzo-Mine');
  await fs.mkdir(path.join(root,'test-results'),{recursive:true});
  await page.screenshot({path:path.join(root,'test-results/home-intro-320.png')});
  const intro=await page.locator('.intro-typewriter').boundingBox();assert.ok(intro.x>=0 && intro.x+intro.width<=320);
  await page.locator('#intro-screen').waitFor({state:'detached'});
  await page.emulateMedia({reducedMotion:'reduce'});
  let checks=0;
  const fits=async(label)=>{
   const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>el.getClientRects().length&&getComputedStyle(el).position!=='fixed'&&el.getBoundingClientRect().right>innerWidth+1).map(el=>el.tagName+'.'+el.className).slice(0,10));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+': '+overflow.join(','));checks++;
  };
  for(const width of [...widths,471]) {
   await page.setViewportSize({width,height:heights[width]||860});
   await fits('page '+width);
   if(width<1200){await page.locator('.menu-toggle').click();await fits('menu '+width);await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
   await page.locator('[data-tab="resources"]').click();await fits('resources '+width);
   const tab=await page.locator('.student-tabs').boundingBox();const section=await page.locator('#student_corner').boundingBox();assert.ok(tab.x>=section.x && tab.x+tab.width<=width);
   await page.locator('[data-tab="life"]').click();
   for(const category of ['awards','functions','placements','blogs']){
    await page.locator(`[data-sub-tab="${category}"]`).click();await fits(category+' '+width);
    assert.equal(await page.locator('.student-sub-pane:visible').count(),1);
   }
   const styled=await page.locator('[data-sub-tab="blogs"]').evaluate(el=>({height:el.getBoundingClientRect().height,bg:getComputedStyle(el).backgroundColor}));assert.ok(styled.height>=44);assert.equal(styled.bg,'rgb(226, 29, 63)');
   await page.locator('[data-tab="verification"]').click();await fits('certificate '+width);
   await page.locator('#cert-input').fill('SM-2024-001');await page.locator('#cert-input').press('Enter');
   await page.locator('.cert-download-btn').click();assert.equal(await page.locator('#cert-modal').isVisible(),true);
   const rect=await page.locator('#cert-modal').boundingBox();assert.ok(rect.x>=0 && rect.x+rect.width<=width+1);await fits('modal '+width);
   if(width===320) await page.screenshot({path:path.join(root,'test-results/home-certificate-modal-320.png')});
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#cert-modal').isVisible(),false);
   if([320,471,1440].includes(width)) {
    await page.locator('.certificate-card').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,`test-results/home-certificate-${width}.png`)});
   }
   await page.locator('#chatbot-toggle-btn').click();await fits('chat '+width);
   await page.keyboard.press('Escape');
   if(width===320){await page.locator('[data-tab="life"]').click();await page.locator('[data-sub-tab="awards"]').click();await page.locator('.student-tabs').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,'test-results/home-student-320.png')});}
  }
  await page.setViewportSize({width:320,height:800});
  await page.locator('#courses').scrollIntoViewIfNeeded();
  const cards=await page.locator('.course-card').evaluateAll(cards=>cards.map(el=>{const b=el.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,overflow:getComputedStyle(el).overflow};}));
  assert.ok(cards.every(c=>c.left>=0&&c.right<=320&&c.overflow==='visible'));
  assert.ok(cards[1].top>=cards[0].bottom);
  await page.locator('.course-card').first().hover();const before=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,400);await page.waitForTimeout(350);assert.ok(await page.evaluate(()=>scrollY)>before);
  await page.keyboard.down('Shift');await page.mouse.wheel(400,0);await page.keyboard.up('Shift');await fits('shift-scroll');
  // Touch swipe over a course card must scroll the page, not trap the gesture.
  const cdp=await context.newCDPSession(page);const touchBefore=await page.evaluate(()=>scrollY);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:160,y:600}]});
  for(const y of [540,480,420,360,300])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:160,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(300);assert.ok(await page.evaluate(()=>scrollY)>touchBefore);
  await page.locator('[data-tab="verification"]').click();await page.locator('#cert-input').fill('UNKNOWN');await page.locator('#cert-check-btn').click();assert.match(await page.locator('#cert-result-container').innerText(),/ID Not Found/i);
  await page.locator('#chatbot-toggle-btn').click();await page.locator('#chat-input').fill('<img src=x onerror=alert(1)>');await page.locator('#chat-input').press('Enter');assert.equal(await page.locator('.chat-message.user img').count(),0);await page.keyboard.press('Escape');
  assert.deepEqual(errors,[]);
  const result={status:'passed',widths:[...widths,471],layoutChecks:checks,errors,features:['admin removal','designer link','intro fits','mobile menu','all student tabs','Tailwind button styling','certificate enter/search/preview/ESC','chat fits','stacked course cards','wheel scrolling','shift scrolling without page overflow','touch scrolling','literal chat messages']};
  await fs.writeFile(path.join(root,'test-results/home-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
