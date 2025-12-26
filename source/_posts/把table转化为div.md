---
title: 把table转化为div
categories: 前端开发
date: 2025-05-28 15:05:28
tags: [html, table, div, 布局, 重构]
---
```javascript
  nextTick(() => {
    document.querySelectorAll('table').forEach((table, idx) => {
      // 创建div容器并插入到表格后面
      const div = document.createElement('div')
      div.className = 'divTableContainer'
      // div.style.margin = '20px';
      // div.style.padding = '10px';
      // div.style.border = '1px solid #ddd';
      table.parentNode.insertBefore(div, table.nextSibling)
      // 转换表格
      convertTableWithMergedCells(table, div)
    })
    function convertTableWithMergedCells(tableElement, targetContainer) {
      targetContainer.innerHTML = ''
      const rows = Array.from(tableElement.rows)
      const colCount = getTheadColCount(tableElement) // 用thead的列数
      targetContainer.style.display = 'grid'
      targetContainer.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`
      const cellMatrix = []
      rows.forEach((tr, rowIndex) => {
        let colPointer = 0
        if (!cellMatrix[rowIndex]) cellMatrix[rowIndex] = []
        Array.from(tr.cells).forEach(td => {
          while (cellMatrix[rowIndex][colPointer]) colPointer++
          const rowspan = parseInt(td.getAttribute('rowspan') || 1, 10)
          // 这里限制colspan最大不超过colCount
          const colspan = Math.min(parseInt(td.getAttribute('colspan') || 1, 10), colCount - colPointer)
          const cellDiv = document.createElement('div')
          cellDiv.className = 'div-cell'
          cellDiv.innerHTML = td.innerHTML
          cellDiv.style.gridColumn = `${colPointer + 1} / span ${colspan}`
          cellDiv.style.gridRow = `${rowIndex + 1} / span ${rowspan}`
          targetContainer.appendChild(cellDiv)
          for (let r = 0; r < rowspan; r++) {
            for (let c = 0; c < colspan; c++) {
              if (!cellMatrix[rowIndex + r]) cellMatrix[rowIndex + r] = []
              cellMatrix[rowIndex + r][colPointer + c] = true
            }
          }
          colPointer += colspan
        })
      })
    }
    function getTheadColCount(tableElement) {
      const thead = tableElement.querySelector('thead')
      if (!thead) return 0
      const firstRow = thead.rows[0]
      if (!firstRow) return 0
      let colCount = 0
      Array.from(firstRow.cells).forEach(td => {
        colCount += parseInt(td.getAttribute('colspan') || 1, 10)
      })
      return colCount
    }
  })
```
