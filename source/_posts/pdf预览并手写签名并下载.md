---
title: pdf预览并手写签名并下载
categories: 前端开发
date: 2024-07-22 23:38:44
tags: [pdf, 签名, 预览, 下载, canvas]
---

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF.js Drawing Example</title>
    <style>
        canvas {
            border: 1px solid black;
            display: block;
            margin: 20px 0;
        }
        .canvasWrapper {
            position: relative;
        }
        .button-container {
            margin: 20px 0;
            position: fixed;
            z-index: 1000000000;
            left: 0;
            top: 0;
        }
        .signature-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            flex-direction: column;
            align-items: center;
            background: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
<div id="canvasContainer"></div>
<div class="button-container">
    <button class="download-btn" onclick="downloadPDF()">Download PDF</button>
    <button class="sign-btn" onclick="showSignaturePad()">Add Signature</button>
</div>
<div class="signature-container" id="signatureContainer">
    <canvas id="signaturePad" width="400" height="200" style="border:1px solid black;"></canvas>
    <button onclick="clearSignature()">Clear</button>
    <button onclick="saveSignature()">Save Signature</button>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script>
    // const url = './old.pdf'; // Update with the correct path to your PDF file
    const url = 'http://localhost:3000/'; // Update with the correct path to your PDF file
    let pdfDoc = null;
    let scale = 1.5;

    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        renderAllPages();
    });

    async function renderAllPages() {
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            await renderPage(pageNum);
        }
    }

    function renderPage(num) {
        return pdfDoc.getPage(num).then(function(page) {
            let viewport = page.getViewport({ scale: scale });

            let canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.id = `pdfCanvas${num}`;
            let ctx = canvas.getContext('2d');

            let renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            return page.render(renderContext).promise.then(function() {
                document.getElementById('canvasContainer').appendChild(canvas);
            });
        });
    }

    function showSignaturePad() {
        document.getElementById('signatureContainer').style.display = 'flex';
    }

    function clearSignature() {
        const canvas = document.getElementById('signaturePad');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function saveSignature() {
        const signaturePad = document.getElementById('signaturePad');
        const signatureImg = signaturePad.toDataURL('image/png');

        document.getElementById('signatureContainer').style.display = 'none';

        addSignatureToLastPage(signatureImg);
    }

    function addSignatureToLastPage(signatureImg) {
        const canvas = document.querySelector(`#pdfCanvas${pdfDoc.numPages}`);
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = function() {
            const x = canvas.width - img.width - 10; // 10px padding from right
            const y = canvas.height - img.height - 10; // 10px padding from bottom
            ctx.drawImage(img, x, y);
        };
        img.src = signatureImg;
    }

    // Drawing functionality on the signature pad
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const signaturePad = document.getElementById('signaturePad');
    signaturePad.addEventListener('mousedown', startDrawing);
    signaturePad.addEventListener('mousemove', draw);
    signaturePad.addEventListener('mouseup', stopDrawing);
    signaturePad.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;
        const ctx = signaturePad.getContext('2d');
        ctx.strokeStyle = 'red';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Download PDF functionality
    function downloadPDF() {
        const canvasContainer = document.getElementById('canvasContainer');
        const canvasElements = canvasContainer.getElementsByTagName('canvas');
        const pdf = new window.jspdf.jsPDF();

        for (let i = 0; i < canvasElements.length; i++) {
            const canvas = canvasElements[i];
            const imgData = canvas.toDataURL('image/png');

            if (i > 0) {
                pdf.addPage();
            }

            pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        }

        pdf.save('download.pdf');
    }
</script>
</body>
</html>
```
