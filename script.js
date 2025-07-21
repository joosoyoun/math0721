// 그림판 기능 및 async function loadCanvas(index) {
  const studentName = localStorage.getItem("studentName");
  if (!studentName) return;

  const { data } = await supabase
    .from("drawings")
    .select("*")
    .eq("student_name", studentName)
    .eq("canvas_index", index)
    .order("created_at", { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    const canvas = document.getElementById(`canvas${index}`);
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = data[0].image_data;
  }
}
저장/불러오기/지우기
const CANVAS_COUNT = 5;

for (let i = 0; i < CANVAS_COUNT; i++) {
  const canvas = document.getElementById('canvas' + i);
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let last = {x:0, y:0};

  // 불러오기
  const saved = localStorage.getItem('canvas' + i);
  if (saved) {
    const img = new window.Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = saved;
  }

  // 마우스/터치 좌표 변환
  function getXY(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
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

  // 그리기 이벤트
  function startDraw(e) {
    drawing = true;
    last = getXY(e);
  }
  function moveDraw(e) {
    if (!drawing) return;
    e.preventDefault();
    const now = getXY(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#e0558c';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(now.x, now.y);
    ctx.stroke();
    last = now;
  }
  function endDraw() {
    drawing = false;
  }

  // 마우스 이벤트
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  // 터치 이벤트
  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('touchmove', moveDraw);
  canvas.addEventListener('touchend', endDraw);
}

// 저장
function saveCanvas(idx) {
  const canvas = document.getElementById('canvas' + idx);
  localStorage.setItem('canvas' + idx, canvas.toDataURL());
  const btn = canvas.parentElement.querySelector('.save');
  btn.textContent = '저장됨!';
  setTimeout(() => { btn.textContent = '저장'; }, 1000);
}
// 지우기
function clearCanvas(idx) {
  const canvas = document.getElementById('canvas' + idx);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem('canvas' + idx);
} 

async function loadCanvas(index) {
  const studentName = localStorage.getItem("studentName");
  if (!studentName) return;

  const { data, error } = await supabase
    .from("drawings")
    .select("*")
    .eq("student_name", studentName)
    .eq("canvas_index", index)
    .order("created_at", { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    const canvas = document.getElementById(`canvas${index}`);
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = data[0].image_data;
  }
}
