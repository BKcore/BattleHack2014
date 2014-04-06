// Generated by CoffeeScript 1.6.3
(function() {
  var LAYER_COUNT, MAX_WIDTH, MIN_SWIPE_DELAY, MIN_SWIPE_DISTANCE, SWIPE_INCREMENT_X, asyncLoop, barrier, createImage, createText, debounce, drawAll, fetchAll, images, initController, tweenLayersParallax, tweenToX, tweets;

  MAX_WIDTH = 6000;

  MIN_SWIPE_DELAY = 1000;

  MIN_SWIPE_DISTANCE = 50;

  SWIPE_INCREMENT_X = window.innerWidth;

  LAYER_COUNT = 3;

  images = null;

  tweets = [];

  $(function() {
    return fetchAll(function() {
      return drawAll();
    });
  });

  fetchAll = function(cb) {
    var maybeAllFetchDone;
    maybeAllFetchDone = barrier(2, function() {
      console.log('HAY', images, tweets);
      return cb();
    });
    Instagram.searchMediaByTag('SLSPEPUSA', function(data) {
      var e;
      images = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          e = data[_i];
          _results.push(e.images.low_resolution);
        }
        return _results;
      })();
      return maybeAllFetchDone();
    });
    Tweets.getLocatedTweets('#SLSPEPUSA', "37.7833", "-122.4167", "20", function(data) {
      var e;
      tweets = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          e = data[_i];
          _results.push([e.user.screen_name, e.text]);
        }
        return _results;
      })();
      return maybeAllFetchDone();
    });
  };

  drawAll = function() {
    var i, imagesPerLayer, layers, stage, tweens, tweetsPerLayer, viewport, win, _fn, _i, _j, _ref;
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
    imagesPerLayer = Math.floor(images.length / LAYER_COUNT);
    tweetsPerLayer = Math.floor(tweets.length / LAYER_COUNT);
    _fn = function(i) {
      var layer, light, maybeAllDone;
      light = -(i / LAYER_COUNT);
      layer = new Kinetic.Layer();
      stage.add(layer);
      layers.push({
        layer: layer,
        x: 0,
        tween: null
      });
      maybeAllDone = barrier(imagesPerLayer + 1, function() {
        var t, text, tweet, x, y, _j;
        for (t = _j = 0; 0 <= tweetsPerLayer ? _j < tweetsPerLayer : _j > tweetsPerLayer; t = 0 <= tweetsPerLayer ? ++_j : --_j) {
          tweet = tweets[t + i * tweetsPerLayer];
          if (tweet == null) {
            throw new Error('Moche tweet');
          }
          x = Math.round(Math.random() * (MAX_WIDTH - MAX_WIDTH / SWIPE_INCREMENT_X / 3 * i));
          y = Math.round(Math.random() * (win.height - 100));
          text = "@" + tweet[0] + ": " + tweet[1];
          createText(layer, text, 300, 100, x, y, light + 1);
        }
        layer.draw();
      });
      return asyncLoop(imagesPerLayer, function(k, done) {
        var cur, h, url, w, x, y;
        console.log('layer', i, 'image', k, '/', imagesPerLayer);
        cur = images[k + i * imagesPerLayer];
        if (cur == null) {
          throw new Error('Moche image');
        }
        w = cur.width;
        h = cur.height;
        x = Math.round(Math.random() * (MAX_WIDTH - MAX_WIDTH / 3 * i));
        y = Math.round(Math.random() * (win.height - h));
        url = cur.url;
        return createImage(layer, url, w, h, x, y, function(image) {
          var rect;
          layer.add(image);
          rect = new Kinetic.Rect({
            x: x - 1,
            y: y - 1,
            width: w + 1,
            height: h + 1,
            fill: 'black',
            opacity: i / 4
          });
          layer.add(rect);
          images.push(image);
          layer.draw();
          done();
          return maybeAllDone();
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

  barrier = function(count, fn) {
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
      fontSize: 24,
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
    var controller, onSwipe, pointer, swiper, tSwipe;
    controller = new Leap.Controller({
      enableGestures: true
    });
    console.log('Leap Motions start.');
    tSwipe = 0;
    onSwipe = function(data) {
      var tx;
      if (Date.now() - tSwipe < MIN_SWIPE_DELAY) {
        return;
      }
      tSwipe = Date.now();
      tx = data.translation()[0];
      if (Math.abs(tx) > MIN_SWIPE_DISTANCE) {
        if (tx > 0) {
          return api.onSwipeLeft();
        } else {
          return api.onSwipeRight();
        }
      }
    };
    swiper = controller.gesture('swipe').update(onSwipe);
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
      return pointer.css('transform', "translate3d(" + x + "px, " + y + "px, 0px) scale(" + s + ", " + s + ")");
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
