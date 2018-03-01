(function() {
  var c=document.getElementById("circuit");
  var cLeft = c.offsetLeft;
  var cTop = c.offsetTop;
  var ctx=c.getContext("2d");

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1;

  //定义变量
  var PADDING = 5;
  var GRID_WIDTH = 35;//水平格子数
  var GRID_HEIGHT = 35;//垂直格子数
  var WIDTH = 20;//方块宽度,单位像素
  var HEIGHT = 20;//方块高度,单位像素
  var POWER = 10;//初始电能

  var blocks = [];
  for (var i=0;i<GRID_WIDTH;i++) {
    var a = [];
    for (var j=0;j<GRID_HEIGHT;j++) {
      a[j] = {
        type: '',
      };
    }
    blocks.push(a);
  }

  //需要更新的方块列表
  var updates = {};

  //所有绘制器
  var DRAWERS = {};
  DRAWERS[''] = function(gridX, gridY) {//空
    drawFrame(gridX, gridY);
  }
  DRAWERS['e'] = function(gridX, gridY) {//电线
    drawFrame(gridX, gridY);
    var block = blocks[gridX][gridY];
    if (block.data.power) drawText(gridX, gridY, block.data.power+'', 'green');
    else drawText(gridX, gridY, 'e');
  }
  DRAWERS['s'] = function(gridX, gridY) {//电源
    drawFrame(gridX, gridY);
    drawText(gridX, gridY, 's', 'red');
  }
  DRAWERS['i'] = function(gridX, gridY) {//电灯
    drawFrame(gridX, gridY);
    var block = blocks[gridX][gridY];
    if (block.data.active) drawText(gridX, gridY, 'i', 'green');
    else drawText(gridX, gridY, 'i');
  }
  //所有更新器
  var UPDATERS = {};
  UPDATERS['e'] = function(gridX, gridY) {
    var block = blocks[gridX][gridY];
    var power = getNearbyPower(gridX, gridY);
    if (block.data.power !== power) {
      setBlock(gridX, gridY, 'e', {
        power: power
      });
    }
  }
  UPDATERS['i'] = function(gridX, gridY) {
    var block = blocks[gridX][gridY];
    var active = getNearbyPower(gridX, gridY) > 0;
    if (active ^ block.data.active) {
      setBlock(gridX, gridY, 'i', {
        active: active
      });
    }
  }
  //所有类型
  var TYPES = ['', 'e', 's', 'i'];

  //检测更新指定方块
  var update = function(gridX, gridY) {
    var block = blocks[gridX][gridY];
    var updater = UPDATERS[block.type];
    if (updater) updater(gridX, gridY);
  }

  //获取指定位置由附近传入的最大电能(不包括本身)
  var getNearbyPower = function(gridX, gridY) {
    var power = 0;
    var block = blocks[gridX][gridY];
    power = Math.max(power, getPower(gridX-1, gridY)-1);
    power = Math.max(power, getPower(gridX+1, gridY)-1);
    power = Math.max(power, getPower(gridX, gridY-1)-1);
    power = Math.max(power, getPower(gridX, gridY+1)-1);
    return power;
  }

  //获取指定位置的电能
  var getPower = function(gridX, gridY) {
    if (gridX >= 0 && gridX < GRID_WIDTH) {
      if (gridY >= 0 && gridY < GRID_HEIGHT) {
        var block = blocks[gridX][gridY];
        if (block.type === 's') {
          return POWER;
        }
        if (block.type === 'e') {
          return block.data.power || 0;
        }
      }
    }
    return 0;
  }

  //清除矩形
  var drawBlank = function(gridX, gridY) {
    ctx.clearRect(gridX*WIDTH, gridY*HEIGHT, WIDTH, HEIGHT);
  }

  //绘制文字
  var drawText = function(gridX, gridY, text, color) {
    ctx.fillStyle = color || 'black';
    ctx.font = '18px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline="middle";
    ctx.fillText(text, gridX*WIDTH+WIDTH/2, gridY*HEIGHT+HEIGHT/2);
  }

  //绘制方块框
  var drawFrame = function(gridX, gridY) {
    ctx.strokeStyle = 'gray';
    ctx.strokeRect(gridX*WIDTH+1, gridY*HEIGHT+1, WIDTH-2, HEIGHT-2);
  }

  //刷新
  var refresh = function(gridX, gridY) {
    var block = blocks[gridX][gridY];
    drawBlank(gridX, gridY);
    var drawer = DRAWERS[block.type];
    drawer(gridX, gridY);
  }

  //刷新全部
  var refreshAll = function() {
    for (var x=0;x<GRID_WIDTH;x++) {
      for (var y=0;y<GRID_HEIGHT;y++) {
        refresh(x, y);
      }
    }
  }

  //设置方块
  var setBlock = function(gridX, gridY, type, data) {
    //判断是否与当前一样
    var block = blocks[gridX][gridY];
    if (type === block.type && isDataEquals(data, block.data)) {
      return;
    }
    //更新数据
    blocks[gridX][gridY] = {
      type: type,
      data: data || {},
    };
    //添加更新
    update(gridX, gridY);//本身
    addNearbyUpdates(gridX, gridY);//附近
    //更新显示
    refresh(gridX, gridY);
  }

  var addNearbyUpdates = function(gridX, gridY) {
    addUpdate(gridX-1, gridY);
    addUpdate(gridX+1, gridY);
    addUpdate(gridX, gridY-1);
    addUpdate(gridX, gridY+1);
  }

  var addUpdate = function(gridX, gridY) {
    if (gridX >= 0 && gridX < GRID_WIDTH) {
      if (gridY >= 0 && gridY < GRID_HEIGHT) {
        updates[gridX+' '+gridY] = true;
      }
    }
  }

  //切换
  var toggle = function(gridX, gridY) {
    var block = blocks[gridX][gridY];
    var index = TYPES.indexOf(block.type);
    if (++index >= TYPES.length) index = 0;
    setBlock(gridX, gridY, TYPES[index]);
  }

  //判断两个data是否相同
  var isDataEquals = function(data1, data2) {
    var k;
    if (!data1) data1 = {};
    if (!data2) data2 = {};
    for (k in data1) {
      if (data2[k] !== data1[k]) return false;
    }
    for (k in data2) {
      if (data1[k] !== data2[k]) return false;
    }
    return true;
  }

  c.addEventListener('click', function(event) {
    var x = event.pageX - cLeft - PADDING;
    var y = event.pageY - cTop - PADDING;
    var gridX = parseInt(x/WIDTH);
    var gridY = parseInt(y/HEIGHT);
    toggle(gridX, gridY);
  });

  //计时器: 更新检测
  setInterval(function() {
    var updates_ = JSON.parse(JSON.stringify(updates));
    updates = {};
    for (var k in updates_) {
      var vv = k.split(' ');
      var gridX = parseInt(vv[0]);
      var gridY = parseInt(vv[1]);
      update(gridX, gridY);
    }
  }, 500);

  refreshAll();
})();
