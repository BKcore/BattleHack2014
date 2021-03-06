// Generated by CoffeeScript 1.6.3
(function() {
  var LAYER_COUNT, MAX_WIDTH, MIN_SWIPE_DELAY, MIN_SWIPE_DISTANCE, MIN_TOUCH_DELAY, SWIPE_INCREMENT_X, asyncLoop, barrier, createImage, createText, debounce, drawAll, fetchAll, initController, items, tweenLayersParallax, tweenToX;

  MAX_WIDTH = 6000;

  MIN_SWIPE_DELAY = 1000;

  MIN_SWIPE_DISTANCE = 50;

  MIN_TOUCH_DELAY = 2000;

  SWIPE_INCREMENT_X = window.innerWidth;

  LAYER_COUNT = 1;

  items = null;

  $(function() {
    return fetchAll(function() {
      return drawAll();
    });
  });

  fetchAll = function(cb) {
    Events.getConcerts(37.7833, -122.4167, function(data) {
      var e;
      items = (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          e = data[_i];
          if (e.performers[0].image != null) {
            _results.push([e.title, e.performers[0].image, e.venue.name, e.datetime_local, (_ref = e.stats.lowest_price) != null ? _ref : Math.random() * 40 + 10]);
          }
        }
        return _results;
      })();
      console.log(items);
      return cb();
    });
  };

  drawAll = function() {
    var i, imagesPerLayer, layers, stage, tweens, viewport, win, _fn, _i, _j, _ref;
    viewport = {
      x: 0,
      y: 0
    };
    win = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    stage = new Kinetic.Stage({
      container: 'main',
      width: win.width,
      height: win.height
    });
    layers = [];
    imagesPerLayer = Math.floor(items.length - 1 / LAYER_COUNT);
    _fn = function(i) {
      var layer, light, nx;
      light = -(i / LAYER_COUNT);
      layer = new Kinetic.Layer();
      stage.add(layer);
      layers.push({
        layer: layer,
        x: 0,
        tween: null
      });
      nx = 0;
      return asyncLoop(imagesPerLayer, function(k, done) {
        var cur, h, url, w, x, y;
        console.log('layer', i, 'image', k, '/', imagesPerLayer);
        cur = items[k];
        if (cur == null) {
          throw new Error('Moche image');
        }
        w = 500;
        h = 400;
        x = nx;
        nx += w + 20;
        y = 100;
        url = cur[1];
        return createImage(layer, url, w, h, x, y, function(image) {
          var rect, rect2, text;
          layer.add(image);
          rect2 = new Kinetic.Rect({
            x: x - 1,
            y: y - 1,
            width: w + 1,
            height: 100,
            fill: 'black',
            opacity: 0.4
          });
          layer.add(rect2);
          text = new Kinetic.Text({
            x: x,
            y: y,
            width: w,
            height: h,
            opacity: 1,
            fill: '#fff',
            fontFamily: 'Helvetica',
            fontSize: 20,
            padding: 20,
            shadowColor: 'black',
            shadowBlur: 20,
            shadowOpacity: 0.7,
            text: cur[0] + "\n" + cur[2] + "\n" + cur[3]
          });
          layer.add(text);
          rect = new Kinetic.Rect({
            x: x - 1,
            y: y - 1,
            width: w + 1,
            height: h + 1,
            fill: 'black',
            opacity: 0
          });
          rect.on('mousedown', function() {
            var _ref;
            $('#popup .title').text(cur[0]);
            $('#popup .price').text('$' + ((_ref = cur[4]) != null ? _ref.toFixed(2) : void 0));
            return $('#popup').show();
          });
          layer.add(rect);
          layer.draw();
          return done();
        });
      });
    };
    for (i = _i = 0; 0 <= LAYER_COUNT ? _i < LAYER_COUNT : _i > LAYER_COUNT; i = 0 <= LAYER_COUNT ? ++_i : --_i) {
      _fn(i);
    }
    for (i = _j = _ref = LAYER_COUNT - 1; _ref <= 0 ? _j <= 0 : _j >= 0; i = _ref <= 0 ? ++_j : --_j) {
      layers[i].layer.moveToTop();
    }
    tweens = null;
    return initController(true, {
      onSwipeLeft: function() {
        console.log('SWIPE LEFT');
        return tweenLayersParallax(layers, -SWIPE_INCREMENT_X);
      },
      onSwipeRight: function() {
        console.log('SWIPE RIGHT');
        return tweenLayersParallax(layers, +SWIPE_INCREMENT_X);
      },
      onSwipeVertical: function() {
        console.log('SWIPE VERTICAL');
        return location.href = 'index.html';
      },
      onTouch: function(x, y) {
        var evObj, _ref1;
        evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent('mousedown', true, true, window, 1, x, y, x, y, false, false, true, false, 0, null);
        return (_ref1 = $('canvas')[0]) != null ? _ref1.dispatchEvent(evObj) : void 0;
      }
    });
  };

  debounce = function(time, fn) {
    return _.debounce(fn, time);
  };

  asyncLoop = function(count, fn) {
    var c, done;
    c = 0;
    done = function() {
      return setTimeout((function() {
        if (c > count) {
          return;
        }
        fn(c, done);
        return c++;
      }), 0);
    };
    return done();
  };

  window.barrier = barrier = function(count, fn) {
    var c;
    c = 0;
    return function() {
      c = c + 1;
      if (c < count) {
        return;
      }
      return fn();
    };
  };

  createImage = function(layer, url, w, h, x, y, cb) {
    var img;
    img = new Image();
    img.onload = function() {
      return cb(new Kinetic.Image({
        x: x,
        y: y,
        image: img,
        width: w,
        height: h,
        shadowColor: 'black',
        shadowBlur: 30,
        shadowOpacity: 0.8
      }));
    };
    return img.src = url;
  };

  createText = function(layer, text, w, h, x, y, opacity) {
    var obj, rect;
    rect = new Kinetic.Rect({
      x: x,
      y: y,
      width: w,
      height: h,
      fill: '#000',
      opacity: opacity - 0.3
    });
    obj = new Kinetic.Text({
      x: x,
      y: y,
      width: w,
      height: h,
      opacity: opacity,
      fill: '#fff',
      fontFamily: 'Helvetica',
      fontSize: 22,
      padding: 20,
      text: text
    });
    layer.add(rect);
    return layer.add(obj);
  };

  tweenToX = function(obj, x, duration) {
    return new Kinetic.Tween({
      node: obj,
      x: x,
      duration: duration / 1000,
      easing: Kinetic.Easings.StrongEaseOut
    });
  };

  tweenLayersParallax = function(layers, step) {
    var i, layer, _i, _len, _ref;
    for (i = _i = 0, _len = layers.length; _i < _len; i = ++_i) {
      layer = layers[i];
      layer.x += step - step / 3 * i;
      if ((_ref = layer.tween) != null) {
        _ref.finish();
      }
      layer.tween = tweenToX(layer.layer, layer.x, 600);
      layer.tween.play();
    }
  };

  initController = function(autoConnect, api) {
    var controller, onSwipe, pointer, swiper, tSwipe, tTouch;
    controller = new Leap.Controller({
      enableGestures: true
    });
    console.log('Leap Motions start.');
    tSwipe = 0;
    onSwipe = function(data) {
      var tx, ty;
      if (Date.now() - tSwipe < MIN_SWIPE_DELAY) {
        return;
      }
      tSwipe = Date.now();
      tx = data.translation()[0];
      ty = data.translation()[1];
      if (Math.abs(tx) > MIN_SWIPE_DISTANCE) {
        if (tx > 0) {
          api.onSwipeLeft();
        } else {
          api.onSwipeRight();
        }
      }
      if (Math.abs(ty) > MIN_SWIPE_DISTANCE * 1.5) {
        return api.onSwipeVertical();
      }
    };
    swiper = controller.gesture('swipe').update(onSwipe);
    tTouch = 0;
    pointer = $('#pointer');
    controller.on('frame', function(frame) {
      var finger, s, x, y, _ref;
      finger = (_ref = frame.pointables) != null ? _ref[0] : void 0;
      if (finger == null) {
        return;
      }
      x = window.innerWidth / 2 + finger.tipPosition[0] * 7;
      y = window.innerHeight - finger.tipPosition[1] * 5 + 250;
      s = finger.tipPosition[2] / 60;
      pointer.css('transform', "translate3d(" + x + "px, " + y + "px, 0px) scale(" + s + ", " + s + ")");
      if (finger.tipPosition[2] < 0) {
        if (Date.now() - tTouch > MIN_TOUCH_DELAY) {
          tTouch = Date.now();
          pointer.hide();
          setTimeout((function() {
            api.onTouch(x, y);
            return pointer.show();
          }), 0);
        }
      }
    });
    $(window).on('keyup', function(event) {
      if (event.which === 39) {
        return api.onSwipeLeft();
      } else if (event.which === 37) {
        return api.onSwipeRight();
      }
    });
    controller.on('connect', function() {
      return console.log('Leap Motion Server connected.');
    });
    controller.on('disconnect', function() {
      return console.log('Leap Motion Server disconnected.');
    });
    controller.on('deviceConnect', function() {
      return console.log('Leap Motion connected.');
    });
    controller.on('deviceDisconnect', function() {
      return console.log('Leap Motion disconnected.');
    });
    if (autoConnect) {
      return controller.connect();
    }
  };

}).call(this);
