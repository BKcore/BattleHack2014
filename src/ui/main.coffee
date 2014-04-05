MAX_WIDTH = 3000
MIN_SWIPE_DELAY = 500
MIN_SWIPE_DISTANCE = 50
SWIPE_INCREMENT_X = window.innerWidth

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

  layer = new Kinetic.Layer()
  stage.add layer

  images = []
  for i in [0..40]
    w = Math.round Math.random() * 300 + 200
    h = Math.round Math.random() * 300 + 100
    x = Math.round Math.random() * MAX_WIDTH
    y = Math.round Math.random() * (win.height - h)
    url = "http://placekitten.com/#{w}/#{h}"
    createImage layer, url, w, h, x, y, (image) ->
      layer.add image
      layer.draw()
      images.push image

  tween = null
  initController true,
    onSwipeLeft: ->
      console.log 'SWIPE LEFT'
      viewport.x -= SWIPE_INCREMENT_X
      tween?.finish()
      tween = tweenTo layer, viewport.x, viewport.y, 600
      tween.play()
    onSwipeRight: ->
      console.log 'SWIPE RIGHT'
      viewport.x += SWIPE_INCREMENT_X
      tween?.finish()
      tween = tweenTo layer, viewport.x, viewport.y, 600
      tween.play()

# Stupid underscore arg ordering
debounce = (time, fn) -> _.debounce fn, time

createImage = (layer, url, w, h, x, y, cb) ->
  img = new Image()
  img.onload = ->
    cb new Kinetic.Image(
      x: x
      y: y
      image: img
      width: w,
      height: h
    )
  img.src = url

tweenTo = (obj, x, y, duration) ->
  return new Kinetic.Tween(
    node: obj
    x: x
    y: y
    duration: duration / 1000
    easing: Kinetic.Easings.StrongEaseOut
  )

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
