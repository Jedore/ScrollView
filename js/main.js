var gScrollView= require('./charts/scroll-view.js')
var chartUtil = require('./charts/utils.js')



/**
 */
export default class Main {
  constructor() {
    this.optionSV = {
      bgColor: "#1C1F27",
      rowNum: 20,
      colNum: 5,
      edgeLeft: 30,
      edgeRight: 30,
      edgeTop: 100,
      edgeBottom: 100,
      width: 200,
      height: 400,
      lineColor: "white",
      colTitle: ["Col0", "Col1", "Col2", "Col3", "Col4"],
      titleColor: "white",
      rcBgColor: {
        rows: [[0, "blue"]],
        cols: [[2, "purple"]],
        cells:[[4, 0, "yellow"], [3, 3, "green"]],
      },
      hasTitle: true,
      
    }
    this.scrollView = null

    this.initial()
  }

  // init
  initial() {
    wx.getSystemInfo({
      success: info => {
        this.optionSV.height = info.windowHeight - this.optionSV.edgeBottom - this.optionSV.edgeTop
        this.optionSV.width = info.windowWidth - this.optionSV.edgeLeft - this.optionSV.edgeRight
      }
    })

    // background
    this.canvas = wx.createCanvas()
    let sw = this.canvas.width
    let sh = this.canvas.height
    var ctx = this.canvas.getContext('2d')
    ctx.fillStyle = "#1C1F27"
    ctx.fillRect(0, 0, sw, sh)

    this.ctx = ctx

    let itemContent = [
        [1, 2, "row1"], 
        [2, 2, "row2"],
        [3, 2, "row3"],
        [5, 2, "row5"],
        [7, 2, "row7"],
        [9, 2, "row9"],
      ]
    this.scrollView = gScrollView(this.ctx, this.optionSV)
    this.scrollView.init()
    this.scrollView.draw()
    this.scrollView.drawItem(itemContent)
  }
}

