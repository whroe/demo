    (function falls(obj){
       var container = document.querySelector(obj.dom)
      var oldCols = 0
      var cols = 0
      var imageWidth = 300
      var boxBorder = obj.boxBorder
      var boxPadding = obj.boxPadding
      var boxMarginRight = obj.boxMarginRight
      var boxMarginBottom = obj.boxMarginBottom
      var boxWidth = imageWidth + boxBorder * 2 + boxPadding * 2
  
      var imgInfoList =obj.imgList 
  
      var colHeightList = []  // 每列的高度
      var colLeftList = []
  
      /**
       * 创建元素并排列
       * @param imgInfoList
       */
      function fallImages (imgInfoList) {
        var fragment = document.createDocumentFragment()
        var minColHeight, minIndex, boxHeight
        for (var i = 0; i < imgInfoList.length; i++) {
          // 创建img-box
          var oImgBox = document.createElement('div')
          oImgBox.className = 'img-box'
          var oImg = document.createElement('img')
          oImg.src = imgInfoList[i].src
          oImgBox.appendChild(oImg)
  
          boxHeight = parseFloat((imgInfoList[i].height * (imageWidth / imgInfoList[i].width) + boxBorder * 2 + boxPadding * 2).toFixed(2))
          // 获取最短列高及对应的下标
          minColHeight = Math.min.apply(Math, colHeightList)
          minIndex = colHeightList.indexOf(minColHeight)
          oImgBox.style.top = (minColHeight + boxMarginBottom) + 'px'
          oImgBox.style.left = colLeftList[minIndex]
          oImgBox.style.height = boxHeight + 'px'
  
          fragment.appendChild(oImgBox)
  
          oImgBox.height = imgInfoList[i].height
          oImgBox.width = imgInfoList[i].width
  
          // 更新列高
          colHeightList[minIndex] += (boxMarginBottom + boxHeight)
        }
  
        container.appendChild(fragment)
  
        container.style.height = Math.max.apply(Math, colHeightList) + 'px'
      }
  
      /**
       * 模拟后台返回数据
       * @returns {Array}
       */
      function moreFakeImgInfo () {
        var createCount = 20
        var moreImgInfoList = []
        var imgLength = imgInfoList.length
        // 从原数据随机获取组成新数组
        for (var i = 0; i < createCount; i++) {
          moreImgInfoList.push(imgInfoList[parseInt(Math.random() * (imgLength - 1))])
        }
        return moreImgInfoList
      }
  
      /**
       * 行宽改变重新排列
       */
      window.onresize = function () {
        oldCols = cols
        cols = parseInt((document.documentElement.clientWidth * 0.9 + boxMarginRight) / boxWidth)
        container.style.width = (boxWidth * cols + boxMarginRight * (cols - 1)) + 'px'
        // 最大可容纳列数改变
        if (oldCols !== cols) {
          var imageBoxList = container.getElementsByClassName('img-box')
          colHeightList = []
          colLeftList = []
          var minColHeight, minIndex
          for (var i = 0; i < imageBoxList.length; i++) {
            if (i < cols) {  // 初始化第一行
  
              imageBoxList[i].style.top = 0
              imageBoxList[i].style.left = (i === 0 ? 0 : (boxWidth + boxMarginRight) * i) + 'px'
  
              colHeightList.push(parseFloat((imageBoxList[i].height * (imageWidth / imageBoxList[i].width) + boxBorder * 2 + boxPadding * 2).toFixed(2)))
              colLeftList.push(i === 0 ? '0px' : (boxWidth + boxMarginRight) * i + 'px')
  
            }
            else {  // 对后面的元素重新排列
              minColHeight = Math.min.apply(Math, colHeightList)
              minIndex = colHeightList.indexOf(minColHeight)
              imageBoxList[i].style.top = (minColHeight + boxMarginBottom) + 'px'
              imageBoxList[i].style.left = colLeftList[minIndex]
  
              colHeightList[minIndex] += parseFloat(parseFloat((boxMarginBottom + imageBoxList[i].height * (imageWidth / imageBoxList[i].width) + boxBorder * 2 + boxPadding * 2).toFixed(2)))
            }
          }
          container.style.height = Math.max.apply(Math, colHeightList) + 'px'
        }
      }
  
      window.onload = function () {
        cols = parseInt((document.documentElement.clientWidth * 0.9 + boxMarginRight) / boxWidth)
        container.style.width = (boxWidth * cols + boxMarginRight * (cols - 1)) + 'px'
  
        var boxHeight
        var fragment = document.createDocumentFragment()  // 创建文档碎片
        for (var i = 0; i < imgInfoList.length; i++) {
          if (i < cols) {  // 只加载第一行
  
            var oImgBox = document.createElement('div')
            oImgBox.className = 'img-box'
            var oImg = document.createElement('img')
            oImg.src = imgInfoList[i].src
            oImgBox.appendChild(oImg)
  
            boxHeight = parseFloat((imgInfoList[i].height * (imageWidth / imgInfoList[i].width) + boxBorder * 2 + boxPadding * 2).toFixed(2))
            oImgBox.style.top = 0
            oImgBox.style.left = (i === 0 ? 0 : (boxWidth + boxMarginRight) * i) + 'px'
            oImgBox.style.height = boxHeight + 'px'
            fragment.appendChild(oImgBox)
  
            oImgBox.height = imgInfoList[i].height
            oImgBox.width = imgInfoList[i].width
  
            colHeightList.push(boxHeight)
            colLeftList.push(i === 0 ? '0px' : (boxWidth + boxMarginRight) * i + 'px')
          }
          else {
            break
          }
        }
        container.appendChild(fragment)
        fallImages(imgInfoList.slice(cols))  // 排列余下的元素
      }
  
      var end = obj.infinite
      var time = 0 // TODO
      /**
       * 下拉展示“新数据”
       */
      window.onscroll = function () {
        if (!end) {  // 已展示完
          return
        }
        var scrolledHeight = document.documentElement.scrollTop || document.body.scrollTop
        if (scrolledHeight + document.documentElement.clientHeight > Math.min.apply(null, colHeightList)) {
          // TODO 这里需要从后台获取数据
          var newImgInfoList = moreFakeImgInfo()
          fallImages(newImgInfoList)
          if (time++ > 3) {
            end = 1
          }
        }
      }
    }(window.fallsObject))