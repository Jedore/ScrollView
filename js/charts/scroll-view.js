/**
 * Scroll view plugin
 * Jedore
 * 2018/05/10
 *
 *
 * rcBgColor: background color
 *    format: 
 *          {
 *            rows: [[rowNo, color], ...],
 *            cols: [[colNo, color], ...],
 *            cells: [[rowNo, colNo, color], ...],
 *          }
 *  itemContent:
 *    format: [
 *              [rowNo, colNo, content], ...
 *            ]
 *
 *  rowNo: from 0 to rowNum-1
 *  colNo: from 0 to colNum-1 (do not think of title)
 *
 *  Think of linewidth, some code do relative deal.
 */

var chartUtil = require('./utils.js')

module.exports = function(ctx, options) {
  return {
    ctx: ctx || null,
    bgColor: options.bgColor || "gray",
    rowNum: options.rowNum,
    colNum: options.colNum,
    rowH: options.rowH,
    colW: options.colW,
    edgeLeft: options.edgeLeft,
    edgeTop: options.edgeTop,
    width: options.width,
    height: options.height,
    lineColor: options.lineColor || "black",
    lineWidth: options.lineWidth || 1.0,
    colTitle: options.colTitle || [],
    rcBgColor: chartUtil.deepCopy(options.rcBgColor) || {rows: [], cols: []},
    titleColor: options.titleColor || "white",
    titleFont: options.titleFont || "15px serif",
    hasTitle: options.hasTitle || true,
    itemContent: options.itemContent || [],
    itemFont: options.itemFont || "15px serif",
    itemColor: options.itemColor || "white",

    // some init operation
    init: function() {
      this.rowH = (this.height - this.lineWidth * (this.rowNum + 1)) / this.rowNum
      this.colW = (this.width - this.lineWidth * (this.colNum + 1)) / this.colNum
    },

    // draw horizontal
    drawXLine: function(){
      let ctx = this.ctx
      ctx.strokeStyle = this.lineColor
      ctx.lineWidth = this.lineWidth
      for(let i=0; i < this.rowNum+1; i++) {
        let startX = this.edgeLeft;
        let endX = this.edgeLeft + this.width;
        let startY = this.edgeTop + i * (this.rowH + this.lineWidth)
        let endY = startY
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    },

    // draw vertical
    drawYLine: function() {
      let ctx = this.ctx
      ctx.strokeStyle = this.lineColor
      ctx.lineWidth = this.lineWidth
      for(let i=0; i < this.colNum+1; i++) {
        let startX = this.edgeLeft + i * (this.colW + this.lineWidth)
        let endX = startX
        let startY = this.edgeTop
        let endY = startY + this.height
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    },

    // draw column title
    drawColTitle: function() {
      let startX = 0
      let startY = this.edgeTop + this.lineWidth + this.rowH / 2
      let ctx = this.ctx
      ctx.font = this.titleFont
      ctx.fillStyle = this.titleColor 
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      for(let i=0; i<this.colTitle.length; i++) {
        startX = this.edgeLeft + this.lineWidth + i * (this.colW + this.lineWidth) + this.colW / 2
        ctx.fillText(this.colTitle[i], startX, startY)
      }
    },

    // draw background color
    drawBgColor: function() {
      let startX, startY, w, h
      // for background
      this.ctx.fillStyle = this.bgColor
      this.ctx.fillRect(this.edgeLeft, this.edgeTop, this.width, this.height)
      
      // for column
      for(let i=0; i<this.rcBgColor.cols.length; i++) {
        startX = this.edgeLeft + this.lineWidth + this.rcBgColor.cols[i][0] * (this.colW + this.lineWidth)
        startY = this.edgeTop + this.lineWidth + (this.hasTitle ? (this.rowH + this.lineWidth) : 0)
        w = this.colW
        h = this.height - 3 * this.lineWidth - (this.hasTitle ? (this.rowH + this.lineWidth) : 0)
        this.ctx.fillStyle = this.rcBgColor.cols[i][1]
        this.ctx.fillRect(startX, startY, w, h)
      }
      // for row
      for(let i=0; i<this.rcBgColor.rows.length; i++) {
        startX = this.edgeLeft + this.lineWidth
        startY = this.edgeTop + this.lineWidth + this.rcBgColor.rows[i][0] * (this.rowH + this.lineWidth)
        w = this.width - 3 * this.lineWidth
        h = this.rowH - this.lineWidth
        this.ctx.fillStyle = this.rcBgColor.rows[i][1]
        this.ctx.fillRect(startX, startY, w, h)
      }

      // for cell
      for(let i=0; i<this.rcBgColor.cells.length; i++){
        startX = this.edgeLeft + this.lineWidth + this.rcBgColor.cells[i][1] * (this.colW + this.lineWidth)
        startY = this.edgeTop + this.lineWidth + this.rcBgColor.cells[i][0] * (this.rowH + this.lineWidth)
        w = this.colW - this.lineWidth
        h = this.rowH - this.lineWidth
        this.ctx.fillStyle = this.rcBgColor.cells[i][2]
        this.ctx.fillRect(startX, startY, w, h)
      }
    },

    // draw item content
    drawItem: function(itemContent) {
      let startX, startY, w, h
      let ctx = this.ctx
      for(let i=0; i<itemContent.length; i++) {
        // clear old item
        startX = this.edgeLeft + this.lineWidth + itemContent[i][1] * (this.colW + this.lineWidth)
        startY = this.edgeTop + this.lineWidth + itemContent[i][0] * (this.rowH + this.lineWidth)
        w = this.colW - this.lineWidth
        h = this.rowH - this.lineWidth
        ctx.clearRect(startX, startY, w, h)
        // draw background color
        let itemBgColor
        // traverse cell color
        if(!itemBgColor) {
          for(let j=0; j<this.rcBgColor.cells.length; j++){
            if(this.rcBgColor.cells[j][0] === itemContent[i][0] && this.rcBgColor.cells[j][1] === itemContent[i][1]) {
              itemBgColor = this.rcBgColor.cols[j][1]
            }
          }
        }
        // traverse row  color
        if(!itemBgColor) {
          for(let l=0; l<this.rcBgColor.rows.length; l++){
            if(this.rcBgColor.rows[l][0] === itemContent[i][0]) {
              itemBgColor = this.rcBgColor.rows[l][1]
            }
          }
        }
        // traverse col color
        if(!itemBgColor) {
          for(let k=0; k<this.rcBgColor.cols.length; k++){
            if(this.rcBgColor.cols[k][0] === itemContent[i][1]) {
              itemBgColor = this.rcBgColor.cols[k][1]
            }
          }
        }
        if(!itemBgColor) {
          itemBgColor = this.bgColor
        }
        ctx.fillStyle = itemBgColor
        ctx.fillRect(startX, startY, w, h)
        // draw new content
        ctx.font = this.itemFont
        ctx.fillStyle = this.itemColor 
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        startX = this.edgeLeft + this.lineWidth + itemContent[i][1] * (this.colW + this.lineWidth) + this.colW / 2
        startY = this.edgeTop + this.lineWidth + itemContent[i][0] * (this.rowH + this.lineWidth) + this.rowH / 2
        ctx.fillText(itemContent[i][2], startX, startY)
      }
    },

    draw: function() {
      this.drawBgColor()
      this.drawXLine()
      this.drawYLine()
      this.drawColTitle()
    },
  };
}
