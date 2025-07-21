
import { supabase } from './supabase.js';

const canvases = document.querySelectorAll('canvas');
let studentName = '';

document.getElementById('saveNameBtn').addEventListener('click', () => {
  studentName = document.getElementById('studentNameInput').value;
  if (!studentName) return alert('학생 이름을 입력하세요.');
  document.getElementById('nameBlock').style.display = 'none';
  loadAllCanvases();
});

canvases.forEach((canvas, idx) => {
  const ctx = canvas.getContext('2d');
  let painting = false;

  canvas.addEventListener('mousedown', () => painting = true);
  canvas.addEventListener('mouseup', () => painting = false);
  canvas.addEventListener('mousemove', draw);

  function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }
});

async function loadAllCanvases() {
  for (let i = 0; i < canvases.length; i++) {
    const { data, error } = await supabase
      .from('drawings')
      .select('image_data')
      .eq('student_name', studentName + '_' + i)
      .single();

    if (data) {
      const img = new Image();
      img.onload = () => canvases[i].getContext('2d').drawImage(img, 0, 0);
      img.src = data.image_data;
    }
  }
}

window.clearCanvas = function(idx) {
  const canvas = canvases[idx];
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

window.saveCanvas = async function(idx) {
  if (!studentName) return alert('학생 이름을 먼저 입력하세요.');
  const canvas = canvases[idx];
  const dataUrl = canvas.toDataURL();
  await supabase.from('drawings').upsert({
    student_name: studentName + '_' + idx,
    image_data: dataUrl
  });
  alert('저장되었습니다!');
};
