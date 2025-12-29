---
title: 前端实现手写签名并合并到pdf文件内
categories: 前端开发
date: 2022-07-03 00:00:00
tags: [签名, pdf, canvas, 手写, 文件合并]
updated: 2020-07-06 14:16:54
---
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0">
    <title>合同详情</title>
    <script src="./js/size.js"></script>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
<div class="loadingPngContainer">
    <img src="./loading.png" alt="" class="loadingPng">
    <div class="jiazaizhong">加载中，请稍后...</div>
</div>
<div class="mainBody">
    <div id="canvasContainer_">
        <div id="canvasContainer"></div>
    </div>
    <div class="signature-container" id="signatureContainer">
        <div class="SigningContainer">
            <div class="canvasContainer">
                <div class="area">签名区域</div>
                <canvas id="myCanvas"></canvas>
                <canvas id="signaturePad" disable-scroll="true"></canvas>
                <div class="buttons">
                    <button onclick="clearSignature()" class="regenerate">重签</button>
                    <button onclick="saveSignature()" class="witnessing">确认</button>
                </div>
                <div class="notice">请在空白区域内横向书写</div>
            </div>
        </div>
    </div>
    <div class="_SignatureEntryContainer">
        <div class="_SignatureEntryContainer_">
            <div class="SignatureEntryContainer">
                <div class="Replenishment" onclick="showSignaturePad()">
                    签名(待对方补充)
                </div>
                <div class="imgpreviewContainer">
                    <img src="./delete.png" alt="" class="deleteIcon"
                         onclick="DeleteSignature()">
                    <img src="" alt="" class="imgpreview">
                </div>
            </div>
        </div>
        <div class="here">
            请点击此处进行签约
        </div>
    </div>
    <!-- <div class="total">
    共 <span>1</span> 处签名，已完成 <span>0</span> 处，剩余 <span>1</span> 处
  </div> -->
    <div class="button-container SignACcontract" onclick="showSignaturePad()">签约</div>
    <div class="button-container submit" onclick="submit()">提交</div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script src="./js/index.js?t=1723050133640"></script>
