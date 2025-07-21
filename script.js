canvases.forEach((canvas, idx) => {
  const ctx = canvas.getContext('2d');
  let painting = false;

  // 터치 위치 계산 함수
  function getPos(e) {
    if (e.touches) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }

  function startDraw(e) {
    painting = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function endDraw() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;
    const pos = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault(); // 터치 스크롤 방지
  }

  // 마우스 이벤트
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseout', endDraw);
  canvas.addEventListener('mousemove', draw);

  // 터치 이벤트
  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('touchend', endDraw);
  canvas.addEventListener('touchcancel', endDraw);
  canvas.addEventListener('touchmove', draw);
});
