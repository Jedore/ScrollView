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
 *  colNo: from 0 to colNum-1
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
    colTitle: options.colTitle || [],
    rcBgColor: chartUtil.deepCopy(options.rcBgColor) || {rows: [], cols: []},
    titleColor: options.titleColor || "white",
    titleFont: options.titleFont || "15px serif",
    hasTitle: options.hasTitle || true,
    itemContent: options.itemContent || [],
    titleEdgeX: options.titleEdgeX,
    titleEdgeY: options.titleEdgeY,
    itemEdgeX: options.itemEdgeX,
    itemEdgeY: options.itemEdgeY,
    itemFont: options.itemFont || "15px serif",
    itemColor: options.itemColor || "white",

    // some init operate
    init: function() {
    },

    // draw horizontal
    drawXLine: function(){
      this.ctx.strokeStyle = this.lineColor
      for(let i=0; i < this.rowNum+1; i++) {
        let startX = this.edgeLeft;
        let endX = this.edgeLeft + this.width;
        let startY = this.edgeTop + i * this.rowH
        let endY = startY
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
      }
    },

    // draw vertical
    drawYLine: function() {
      this.ctx.strokeStyle = this.lineColor
      for(let i=0; i < this.colNum+1; i++) {
        let startX = this.edgeLeft + i * this.colW
        let endX = startX
        let startY = this.edgeTop
        let endY = startY + this.height
        this.ctx.beginPath()
        this.ctx.moveTo(startX, startY)
        this.ctx.lineTo(endX, endY)
        this.ctx.stroke()
      }
    },

    // draw column title
    drawColTitle: function() {
      let startX = 0
      let startY = this.edgeTop + this.rowH - this.titleEdgeY
      this.ctx.font = this.titleFont
      this.ctx.fillStyle = this.titleColor 
      for(let i=0; i<this.colTitle.length; i++) {
        startX = this.edgeLeft + i * this.colW + this.titleEdgeX
        this.ctx.fillText(this.colTitle[i], startX, startY)
      }
    },

    // draw background color
    drawBgColor: function() {
      let startX, startY
      // for background
      this.ctx.fillStyle = this.bgColor
      this.ctx.fillRect(0, 0, this.width, this.height)
      
      // for column
      for(let i=0; i<this.rcBgColor.cols.length; i++) {
        startX = this.edgeLeft + this.rcBgColor.cols[i][0] * this.colW
        startY = this.hasTitle ? this.edgeTop + this.rowH : this.edgeTop
        this.ctx.fillStyle = this.rcBgColor.cols[i][1]
        this.ctx.fillRect(startX, startY, this.colW, this.hasTitle ? this.height - this.rowH : this.height)
      }
      // for row
      for(let i=0; i<this.rcBgColor.rows.length; i++) {
        startX = this.edgeLeft
        startY = this.edgeTop + this.rcBgColor.rows[i][0] * this.rowH
        this.ctx.fillStyle = this.rcBgColor.rows[i][1]
        this.ctx.fillRect(startX, startY, this.width, this.rowH)
      }

      // for cell
      for(let i=0; i<this.rcBgColor.cells.length; i++){
        startX = this.edgeLeft + this.rcBgColor.cells[i][1] * this.colW
        startY = this.edgeTop + (this.hasTitle ? this.rcBgColor.cells[i][0]+1 : this.rcBgColor.cells[i][0]) * this.rowH
        this.ctx.fillStyle = this.rcBgColor.cells[i][2]
        this.ctx.fillRect(startX, startY, this.colW, this.rowH)
      }
    },

    // draw item content
    drawItem: function() {
      let startX, startY
      this.ctx.font = this.itemFont
      this.ctx.fillStyle = this.itemColor 
      for(let i=0; i<this.itemContent.length; i++) {
        startX = this.edgeLeft + this.itemContent[i][1] * this.colW + this.itemEdgeX
        startY = this.edgeTop + (this.itemContent[i][0] + 1) * this.rowH - this.itemEdgeY
        this.ctx.fillText(this.itemContent[i][2], startX, startY)
      }
    },

    // update item content
    updateItem: function(itemContent) {
      let startX, startY
      for(let i=0; i<itemContent.length; i++) {
        // clear old item
        startX = this.edgeLeft + itemContent[i][1] * this.colW
        startY = this.edgeTop + itemContent[i][0] * this.rowH
        this.ctx.clearRect(startX, startY, this.colW, this.rowH)
        // draw background color
        let itemBgColor
        // traverse cell color
        for(let j=0; j<this.rcBgColor.cells.length; j++){
          if(this.rcBgColor.cells[j][0] === itemContent[i][0] && this.rcBgColor.cells[j][1] === itemContent[i][1]) {
            itemBgColor = this.rcBgColor.cols[j][1]
          }
        }
        // traverse col color
        for(let k=0; k<this.rcBgColor.cols.length; k++){
          if(this.rcBgColor.cols[k][0] === itemContent[i][1]) {
            itemBgColor = this.rcBgColor.cols[k][1]
          }
        }
        // traverse row  color
        for(let l=0; l<this.rcBgColor.rows.length; l++){
          if(this.rcBgColor.rows[l][0] === itemContent[i][0]) {
            itemBgColor = this.rcBgColor.rows[l][1]
          }
        }
        if(!itemBgColor) {
          itemBgColor = this.bgColor
        }
        this.ctx.fillStyle = itemBgColor
        this.ctx.fillRect(startX, startY, this.colW, this.rowH)
        // draw new content
        this.ctx.font = this.itemFont
        this.ctx.fillStyle = this.itemColor 
        startX = this.edgeLeft + itemContent[i][1] * this.colW + this.itemEdgeX
        startY = this.edgeTop + (itemContent[i][0] + 1) * this.rowH - this.itemEdgeY
        this.ctx.fillText(itemContent[i][2], startX, startY)
      }
    },

    draw: function() {
      this.drawBgColor()
      this.drawXLine()
      this.drawYLine()
      this.drawColTitle()
      this.drawItem()
    },
  };
}