<script src="./js/jq.js"></script>
</body>
</html>
```
```javascript
// 滚动到底部toast提示
let toast = function (params) {
  let time = params.time;
  if (time == undefined || time == '') {
    time = 5;
  }
  let el = document.createElement("div");
  el.setAttribute("class", "web-toast");
  el.innerHTML = params.message;
  document.body.appendChild(el);
  el.classList.add("fadeIn");
  setTimeout(function () {
    el.classList.remove("fadeIn");
    el.classList.add("fadeOut");
    el.addEventListener("animationend", function () {
      document.body.removeChild(el);
    });
    el.addEventListener("webkitAnimationEnd", function () {
      document.body.removeChild(el);
    });
  }, time);
}
// 解析URL
let windowUrl = window.location.href;
let reg = /[?&][^?&]+=[^?&]+/g;
let arr = windowUrl.match(reg);
let params = {};
if (arr) {
  arr.forEach((item) => {
    let tempArr = item.substring(1).split("=");
    let key = tempArr[0];
    let val = tempArr[1];
    params[key] = val;
  });
}
const canvasContainer = document.getElementById('canvasContainer');
function scrollBottom(){
  const scrollTop = canvasContainer.scrollTop;
  const scrollHeight = canvasContainer.scrollHeight;
  const clientHeight = canvasContainer.clientHeight;
  if (scrollTop + clientHeight >= scrollHeight-10) {
    document.querySelector('.button-container').style.display = 'block'
  }
}
const url = params.FilePath;  //真实文件
let serverURL = 'XXX'    
let totalPages = 0;
let pdfDoc = null;
pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
  pdfDoc = pdfDoc_;
  document.querySelector('.loadingPngContainer').style.display = 'flex'
  renderAllPages();
});
// 渲染所有的pdf页面
async function renderAllPages() {
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    document.querySelector('.jiazaizhong').innerHTML = `总共${totalPages}页，正在加载第${pageNum}页`
    await renderPage(pageNum);
  }
  document.querySelector('.loadingPngContainer').style.display = 'none'
  if (params.type=='sign') {
    if (totalPages == 1) {
      document.querySelector('.button-container').style.display = 'block'
    } else {
      toast({
        message: "滑动到底部进行签约",
        time: 1000 * 1
      })
      canvasContainer.addEventListener('scroll', scrollBottom);
    }
  }
}
// 渲染单页pdf
function renderPage(num) {
  return pdfDoc.getPage(num).then(function (page) {
    let viewport = page.getViewport({ scale: 1 });
    let containerWidth = document.getElementById('canvasContainer').clientWidth;
    let scale = containerWidth / viewport.width;
    viewport = page.getViewport({ scale: scale });
    let canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.id = `pdfCanvas${num}`;
    let ctx = canvas.getContext('2d');
    let renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    return page.render(renderContext).promise.then(function () {
      document.getElementById('canvasContainer').appendChild(canvas);
    });
  });
}
// 显示canvas签名板
function showSignaturePad() {
  document.querySelector('.button-container').style.display = 'none';
  document.querySelector('._SignatureEntryContainer').style.display = 'none';
  document.getElementById('signatureContainer').style.display = 'flex';
  let canvas = document.getElementById('signaturePad');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
// 清除签名
function clearSignature() {
  const canvas = document.getElementById('signaturePad');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
let signatureImg_ = null
// 生成签名文件为图片
function saveSignature() {
  const signaturePad = document.getElementById('signaturePad');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = signaturePad.height;
  canvas.height = signaturePad.width;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(signaturePad, -signaturePad.width / 2, -signaturePad.height / 2);
  const img = new Image();
  img.onload = function () {
    const aspectRatio = 1.7;
    let newWidth, newHeight;
    if (img.width > img.height) {
      newWidth = window.innerWidth / 1;
      newHeight = window.innerWidth / 1 / aspectRatio;
    } else {
      newHeight = window.innerWidth / 1;
      newWidth = window.innerWidth / 1 * aspectRatio;
    }
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = newWidth;
    resizedCanvas.height = newHeight;
    const resizedCtx = resizedCanvas.getContext('2d');
    resizedCtx.drawImage(img, 0, 0, newWidth, newHeight);
    const signatureImg = resizedCanvas.toDataURL('image/png');
    document.getElementById('signatureContainer').style.display = 'none';
    document.querySelector('.SignACcontract').style.display = 'none';
    document.querySelector('.submit').style.display = 'block';
    document.querySelector('#canvasContainer').style.height = 'calc(100% - 90rem)';
    document.querySelector('._SignatureEntryContainer').style.display = 'block';
    document.querySelector('.Replenishment').style.display = 'none';
    document.querySelector('.here').style.visibility = 'hidden';
    document.querySelector('.imgpreview').style.display = 'block';
    document.querySelector('.deleteIcon').style.display = 'block';
    document.querySelector('.imgpreview').setAttribute('src', signatureImg);
    signatureImg_ = signatureImg;
  };
  img.src = canvas.toDataURL('image/png');
}
function submit() {
  document.querySelector('.loadingPngContainer').style.display = 'flex';
  document.querySelector('.mainBody').style.display = 'none';
  document.querySelector('.SignACcontract').display = 'none'
  document.querySelector('.jiazaizhong').innerHTML = `上传中，请稍后...`;
  drawSignatureInRoundedRect(signatureImg_);
  document.querySelector('.SignatureEntryContainer').style.display = 'none';
}
function DeleteSignature() {
  document.querySelector('.deleteIcon').style.display = 'none';
  document.querySelector('._SignatureEntryContainer').style.display = 'none';
  document.querySelector('.Replenishment').style.display = 'block';
  document.querySelector('.here').style.visibility = 'visible';
  signatureImg_ = null
  document.querySelector('.SignACcontract').style.display = 'block';
  document.querySelector('.submit').style.display = 'none';
}
function drawSignatureInRoundedRect(signatureImg) {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  const containerWidth = window.innerWidth / 3;
  const aspectRatio = 1.7;
  const containerHeight = containerWidth / aspectRatio;
  canvas.width = containerWidth;
  canvas.height = containerHeight;
  const rectX = 0;
  const rectY = 0;
  const rectWidth = canvas.width;
  const rectHeight = canvas.height;
  const radius = 10;
  strokeRoundRect(ctx, rectX, rectY, rectWidth, rectHeight, radius, 2, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)');
  const img = new Image();
  img.onload = function () {
    const padding = 0.1 * rectWidth;
    const imgX = rectX + padding;
    const imgY = rectY + padding;
    const imgWidth = rectWidth - 2 * padding;
    const imgHeight = rectHeight - 2 * padding;
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
    const signatureImgData = canvas.toDataURL('image/png');
    addSignatureToLastPage(signatureImgData);
  };
  img.src = signatureImg;
}
function drawRoundRectPath(cxt, width, height, radius) {
  cxt.beginPath();
  cxt.moveTo(radius, 0);
  cxt.lineTo(width - radius, 0);
  cxt.arc(width - radius, radius, radius, -Math.PI / 2, 0);
  cxt.lineTo(width, height - radius);
  cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
  cxt.lineTo(radius, height);
  cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
  cxt.lineTo(0, radius);
  cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
  cxt.closePath();
}
function strokeRoundRect(cxt, x, y, width, height, radius, lineWidth, strokeColor, fillColor) {
  if (2 * radius > width || 2 * radius > height) {
    return false;
  }
  cxt.save();
  cxt.translate(x, y);
  if (fillColor) {
    cxt.fillStyle = fillColor;
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fill();
  }
  cxt.lineWidth = lineWidth || 2;
  cxt.strokeStyle = strokeColor || "#000";
  drawStraightEdges(cxt, width, height, radius);
  cxt.stroke();
  cxt.lineWidth = lineWidth / 2 || 1;
  cxt.strokeStyle = strokeColor || "#000";
  drawRoundedCorners(cxt, width, height, radius);
  cxt.stroke();
  cxt.restore();
}
function drawStraightEdges(cxt, width, height, radius) {
  cxt.beginPath();
  cxt.moveTo(radius, 0);
  cxt.lineTo(width - radius, 0);
  cxt.moveTo(width, radius);
  cxt.lineTo(width, height - radius);
  cxt.moveTo(width - radius, height);
  cxt.lineTo(radius, height);
  cxt.moveTo(0, height - radius);
  cxt.lineTo(0, radius);
  cxt.closePath();
}
function drawRoundedCorners(cxt, width, height, radius) {
  cxt.beginPath();
  cxt.moveTo(radius, 0);
  cxt.arc(width - radius, radius, radius, -Math.PI / 2, 0);
  cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
  cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
  cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
  cxt.closePath();
}
// 把手写签名绘制到最后一页pdf文件内
function addSignatureToLastPage(signatureImg) {
  const canvas = document.querySelector(`#pdfCanvas${pdfDoc.numPages}`);
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = function () {
    const x = canvas.width - img.width - 10;
    const y = canvas.height - img.height - 10;
    ctx.drawImage(img, x, y);
    downloadPDF()
  };
  img.src = signatureImg;
}
let isDrawing = false;
let lastX = 0;
let lastY = 0;
const signaturePad = document.getElementById('signaturePad');
signaturePad.addEventListener('mousedown', startDrawing);
signaturePad.addEventListener('mousemove', draw);
signaturePad.addEventListener('mouseup', stopDrawing);
signaturePad.addEventListener('mouseout', stopDrawing);
signaturePad.addEventListener('touchstart', startDrawing);
signaturePad.addEventListener('touchmove', draw);
signaturePad.addEventListener('touchend', stopDrawing);
function startDrawing(e) {
  e.preventDefault();
  isDrawing = true;
  const rect = e.target.getBoundingClientRect();
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  lastX = clientX - rect.left;
  lastY = clientY - rect.top;
}
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const ctx = signaturePad.getContext('2d');
  ctx.strokeStyle = 'black';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  const rect = e.target.getBoundingClientRect();
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  const newX = clientX - rect.left;
  const newY = clientY - rect.top;
  ctx.lineTo(newX, newY);
  ctx.stroke();
  lastX = newX;
  lastY = newY;
}
function stopDrawing(e) {
  e.preventDefault();
  isDrawing = false;
}
function downloadPDF() {
  const canvasContainer = document.getElementById('canvasContainer');
  const canvasElements = canvasContainer.getElementsByTagName('canvas');
  const pdf = new window.jspdf.jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4',
    compress: true
  });
  // 遍历所有 canvas 元素并将其内容添加到 PDF 中
  for (let i = 0; i < canvasElements.length; i++) {
    const canvas = canvasElements[i];
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    if (i > 0) {
      pdf.addPage();
    }
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
    const canvasWidth = canvas.width * ratio;
    const canvasHeight = canvas.height * ratio;
    const marginX = (pdfWidth - canvasWidth) / 2;
    const marginY = (pdfHeight - canvasHeight) / 2;
    pdf.addImage(imgData, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
  }
  // 获取生成的 PDF 文件 Blob 对象
  const pdfBlob = pdf.output('blob', { type: 'application/pdf' });
  // 调用分块上传函数
  uploadInChunks(pdfBlob);
}
function uploadInChunks(blob, chunkSize = 1024 * 1024) { // 1MB chunks
  const totalChunks = Math.ceil(blob.size / chunkSize);
  let chunkIndex = 0;
  function uploadNextChunk() {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, blob.size);
    const chunk = blob.slice(start, end);
    const formData = new FormData();
    formData.append('file', chunk, `chunk_${chunkIndex}.pdf`);
    formData.append('chunkIndex', chunkIndex);
    formData.append('totalChunks', totalChunks);
    formData.append('url', params.FilePath);
    formData.append('esign_id', params.esign_id);
    formData.append('from_user_id', params.from_user_id);
    formData.append('user_id', params.user_id);
    $.ajax({
      type: 'POST',
      url: serverURL,
      data: formData,
      processData: false,
      contentType: false,
      timeout: 1000 * 60 * 10, 
      success: function (response) {
        console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`);
        document.querySelector('.jiazaizhong').innerHTML = `${(chunkIndex / totalChunks * 100).toFixed(2)}%`;
        chunkIndex++;
        if (chunkIndex < totalChunks) {
          uploadNextChunk();
        } else {
          console.log('All chunks uploaded successfully');
          document.querySelector('.loadingPngContainer').style.display = 'none';
          document.querySelector('.submit').style.display = 'none';
          document.querySelector('.mainBody').style.display = 'block';
          toast({
            message: "上传成功",
            time: 1000 * 1
          })
          canvasContainer.removeEventListener('scroll', scrollBottom)
        }
      },
      error: function (xhr, status, error) {
        document.querySelector('.loadingPngContainer').style.display='none'
        toast({
          message: "签约失败，请重新提交",
          time: 1000 * 3
        })
          document.querySelector('.mainBody').style.display = 'block'
      }
    });
  }
  uploadNextChunk();
}
```
