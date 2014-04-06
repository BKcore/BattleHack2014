MAX_WIDTH = 6000
MIN_SWIPE_DELAY = 1000
MIN_SWIPE_DISTANCE = 50
MIN_TOUCH_DELAY = 2000
SWIPE_INCREMENT_X = window.innerWidth
LAYER_COUNT = 1

images = null
tweets = []

$ ->
  fetchAll ->
    drawAll()

fetchAll = (cb) ->
  maybeAllFetchDone = barrier 2, ->
    console.log 'HAY', images, tweets
    cb()
  Instagram.getManyMedia 3, (data) ->
    images = (e.images.low_resolution for e in data)
    maybeAllFetchDone()
  Tweets.getManyTweets 4, (data) ->
    tweets = ([e.user.screen_name, e.text] for e in data)
    maybeAllFetchDone()
  return

drawAll = ->

  viewport =
    x: 0
    y: 0

  win =
    width: window.innerWidth
    height: window.innerHeight

  stage = new Kinetic.Stage(
    container: 'main'
    width: win.width
    height: win.height
  )

  layers = []
  imagesPerLayer = Math.floor(images.length / LAYER_COUNT)
  tweetsPerLayer = Math.floor(tweets.length / LAYER_COUNT)

  for i in [0...LAYER_COUNT]
    do (i) ->

      light = -(i / LAYER_COUNT)
      layer = new Kinetic.Layer()
      stage.add layer
      layers.push
        layer: layer
        x: 0
        tween: null

      maybeAllDone = barrier imagesPerLayer+1, ->
        for t in [0...tweetsPerLayer]
          tweet = tweets[t + i * tweetsPerLayer]
          throw new Error('Moche tweet') if not tweet?
          x = Math.round Math.random() * (MAX_WIDTH - MAX_WIDTH/SWIPE_INCREMENT_X/3 * i)
          y = Math.round Math.random() * (win.height - 100)
          text = "@#{ tweet[0] }: #{ tweet[1] }"
          console.log t + i * tweetsPerLayer, text
          createText layer, text, 350, 100, x, y, light + 1
        layer.draw()
        return

      nx = 0

      asyncLoop imagesPerLayer, (k, done) ->
        console.log 'layer', i, 'image', k, '/', imagesPerLayer
        cur = images[k + i * imagesPerLayer]
        throw new Error('Moche image') if not cur?
        # w = Math.round Math.random() * 300 + 200
        # h = Math.round Math.random() * 300 + 100
        # url = "http://placekitten.com/#{w}/#{h}"
        w = cur.width
        h = cur.height
        x = nx
        nx += w + 20
        y = 100
        url = cur.url
        createImage layer, url, w, h, x, y, (image) ->
          layer.add image
          rect = new Kinetic.Rect(
            x: x-1
            y: y-1
            width: w+1
            height: h+1
            fill: 'black'
            opacity: i / 4
          )
          rect.on 'mousedown', ->
            console.log 'YOUHOU'
          layer.add rect
          # if i > 0
          #   image.cache()
          #   image.filters [Kinetic.Filters.Brighten]
          #   image.brightness light
          images.push image
          layer.draw()
          done()
          maybeAllDone()

  for i in [LAYER_COUNT-1..0]
    layers[i].layer.moveToTop()

  tweens = null
  initController true,
    onSwipeLeft: ->
      console.log 'SWIPE LEFT'
      tweenLayersParallax layers, -SWIPE_INCREMENT_X

    onSwipeRight: ->
      console.log 'SWIPE RIGHT'
      tweenLayersParallax layers, +SWIPE_INCREMENT_X

    onSwipeVertical: ->
      console.log 'SWIPE VERTICAL'
      location.href = 'index.html'

    onTouch: (x, y) ->
      evObj = document.createEvent('MouseEvents');
      evObj.initMouseEvent('mousedown', true, true, window, 1, x, y, x, y, false, false, true, false, 0, null );
      $('canvas')[0]?.dispatchEvent(evObj);

# Stupid underscore arg ordering
debounce = (time, fn) -> _.debounce fn, time

asyncLoop = (count, fn) ->
  c = 0
  done = ->
    setTimeout (->
      return if c > count
      fn c, done
      c++
    ), 0
  done()

window.barrier = barrier = (count, fn) ->
  c = 0
  return ->
    c = c + 1
    return if c < count
    fn()

createImage = (layer, url, w, h, x, y, cb) ->
  img = new Image()
  # img.crossOrigin = "Anonymous"
  img.onload = ->
    cb new Kinetic.Image(
      x: x
      y: y
      image: img
      width: w
      height: h
      shadowColor: 'black'
      shadowBlur: 30
      shadowOpacity: 0.8
    )
  img.src = url

createText = (layer, text, w, h, x, y, opacity) ->
  rect = new Kinetic.Rect(
    x: x
    y: y
    width: w
    height: h
    fill: '#000'
    opacity: opacity - 0.3
  )
  obj = new Kinetic.Text(
    x: x
    y: y
    width: w
    height: h
    opacity: opacity
    fill: '#fff'
    fontFamily: 'Helvetica'
    fontSize: 22
    padding: 20
    text: text
  )
  layer.add rect
  layer.add obj

tweenToX = (obj, x, duration) ->
  return new Kinetic.Tween(
    node: obj
    x: x
    duration: duration / 1000
    easing: Kinetic.Easings.StrongEaseOut
  )

tweenLayersParallax = (layers, step) ->
  for layer, i in layers
    layer.x += step - step/3 * i
    layer.tween?.finish()
    layer.tween = tweenToX layer.layer, layer.x, 600
    layer.tween.play()
  return

initController = (autoConnect, api) ->
  controller = new Leap.Controller(enableGestures: true)
  console.log 'Leap Motions start.'
  tSwipe = 0

  onSwipe = (data) ->
    if Date.now() - tSwipe < MIN_SWIPE_DELAY
      return
    tSwipe = Date.now()
    tx = data.translation()[0]
    ty = data.translation()[1]
    if Math.abs(tx) > MIN_SWIPE_DISTANCE
      if tx > 0
        api.onSwipeLeft()
      else
        api.onSwipeRight()
    if Math.abs(ty) > MIN_SWIPE_DISTANCE * 1.5
      api.onSwipeVertical()
  swiper = controller.gesture('swipe').update onSwipe

  tTouch = 0
  pointer = $('#pointer')
  controller.on 'frame', (frame) ->
    finger = frame.pointables?[0]
    return if not finger?
    x = window.innerWidth/2 + finger.tipPosition[0]*7
    y = window.innerHeight - finger.tipPosition[1]*5 + 250
    s = finger.tipPosition[2] / 60
    pointer.css 'transform', "translate3d(#{x}px, #{y}px, 0px) scale(#{s}, #{s})"
    if finger.tipPosition[2] < 0
      if Date.now() - tTouch > MIN_TOUCH_DELAY
        tTouch = Date.now()
        pointer.hide()
        setTimeout (->
          api.onTouch(x, y)
          pointer.show()
        ), 0
    return

  $(window).on 'keyup', (event) ->
    if event.which is 39 # RIGHT
      api.onSwipeLeft()
    else if event.which is 37 # LEFT
      api.onSwipeRight()

  controller.on('connect', -> console.log 'Leap Motion Server connected.')
  controller.on('disconnect', -> console.log 'Leap Motion Server disconnected.')
  controller.on('deviceConnect', -> console.log 'Leap Motion connected.')
  controller.on('deviceDisconnect', -> console.log 'Leap Motion disconnected.')

  controller.connect() if autoConnect
