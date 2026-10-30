/*
 * Interactive locally evolving microstructure for both research-topic pages.
 * No external libraries, generated images, SVG, or video are needed.
 *
 * Geometry: Omega subset (0,2)x(0,1), perforated by one obstacle in each
 * epsilon-cell.  epsilon = 1/N for N=4,8,16; the centers are periodic.
 * A slow travelling front moves left-to-right.  All panels share the SAME
 * macroscopic profile g(x,t) and the SAME area-parametrized obstacle family.
 * The reference cell zooms into the user-selected macroscopic position.
 * The limit panel's shading is a porosity illustration, NOT a computed PDE.
 */
(() => {
  'use strict';
  const host = document.getElementById('evolving-demo');
  if (!host) return;

  const isGerman = host.dataset.lang === 'de';
  const ui = {
    play: host.querySelector('.evolving-play'),
    reset: host.querySelector('.evolving-reset'),
    timeline: host.querySelector('.evolving-timeline'),
    speed: host.querySelector('.evolving-speed'),
    clock: host.querySelector('.evolving-clock'),
    micro: Array.from(host.querySelectorAll('canvas.evolving-micro')),
    macro: host.querySelector('canvas.evolving-macro'),
    cell: host.querySelector('canvas.evolving-cell'),
    zoomSvg: host.querySelector('.evolving-zoom-lines')
  };

  // t=0 means all obstacles are small; t=T means all have become smooth.
  const state = {phase:0, playing:false, speed:1, cycleSeconds:13,
                 selectedX:0.89, selectedY:0.49};
  const palette = {
    outline:'#44677f', inclusion:'#93a5b2', inclusionLine:'#506f85',
    grid:'#b6cad7', text:'#253f52', selected:'#23699a',
    fluid:'#f6f9fb', cell:'#fff'
  };
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const smoothstep = v => { const x=clamp01(v); return x*x*(3-2*x); };

  // Smooth, fixed macroscopic boundary.  It is identical for all epsilon.
  const domain = new Path2D();
  domain.moveTo(0.14,0.15);
  domain.bezierCurveTo(0.02,0.17,0.02,0.33,0.085,0.46);
  domain.bezierCurveTo(0.17,0.58,0.015,0.68,0.10,0.84);
  domain.bezierCurveTo(0.18,1.01,0.39,0.85,0.54,0.94);
  domain.bezierCurveTo(0.73,1.05,0.88,0.82,1.06,0.91);
  domain.bezierCurveTo(1.23,1.02,1.45,0.86,1.61,0.95);
  domain.bezierCurveTo(1.85,1.04,2.02,0.86,1.90,0.70);
  domain.bezierCurveTo(1.82,0.57,2.02,0.45,1.92,0.28);
  domain.bezierCurveTo(1.84,0.08,1.65,0.06,1.49,0.17);
  domain.bezierCurveTo(1.30,0.30,1.12,0.25,0.91,0.19);
  domain.bezierCurveTo(0.73,0.11,0.58,0.08,0.45,0.22);
  domain.bezierCurveTo(0.32,0.34,0.29,0.04,0.14,0.15);
  domain.closePath();
  const hitCanvas=document.createElement('canvas');
  const hit=hitCanvas.getContext('2d');
  const isInside = (x,y) => hit.isPointInPath(domain,x,y);

  // Here 'volume' means area in this two-dimensional illustration.
  // The path P_v is normalized so |P_v|/|Y| = v, with v in [0.055,0.300].
  // For small v the profile has potato-like Fourier corrugations, while at
  // the largest v it is a smooth ellipse (fixed axis ratio 1.12 / 0.88).
  const minArea = 0.055, maxArea = 0.300;
  const curveBins = 120;
  const paths = Array.from({length:curveBins+1},(_,i) => {
    const s=i/curveBins, morph=smoothstep(s), k=96;
    const rr = new Float64Array(k);
    let meanSq=0;
    for(let j=0;j<k;j++) {
      const a=2*Math.PI*j/k;
      const potato = 1 + 0.17*Math.cos(3*a+0.35)
                       + 0.095*Math.sin(5*a-0.48)
                       + 0.05*Math.cos(7*a+0.22);
      const ellipse = 1/Math.hypot(Math.cos(a)/1.12,Math.sin(a)/0.88);
      rr[j] = (1-morph)*potato + morph*ellipse;
      meanSq += rr[j]*rr[j]/k;
    }
    const targetArea = minArea + s*(maxArea-minArea);
    const factor = Math.sqrt(targetArea/(Math.PI*meanSq));
    const p=new Path2D();
    for(let j=0;j<k;j++) {
      const a=2*Math.PI*j/k;
      const r=rr[j]*factor;
      if(j===0) p.moveTo(r*Math.cos(a),r*Math.sin(a));
      else p.lineTo(r*Math.cos(a),r*Math.sin(a));
    }
    p.closePath();
    return p;
  });
  const obstacleAt = (s) => paths[Math.round(clamp01(s)*curveBins)];

  // Start small across the whole domain; a non-reciprocal growth FRONT
  // (not oscillatory deformation) crosses the sample from left to right.
  function growth(x,t) {
    if(t<=0) return 0;
    if(t>=1) return 1;
    const advancingFront = 2.48*t;
    return smoothstep((advancingFront-x)/0.62);
  }
  const localArea = (x,t) => minArea+(maxArea-minArea)*growth(x,t);

  function prepare(canvas){
    const cssWidth=Math.max(1,canvas.getBoundingClientRect().width);
    const cssHeight=Math.max(1,canvas.getBoundingClientRect().height);
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const w=Math.round(cssWidth*dpr),h=Math.round(cssHeight*dpr);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    const ctx=canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,cssWidth,cssHeight);
    return {ctx,w:cssWidth,h:cssHeight};
  }
  function worldFrame(ctx,w,h){
    const scale=Math.min(w/2.12,h/1.22);
    const offsetX=(w-2*scale)/2;
    const offsetY=(h-scale)/2;
    ctx.translate(offsetX,offsetY);
    ctx.scale(scale,scale);
    return {scale,offsetX,offsetY};
  }
  function drawObstacle(ctx,x,y,eps,parameter,scale){
    ctx.save();
    ctx.translate(x,y);ctx.scale(eps,eps);
    ctx.fillStyle=palette.inclusion;
    ctx.strokeStyle=palette.inclusionLine;
    ctx.lineWidth=Math.max(.32,Math.min(.65,eps*scale*.04))/(eps*scale);
    const p=obstacleAt(parameter);
    ctx.fill(p);ctx.stroke(p);
    ctx.restore();
  }
  function drawSelection(ctx,x,y,eps,scale){
    const ix=Math.min(Math.floor(x/eps),Math.round(2/eps)-1);
    const iy=Math.min(Math.floor(y/eps),Math.round(1/eps)-1);
    ctx.save();
    ctx.strokeStyle=palette.selected;
    ctx.lineWidth=1.35/scale;
    ctx.setLineDash([4/scale,3/scale]);
    ctx.strokeRect(ix*eps,iy*eps,eps,eps);
    ctx.restore();
  }
  function drawMicro(canvas,n){
    const {ctx,w,h}=prepare(canvas);
    ctx.save();
    const {scale}=worldFrame(ctx,w,h);
    ctx.fillStyle=palette.fluid;ctx.fill(domain);
    ctx.save();ctx.clip(domain);
    const eps=1/n;
    ctx.strokeStyle=palette.grid;
    ctx.lineWidth=.75/scale;
    ctx.setLineDash([3/scale,3/scale]);
    ctx.beginPath();
    for(let j=1;j<n;j++){ctx.moveTo(0,j*eps);ctx.lineTo(2,j*eps);}
    for(let i=1;i<2*n;i++){ctx.moveTo(i*eps,0);ctx.lineTo(i*eps,1);}
    ctx.stroke();ctx.setLineDash([]);
    // Periodic centers: one inclusion for every epsilon-cell whose center
    // belongs to the sample. Boundary obstacles are clipped to Omega.
    for(let j=0;j<n;j++)for(let i=0;i<2*n;i++){
      const x=(i+.5)*eps, y=(j+.5)*eps;
      if(!isInside(x,y)) continue;
      drawObstacle(ctx,x,y,eps,growth(x,state.phase),scale);
    }
    drawSelection(ctx,state.selectedX,state.selectedY,eps,scale);
    ctx.restore();
    ctx.strokeStyle=palette.outline;ctx.lineWidth=1.65/scale;
    ctx.stroke(domain);
    ctx.restore();
  }
  function interpolate(a,b,s){return Math.round(a+(b-a)*s);}
  function shade(s){
    return `rgb(${interpolate(240,199,s)},${interpolate(245,217,s)},${interpolate(248,229,s)})`;
  }
  function drawMacro(){
    const {ctx,w,h}=prepare(ui.macro);
    ctx.save();
    const {scale}=worldFrame(ctx,w,h);
    ctx.save();ctx.clip(domain);
    const slices=90;
    for(let j=0;j<slices;j++){
      const x=2*j/slices;
      ctx.fillStyle=shade(growth(x,state.phase));
      ctx.fillRect(x,-.05,2/slices+.002,1.1);
    }
    ctx.restore();
    ctx.strokeStyle=palette.outline;ctx.lineWidth=1.65/scale;
    ctx.stroke(domain);
    // The same selected macroscopic location determines the zoomed cell.
    const selected=state.selectedX, selectedY=state.selectedY;
    const dx=.12;
    ctx.save();ctx.strokeStyle=palette.selected;
    ctx.lineWidth=1.35/scale;
    ctx.setLineDash([4/scale,3/scale]);
    ctx.strokeRect(selected-dx/2,selectedY-dx/2,dx,dx);
    ctx.restore();
    ctx.restore();
  }
  function drawCell(){
    const {ctx,w,h}=prepare(ui.cell);
    const s=Math.min(w*.79,h*.75);
    const left=(w-s)/2, top=(h-s)/2;
    ctx.fillStyle=palette.cell;ctx.fillRect(left,top,s,s);
    ctx.strokeStyle=palette.outline;
    ctx.lineWidth=1.1;
    ctx.setLineDash([5,4]);
    ctx.strokeRect(left,top,s,s);
    ctx.setLineDash([]);
    ctx.save();ctx.translate(left+s/2,top+s/2);ctx.scale(s,s);
    drawObstacle(ctx,0,0,1,growth(state.selectedX,state.phase),s);
    ctx.restore();
    ctx.fillStyle=palette.text;ctx.font=`italic ${Math.max(10,Math.min(17,s*.13))}px Georgia, serif`;
    ctx.textAlign='right';ctx.textBaseline='bottom';
    ctx.fillText('a₂',left+s-9,top+s-8);
    ctx.textAlign='center';ctx.textBaseline='middle';
    // a1 caption positioned to remain legible even when volume is small
    ctx.fillText('a₁',left+s/2,top+s*.18);
  }
  function drawZoomLines(){
    if(!ui.zoomSvg) return;
    const svg = ui.zoomSvg;
    const lines = svg.querySelectorAll('line');
    if(lines.length < 2) return;
    const svgRect = svg.getBoundingClientRect();
    const macroRect = ui.macro.getBoundingClientRect();
    const cellRect = ui.cell.getBoundingClientRect();
    if(!svgRect.width || !svgRect.height || !macroRect.width || !cellRect.width){
      lines.forEach(line => {
        line.setAttribute('x1', 0); line.setAttribute('y1', 0);
        line.setAttribute('x2', 0); line.setAttribute('y2', 0);
      });
      return;
    }
    const mw = macroRect.width, mh = macroRect.height;
    const scale = Math.min(mw/2.12, mh/1.22);
    const ox = (mw - 2*scale)/2, oy = (mh - scale)/2;
    const selected = state.selectedX, selectedY = state.selectedY;
    const dx = 0.12;
    const rectLeft = macroRect.left - svgRect.left + ox + (selected - dx/2) * scale;
    const rectRight = macroRect.left - svgRect.left + ox + (selected + dx/2) * scale;
    const rectTop = macroRect.top - svgRect.top + oy + (selectedY - dx/2) * scale;
    const rectBottom = macroRect.top - svgRect.top + oy + (selectedY + dx/2) * scale;

    const cw = cellRect.width, ch = cellRect.height;
    const s = Math.min(cw*.79, ch*.75);
    const left = cellRect.left - svgRect.left + (cw - s)/2;
    const top = cellRect.top - svgRect.top + (ch - s)/2;
    const bottom = top + s;

    svg.setAttribute('viewBox', `0 0 ${svgRect.width} ${svgRect.height}`);
    const topLine = lines[0], bottomLine = lines[1];
    topLine.setAttribute('x1', rectRight.toFixed(2));
    topLine.setAttribute('y1', rectTop.toFixed(2));
    topLine.setAttribute('x2', left.toFixed(2));
    topLine.setAttribute('y2', top.toFixed(2));
    bottomLine.setAttribute('x1', rectRight.toFixed(2));
    bottomLine.setAttribute('y1', rectBottom.toFixed(2));
    bottomLine.setAttribute('x2', left.toFixed(2));
    bottomLine.setAttribute('y2', bottom.toFixed(2));
  }
  function render(){
    for(const panel of ui.micro) drawMicro(panel,Number(panel.dataset.n));
    drawMacro();drawCell();drawZoomLines();
    ui.timeline.value=Math.round(state.phase*1000);
    ui.clock.textContent=`t/T = ${state.phase.toFixed(2)}`;
    ui.play.textContent = state.playing?(isGerman?'Pause':'Pause'):(isGerman?'Start':'Play');
    ui.play.setAttribute('aria-pressed',String(state.playing));
  }
  let rafId=null,lastTime=null;
  function tick(timestamp){
    rafId=null;
    if(!state.playing)return;
    if(lastTime!==null && !document.hidden){
      state.phase=Math.min(1,state.phase+(Math.min(timestamp-lastTime,80)/1000)*state.speed/state.cycleSeconds);
    }
    lastTime=timestamp;
    if(state.phase>=1) {state.playing=false;lastTime=null;}
    render();
    if(state.playing)rafId=requestAnimationFrame(tick);
  }
  function stop(){
    state.playing=false;lastTime=null;
    if(rafId!==null)cancelAnimationFrame(rafId);
    rafId=null;
  }
  function play(){
    if(state.phase>=1)state.phase=0;
    if(state.playing)return;
    state.playing=true;lastTime=null;
    rafId=requestAnimationFrame(tick);
    render();
  }
  ui.play.addEventListener('click',()=>{
    if(state.playing){stop();render();} else play();
  });
  ui.reset.addEventListener('click',()=>{stop();state.phase=0;render();});
  ui.timeline.addEventListener('input',()=>{
    state.phase=clamp01(Number(ui.timeline.value)/1000);
    lastTime=null;
    if(state.phase>=1)stop();
    render();
  });
  ui.speed.addEventListener('change',()=>{
    state.speed=Math.max(.25,Math.min(4,Number(ui.speed.value)||1));
  });

  function selectAt(event,canvas){
    const {width,height,left,top}=canvas.getBoundingClientRect();
    const scale=Math.min(width/2.12,height/1.22);
    const ox=(width-2*scale)/2,oy=(height-scale)/2;
    const x=(event.clientX-left-ox)/scale;
    const y=(event.clientY-top-oy)/scale;
    if(x<0||x>2||y<0||y>1||!isInside(x,y))return;
    state.selectedX=x;state.selectedY=y;
    render();
  }
  for(const canvas of ui.micro)canvas.addEventListener('click',e=>selectAt(e,canvas));
  ui.macro.addEventListener('click',e=>selectAt(e,ui.macro));
  // Initial still frame. Explicit play is intentional (including for
  // reduced-motion visitors). Canvas redraws responsively on resize.
  let resizeQueued=false;
  function onResize(){
    if(resizeQueued)return;
    resizeQueued=true;
    requestAnimationFrame(()=>{resizeQueued=false;render();});
  }
  window.addEventListener('resize',onResize);
  if('ResizeObserver' in window){
    const observer=new ResizeObserver(onResize);
    observer.observe(host);
  }
  render();
  window.evolvingMicrostructureDemo={
    play,pause:()=>{stop();render();},
    reset:()=>{stop();state.phase=0;render();},
    setTime:value=>{state.phase=clamp01(Number(value)||0);if(state.phase>=1)stop();render();},
    getState:()=>({tOverT:state.phase,playing:state.playing,
      selectedX:state.selectedX,selectedY:state.selectedY,
      localAreaFraction:localArea(state.selectedX,state.phase),
      epsilon:[1/4,1/8,1/16]})
  };
})();
