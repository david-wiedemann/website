/* Pulsating microstructure demo — bilingual, standalone Canvas rendering.
 * Cell geometry adapted from the user-provided "Travelling bend" example:
 *   q1=cos(2πτ), q2=sin(2πτ),
 *   alpha(s,τ)=0.72(1-exp(-8s)) [sin(2πs)q1-cos(2πs)q2],
 *   X'(s,τ)=(cos(alpha),-sin(alpha)).
 * We attach a finite-width tube along that INEXTENSIBLE centerline to an
 * circular head, to obtain a bounded, connected 2D obstacle. No flow is solved.
 * The fast phase τ=t/ε, so its (dimensionless) period is precisely ε.
 * Slow rotations θ(x,t) are OPTIONAL, additive and independent of ε.
 */
(() => {
  'use strict';
  const host = document.getElementById('pulsating-demo');
  if (!host) return;
  const de = host.dataset.lang === 'de';
  const $ = selector => host.querySelector(selector);
  const ui = {
    play: $('.pulsating-play'), reset: $('.pulsating-reset'), time: $('.pulsating-time'),
    clock: $('.pulsating-clock'), speed: $('.pulsating-speed'), space: $('.pulsating-space'),
    slowTime: $('.pulsating-slow-time'), micro: [...host.querySelectorAll('.pulsating-micro')],
    miniCells: [...host.querySelectorAll('.pulsating-micro-cell')],
    miniPhaseLabels: [...host.querySelectorAll('.pulsating-mini-phase')],
    miniZoomSvgs: [...host.querySelectorAll('.pulsating-mini-zoom-lines')],
    macro: $('.pulsating-macro'), cell: $('.pulsating-cell'),
    zoom: $('.pulsating-zoom-lines'), phaseLabels: [...host.querySelectorAll('.pulsating-phase')],
    orientOutput: $('.pulsating-orientation'),
    freeze: $('.pulsating-freeze'), limitMode: $('.pulsating-limit-mode'),
    limitTime: $('.pulsating-limit-time'),
  };
  const BASE = { cycleWindow: 2, slowPeriod: 2, playbackSeconds: 18 };
  const state = { t: 0, playing: false, speed: 1, space: false, slowTime: false,
                  x: 1.14, y: .48, selectedN: 8, microPlayback: false,
                  microPhase: 0, resumeMacroAfterMicro: false };
  const colors = {outline:'#44677f', head:'#a2b0bb', tail:'#a2b0bb',
    edge:'#486a83', grid:'#b6cad7', selected:'#23699a', fluid:'#f6f9fb',
    effective:'#dfe8ee', cell:'#fff', ghost:'#96b5c9', label:'#253f52',
    // Much lighter fill for the region swept by the tail at frozen macro time.
    sweepTail:'#edf3f7', sweepEdge:'#c5d4df'};
  const TAU=2*Math.PI;
  const domain=new Path2D();
  domain.moveTo(.14,.15);
  domain.bezierCurveTo(.02,.17,.02,.33,.085,.46);
  domain.bezierCurveTo(.17,.58,.015,.68,.10,.84);
  domain.bezierCurveTo(.18,1.01,.39,.85,.54,.94);
  domain.bezierCurveTo(.73,1.05,.88,.82,1.06,.91);
  domain.bezierCurveTo(1.23,1.02,1.45,.86,1.61,.95);
  domain.bezierCurveTo(1.85,1.04,2.02,.86,1.90,.70);
  domain.bezierCurveTo(1.82,.57,2.02,.45,1.92,.28);
  domain.bezierCurveTo(1.84,.08,1.65,.06,1.49,.17);
  domain.bezierCurveTo(1.30,.30,1.12,.25,.91,.19);
  domain.bezierCurveTo(.73,.11,.58,.08,.45,.22);
  domain.bezierCurveTo(.32,.34,.29,.04,.14,.15);
  domain.closePath();
  const testCtx=document.createElement('canvas').getContext('2d');
  const inside=(x,y)=>testCtx.isPointInPath(domain,x,y);
  const wrap01=x=>x-Math.floor(x);
  const phaseAt=(t,eps)=>wrap01(t/eps);
  function slowAngle(x,y,t){
    let a=0;
    if(state.space) a+=.95*(x-1) + .17*Math.cos(Math.PI*y);
    if(state.slowTime) a+=.86*Math.sin(TAU*t/BASE.slowPeriod);
    return a;
  }
  // Source geometry, with arc-length parametrization and fixed endpoint at base.
  // The head is a true circle (2D representation of a ball). All dimensions
  // are fractions of the unit cell; the obstacle stays clear of cell boundaries.
  const headCenter=-.235, headRadius=.094;
  const baseX=headCenter+headRadius-.003, length=.425, halfWidth=.018;
  function bendingTail(phase){
    const n=52, points=[[baseX,0]],ds=length/n;
    let x=baseX,y=0;
    const q1=Math.cos(TAU*phase),q2=Math.sin(TAU*phase);
    for(let i=1;i<=n;i++){
      const s=(i-.5)/n;
      const envelope=1-Math.exp(-8*s);
      const alpha=.72*envelope*(Math.sin(TAU*s)*q1-Math.cos(TAU*s)*q2);
      x+=ds*Math.cos(alpha);
      y-=ds*Math.sin(alpha);
      points.push([x,y]);
    }
    return points;
  }
  const phases=128;
  const shapes=Array.from({length:phases},(_,i)=>{
    const points=bendingTail(i/phases);
    const tail=new Path2D();
    for(let j=0;j<points.length;j++){
      if(j===0)tail.moveTo(points[j][0],points[j][1]);
      else tail.lineTo(points[j][0],points[j][1]);
    }
    return tail;
  });
  function tailAt(p){return shapes[Math.floor(wrap01(p)*phases)%phases];}
  // Full swept area at fixed macroscopic (x,t), over one microscopic cycle.
  // The sweep of the thin tail is PALE, while the stationary ball stays darker.
  // Rasterizing a geometric union once avoids accumulation of opacity as the
  // 128 tail positions overlap. This is not a computed homogenized solution.
  const sweepCanvas=document.createElement('canvas');
  sweepCanvas.width=sweepCanvas.height=640;
  {
    const g=sweepCanvas.getContext('2d');
    g.translate(320,320);g.scale(640,640);
    g.lineCap='round';g.lineJoin='round';
    // Draw every tail silhouette in the same solid pale tone: overlaps do NOT
    // become darker. First the boundary, then its narrower pale interior.
    g.strokeStyle=colors.sweepEdge;g.lineWidth=2*halfWidth+.008;
    for(const path of shapes)g.stroke(path);
    g.strokeStyle=colors.sweepTail;g.lineWidth=2*halfWidth;
    for(const path of shapes)g.stroke(path);
    // The fixed circular head is darker than the swept tail envelope.
    g.fillStyle=colors.head;g.strokeStyle=colors.edge;
    g.lineWidth=.005;
    g.beginPath();g.arc(headCenter,0,headRadius,0,TAU);g.fill();g.stroke();
  }
  function sweptObstacle(ctx,cx,cy,size,angle){
    ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
    ctx.drawImage(sweepCanvas,-size/2,-size/2,size,size);
    ctx.restore();
  }
  function sizeCanvas(canvas){
    const rect=canvas.getBoundingClientRect(), w=Math.max(1,rect.width),h=Math.max(1,rect.height);
    const dpr=Math.min(window.devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    }
    const ctx=canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    return {ctx,w,h};
  }
  function worldTransform(ctx,w,h){
    const s=Math.min(w/2.12,h/1.22);
    const ox=(w-2*s)/2,oy=(h-s)/2;
    ctx.translate(ox,oy);ctx.scale(s,s);
    return {s,ox,oy};
  }
  function motif(ctx,px,py,cellSize,angle,phase,worldScale,ghost=false){
    ctx.save();ctx.translate(px,py);ctx.rotate(angle);ctx.scale(cellSize,cellSize);
    if(ghost){
      ctx.save();ctx.strokeStyle=colors.ghost;ctx.lineWidth=.025;
      ctx.setLineDash([.035,.025]);ctx.lineCap='round';ctx.stroke(tailAt(phase));
      ctx.restore();
    }
    ctx.strokeStyle=colors.edge;ctx.fillStyle=colors.head;
    ctx.lineWidth=Math.max(.6,Math.min(1.0,worldScale*cellSize*.028))/(worldScale*cellSize);
    ctx.beginPath();ctx.arc(headCenter,0,headRadius,0,TAU);ctx.fill();ctx.stroke();
    ctx.strokeStyle=colors.edge;ctx.lineWidth=2*halfWidth + ctx.lineWidth;
    ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke(tailAt(phase));
    ctx.strokeStyle=colors.tail;ctx.lineWidth=2*halfWidth;ctx.stroke(tailAt(phase));
    ctx.restore();
  }
  function selectorRect(ctx,x,y,delta,s){
    ctx.save();ctx.strokeStyle=colors.selected;ctx.lineWidth=1.4/s;
    ctx.setLineDash([4/s,3/s]);ctx.strokeRect(x-delta/2,y-delta/2,delta,delta);ctx.restore();
  }
  function drawMicro(canvas,n){
    const {ctx,w,h}=sizeCanvas(canvas),eps=1/n;
    ctx.save();const {s}=worldTransform(ctx,w,h);
    ctx.fillStyle=colors.fluid;ctx.fill(domain);
    ctx.save();ctx.clip(domain);
    ctx.strokeStyle=colors.grid;ctx.lineWidth=.72/s;ctx.setLineDash([3/s,3/s]);
    ctx.beginPath();
    for(let j=1;j<n;j++){ctx.moveTo(0,j*eps);ctx.lineTo(2,j*eps);}
    for(let i=1;i<2*n;i++){ctx.moveTo(i*eps,0);ctx.lineTo(i*eps,1);}
    ctx.stroke();ctx.setLineDash([]);
    const phase=phaseAt(state.t,eps);
    for(let j=0;j<n;j++)for(let i=0;i<2*n;i++){
      const x=(i+.5)*eps,y=(j+.5)*eps;
      if(!inside(x,y))continue;
      motif(ctx,x,y,eps,slowAngle(x,y,state.t),phase,s);
    }
    const i=Math.max(0,Math.min(2*n-1,Math.floor(state.x/eps)));
    const j=Math.max(0,Math.min(n-1,Math.floor(state.y/eps)));
    selectorRect(ctx,(i+.5)*eps,(j+.5)*eps,eps,s);
    ctx.restore();ctx.strokeStyle=colors.outline;ctx.lineWidth=1.65/s;ctx.stroke(domain);
    ctx.restore();
  }
  // Magnified reference cell below EACH periodic microstructure. Keeping
  // physical time t fixed gives distinct fast phases t/epsilon, hence the
  // three bending motions proceed at speeds proportional to 1/epsilon.
  function drawMiniCell(canvas,n){
    const {ctx,w,h}=sizeCanvas(canvas);
    const side=Math.min(w*.82,h*.82);
    const left=(w-side)/2,top=(h-side)/2;
    ctx.fillStyle=colors.cell;
    ctx.fillRect(left,top,side,side);
    ctx.strokeStyle=colors.outline;ctx.lineWidth=1;
    ctx.setLineDash([4,3]);ctx.strokeRect(left,top,side,side);ctx.setLineDash([]);
    const eps=1/n;
    // Cell-wise center is exactly the position of the marked obstacle in
    // the corresponding epsilon-domain.
    const ix=Math.max(0,Math.min(2*n-1,Math.floor(state.x/eps)));
    const iy=Math.max(0,Math.min(n-1,Math.floor(state.y/eps)));
    const x=(ix+.5)*eps, y=(iy+.5)*eps;
    motif(ctx,left+side/2,top+side/2,side,
          slowAngle(x,y,state.t),phaseAt(state.t,eps),side);
    ctx.fillStyle=colors.label;
    ctx.font=`italic ${Math.max(9,Math.min(14,side*.11))}px Georgia,serif`;
    ctx.textAlign='right';ctx.textBaseline='bottom';
    ctx.fillText('Y',left+side-5,top+side-5);
  }
  function miniZoomLines(){
    // Lines connect the lower corners of the selected epsilon-cell to
    // the upper corners of its magnified display, at every size.
    for(const svg of ui.miniZoomSvgs){
      const panel=svg.closest('.pulsating-micro-panel');
      const micro=panel.querySelector('.pulsating-micro');
      const zoom=panel.querySelector('.pulsating-micro-cell');
      const n=Number(micro.dataset.n),eps=1/n;
      const l=svg.querySelectorAll('line');
      const r=svg.getBoundingClientRect();
      const m=micro.getBoundingClientRect(),c=zoom.getBoundingClientRect();
      if(!r.width||!r.height||!m.width||!c.width)continue;
      const k=Math.min(m.width/2.12,m.height/1.22);
      const ox=(m.width-2*k)/2,oy=(m.height-k)/2;
      const ix=Math.max(0,Math.min(2*n-1,Math.floor(state.x/eps)));
      const iy=Math.max(0,Math.min(n-1,Math.floor(state.y/eps)));
      const sourceL=m.left-r.left+ox+ix*eps*k;
      const sourceR=sourceL+eps*k;
      const sourceY=m.top-r.top+oy+(iy+1)*eps*k;
      const side=Math.min(c.width*.82,c.height*.82);
      const destL=c.left-r.left+(c.width-side)/2;
      const destR=destL+side;
      const destY=c.top-r.top+(c.height-side)/2;
      svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);
      [[sourceL,sourceY,destL,destY],
       [sourceR,sourceY,destR,destY]].forEach((values,i)=>{
         ['x1','y1','x2','y2'].forEach((name,j)=>{
           l[i].setAttribute(name,values[j].toFixed(2));
         });
       });
    }
  }
  function drawMacro(){
    const {ctx,w,h}=sizeCanvas(ui.macro);
    ctx.save();const {s}=worldTransform(ctx,w,h);
    ctx.fillStyle=colors.effective;ctx.fill(domain);
    ctx.strokeStyle=colors.outline;ctx.lineWidth=1.65/s;ctx.stroke(domain);
    selectorRect(ctx,state.x,state.y,.12,s);
    ctx.restore();
  }
  function drawCell(){
    const {ctx,w,h}=sizeCanvas(ui.cell);
    const side=Math.min(w*.82,h*.82),left=(w-side)/2,top=(h-side)/2;
    ctx.fillStyle=colors.cell;ctx.fillRect(left,top,side,side);
    ctx.strokeStyle=colors.outline;ctx.lineWidth=1.05;ctx.setLineDash([4,3]);
    ctx.strokeRect(left,top,side,side);ctx.setLineDash([]);
    const orientation=slowAngle(state.x,state.y,state.t);
    if(state.microPlayback){
      // Macroscopic t and the chosen slow direction stay fixed. Only the
      // independent microscopic fast phase tau evolves in the magnified cell.
      motif(ctx,left+side/2,top+side/2,side,orientation,state.microPhase,side);
    }else{
      // The effective cell represents infinitely fast pulsations: show
      // the union of all instantaneous obstacles at fixed (x,t).
      sweptObstacle(ctx,left+side/2,top+side/2,side,orientation);
    }
    ctx.fillStyle=colors.label;
    ctx.font=`italic ${Math.max(9,Math.min(14,side*.11))}px Georgia,serif`;
    ctx.textAlign='right';ctx.textBaseline='bottom';
    ctx.fillText('Y',left+side-5,top+side-5);
  }
  function zoomLines(){
    // Vertical zoom, from the two LOWER corners of the marked macro
    // region to the two UPPER corners of the magnified reference cell.
    const svg=ui.zoom;if(!svg)return;
    const lines=svg.querySelectorAll('line');if(lines.length<2)return;
    const r=svg.getBoundingClientRect(),m=ui.macro.getBoundingClientRect(),c=ui.cell.getBoundingClientRect();
    if(!r.width||!r.height||!m.width||!c.width)return;
    const scale=Math.min(m.width/2.12,m.height/1.22);
    const ox=(m.width-2*scale)/2,oy=(m.height-scale)/2,delta=.12;
    const sourceL=m.left-r.left+ox+(state.x-delta/2)*scale;
    const sourceR=m.left-r.left+ox+(state.x+delta/2)*scale;
    const sourceY=m.top-r.top+oy+(state.y+delta/2)*scale;
    const side=Math.min(c.width*.82,c.height*.82);
    const destL=c.left-r.left+(c.width-side)/2;
    const destR=destL+side;
    const destY=c.top-r.top+(c.height-side)/2;
    svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);
    [[sourceL,sourceY,destL,destY],[sourceR,sourceY,destR,destY]].forEach((pts,i)=>{
      ['x1','y1','x2','y2'].forEach((attr,j)=>lines[i].setAttribute(attr,pts[j].toFixed(2)));
    });
  }
  function updateLimitControls(){
    const frozen=state.microPlayback;
    ui.freeze.setAttribute('aria-pressed',String(frozen));
    ui.freeze.textContent=frozen
      ? (de?'Zur makroskopischen Zeit zurückkehren':'Return to macroscopic time')
      : (de?'Makroskopische Zeit anhalten · Mikrobewegung zeigen':'Freeze macroscopic time · show microscopic motion');
    ui.limitMode.textContent=frozen
      ? (de?'Mikroskopische Oszillation':'Microscopic oscillation')
      : (de?'Durchlaufener Bereich eines schnellen Zyklus':'Fast-cycle swept region');
    ui.limitTime.textContent=frozen
      ? `t = ${state.t.toFixed(2)} · τ = ${state.microPhase.toFixed(2)}`
      : (de?'Alle schnellen Phasen bei festem t':'All fast phases at fixed t');
    ui.play.disabled=frozen;
    ui.time.disabled=frozen;
  }
  function render(){
    for(const canvas of ui.micro)drawMicro(canvas,Number(canvas.dataset.n));
    for(const canvas of ui.miniCells)drawMiniCell(canvas,Number(canvas.dataset.n));
    drawMacro();drawCell();zoomLines();miniZoomLines();
    updateLimitControls();
    for(const label of ui.miniPhaseLabels){
      const eps=1/Number(label.dataset.n);
      label.textContent=`${de?'Phase':'Phase'} = ${phaseAt(state.t,eps).toFixed(2)}`;
    }
    ui.time.value=String(Math.round(1000*state.t/BASE.cycleWindow));
    ui.clock.textContent=`t = ${state.t.toFixed(2)}`;
    for(const label of ui.phaseLabels){
      const eps=1/Number(label.dataset.n);
      label.textContent=`${de?'Periode':'Period'} Tε = ${eps.toFixed(4).replace(/0+$/,'').replace(/\.$/,'')}`;
    }
    const selectedScale = $('.pulsating-selected-epsilon');
    if(selectedScale)selectedScale.textContent=`ε = 1/${state.selectedN}`;
    ui.orientOutput.textContent=`θ(x,t) = ${(slowAngle(state.x,state.y,state.t)*180/Math.PI).toFixed(0)}°`;
    ui.play.textContent=state.playing?(de?'Pause':'Pause'):(de?'Start':'Play');
    ui.play.setAttribute('aria-pressed',String(state.playing));
  }
  let frameId=null,last=null;
  let microFrameId=null,microLast=null;
  function stop(){
    state.playing=false;last=null;
    if(frameId!==null)cancelAnimationFrame(frameId);
    frameId=null;
  }
  function stopMicro(){
    state.microPlayback=false;microLast=null;
    if(microFrameId!==null)cancelAnimationFrame(microFrameId);
    microFrameId=null;
  }
  function microFrame(stamp){
    microFrameId=null;
    if(!state.microPlayback)return;
    if(microLast!==null && !document.hidden){
      const dt=Math.min(100,stamp-microLast)/1000;
      // Independent fast-time animation: about 4.5 cycles per 2 seconds
      // (0.44 real seconds per cycle at 1x, 5x faster than before).
      // The macroscopic t and the slow orientation remain exactly frozen.
      state.microPhase=wrap01(state.microPhase+dt*state.speed/0.44);
    }
    microLast=stamp;
    drawCell();updateLimitControls();
    if(state.microPlayback)microFrameId=requestAnimationFrame(microFrame);
  }
  function enterMicroMode(){
    state.resumeMacroAfterMicro=state.playing;
    stop();stopMicro();
    state.microPlayback=true;
    state.microPhase=phaseAt(state.t,1/state.selectedN);
    render();
    microFrameId=requestAnimationFrame(microFrame);
  }
  function leaveMicroMode(resume=true){
    const wasPlaying=state.resumeMacroAfterMicro;
    stopMicro();state.resumeMacroAfterMicro=false;
    if(resume && wasPlaying)play();else render();
  }
  function frame(stamp){
    frameId=null;if(!state.playing)return;
    if(last!==null&&!document.hidden){
      state.t+=Math.min(100,stamp-last)/1000 * BASE.cycleWindow/BASE.playbackSeconds*state.speed;
      if(state.t>=BASE.cycleWindow)state.t-=BASE.cycleWindow;
    }
    last=stamp;render();if(state.playing)frameId=requestAnimationFrame(frame);
  }
  function play(){
    if(state.microPlayback || state.playing)return;
    state.playing=true;last=null;frameId=requestAnimationFrame(frame);render();
  }
  ui.play.addEventListener('click',()=>{if(state.playing){stop();render();}else play();});
  ui.freeze.addEventListener('click',()=>{if(state.microPlayback)leaveMicroMode();else enterMicroMode();});
  ui.reset.addEventListener('click',()=>{stop();stopMicro();state.resumeMacroAfterMicro=false;state.t=0;render();});
  ui.time.addEventListener('input',()=>{
    if(state.microPlayback)return;
    state.t=BASE.cycleWindow*Number(ui.time.value)/1000;
    if(state.t>=BASE.cycleWindow)state.t=0;
    last=null;render();
  });
  ui.speed.addEventListener('change',()=>{state.speed=Number(ui.speed.value)||1;render();});
  ui.space.addEventListener('change',()=>{state.space=ui.space.checked;render();});
  ui.slowTime.addEventListener('change',()=>{state.slowTime=ui.slowTime.checked;render();});
  function select(event,canvas){
    const rect=canvas.getBoundingClientRect();
    const scale=Math.min(rect.width/2.12,rect.height/1.22);
    const ox=(rect.width-2*scale)/2,oy=(rect.height-scale)/2;
    const x=(event.clientX-rect.left-ox)/scale, y=(event.clientY-rect.top-oy)/scale;
    if(x<0||x>2||y<0||y>1||!inside(x,y))return;
    state.x=x;state.y=y;
    if(canvas.dataset.n)state.selectedN=Number(canvas.dataset.n);
    render();
  }
  ui.micro.forEach(canvas=>canvas.addEventListener('click',e=>select(e,canvas)));
  ui.macro.addEventListener('click',e=>select(e,ui.macro));
  let queued=false;
  function onResize(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
  window.addEventListener('resize',onResize);
  if('ResizeObserver' in window){new ResizeObserver(onResize).observe(host);}
  render();
  window.pulsatingMicrostructureDemo={
    play,pause:()=>{stop();render();},
    freezeMacro:enterMicroMode,unfreezeMacro:leaveMicroMode,
    setTime:t=>{if(state.microPlayback)leaveMicroMode(false);state.t=Math.max(0,Math.min(BASE.cycleWindow,Number(t)||0));render();},
    setSpace:enabled=>{state.space=!!enabled;ui.space.checked=state.space;render();},
    setSlowTime:enabled=>{state.slowTime=!!enabled;ui.slowTime.checked=state.slowTime;render();},
    getState:()=>({...state,epsilons:[.25,.125,.0625],periods:[.25,.125,.0625]}),
    bendCenterline:bendingTail
  };
})();
