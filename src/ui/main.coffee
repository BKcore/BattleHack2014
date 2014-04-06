MAX_WIDTH = 3000
MIN_SWIPE_DELAY = 500
MIN_SWIPE_DISTANCE = 50
SWIPE_INCREMENT_X = window.innerWidth
LAYER_COUNT = 3

$ ->

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
  images = []

  for i in [0...LAYER_COUNT]
    do (i) ->
      light = (LAYER_COUNT - i / 1.2) / LAYER_COUNT
      layer = new Kinetic.Layer()
      stage.add layer
      layers.push
        layer: layer
        x: 0
        tween: null

      maybeAllDone = barrier 10, ->
        console.log 'layer', i, 'done'

      asyncLoop 10, (k, done) ->
        console.log 'layer', i, 'image', k
        w = Math.round Math.random() * 300 + 200
        h = Math.round Math.random() * 300 + 100
        x = Math.round Math.random() * MAX_WIDTH - MAX_WIDTH/10 * i
        y = Math.round Math.random() * (win.height - h)
        url = "http://placekitten.com/#{w}/#{h}"
        createImage layer, url, w, h, x, y, (image) ->
          layer.add image
          if i > 0 and false
            image.cache()
            image.filters [Kinetic.Filters.Brighten]
            image.brightness -0.6 + light
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

barrier = (count, fn) ->
  c = 0
  return ->
    return if c++ < count
    fn()

createImage = (layer, url, w, h, x, y, cb) ->
  img = new Image()
  img.crossOrigin = "Anonymous"
  img.onload = ->
    cb new Kinetic.Image(
      x: x
      y: y
      image: img
      width: w,
      height: h
      shadowColor: 'black',
      shadowBlur: 30,
      shadowOpacity: 0.8
    )
  img.src = url

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
  controller = new Leap.Controller()
  console.log 'Leap Motions start.'

  onSwipe = debounce MIN_SWIPE_DELAY, (data) ->
    tx = data.translation()[0]
    console.log tx
    if Math.abs(tx) > MIN_SWIPE_DISTANCE
      if tx > 0
        api.onSwipeLeft()
      else
        api.onSwipeRight()
  swiper = controller.gesture('swipe').update onSwipe

  controller.connect() if autoConnect
# http://placekitten.com/200/300
