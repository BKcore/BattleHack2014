MAX_WIDTH = 6000
MIN_SWIPE_DELAY = 1000
MIN_SWIPE_DISTANCE = 50
MIN_TOUCH_DELAY = 2000
SWIPE_INCREMENT_X = window.innerWidth
LAYER_COUNT = 1

items = null

$ ->
  fetchAll ->
    drawAll()

fetchAll = (cb) ->
  Events.getConcerts 37.7833, -122.4167, (data) ->
    items = ([e.title, e.performers[0].image, e.venue.name, e.datetime_local, e.stats.lowest_price ? (Math.random()*40+10)] for e in data when e.performers[0].image?)
    console.log items
    cb()
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
  imagesPerLayer = Math.floor(items.length-1 / LAYER_COUNT)

  for i in [0...LAYER_COUNT]
    do (i) ->

      light = -(i / LAYER_COUNT)
      layer = new Kinetic.Layer()
      stage.add layer
      layers.push
        layer: layer
        x: 0
        tween: null

      nx = 0

      asyncLoop imagesPerLayer, (k, done) ->
        console.log 'layer', i, 'image', k, '/', imagesPerLayer
        cur = items[k]
        throw new Error('Moche image') if not cur?
        # w = Math.round Math.random() * 300 + 200
        # h = Math.round Math.random() * 300 + 100
        # url = "http://placekitten.com/#{w}/#{h}"
        w = 500
        h = 400
        x = nx
        nx += w + 20
        y = 100
        url = cur[1]
        createImage layer, url, w, h, x, y, (image) ->
          layer.add image
          rect2 = new Kinetic.Rect(
            x: x-1
            y: y-1
            width: w+1
            height: 100
            fill: 'black'
            opacity: 0.4
          )
          layer.add rect2
          text = new Kinetic.Text(
            x: x
            y: y
            width: w
            height: h
            opacity: 1
            fill: '#fff'
            fontFamily: 'Helvetica'
            fontSize: 20
            padding: 20
            shadowColor: 'black'
            shadowBlur: 20
            shadowOpacity: 0.7
            text: cur[0] + "\n" + cur[2] + "\n" + cur[3]
          )
          layer.add text
          rect = new Kinetic.Rect(
            x: x-1
            y: y-1
            width: w+1
            height: h+1
            fill: 'black'
            opacity: 0
          )
          rect.on 'mousedown', ->
#             $('#popup .more').append($("<script src='https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant=nicolas@3scale.net' data-button='qr' data-name='Product via QR code' data-quantity='1' data-amount='#{cur[4]?.toFixed(2)}' data-currency='USD' data-shipping='0' data-tax='0' data-callback='http://localhost.com' data-env='sandbox'
# ></script>"))
            $('#popup .title').text(cur[0])
            $('#popup .price').text('$'+cur[4]?.toFixed(2))
            $('#popup').show()
          layer.add rect
          # if i > 0
          #   image.cache()
          #   image.filters [Kinetic.Filters.Brighten]
          #   image.brightness light
          layer.draw()
          done()

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
