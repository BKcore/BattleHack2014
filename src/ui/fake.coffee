MAX_WIDTH = 6000
MIN_SWIPE_DELAY = 1000
MIN_SWIPE_DISTANCE = 50
MIN_TOUCH_DELAY = 2000
SWIPE_INCREMENT_X = window.innerWidth
LAYER_COUNT = 1

images = null
tweets = []

$ ->
  drawAll()

drawAll = ->

  viewport =
    x: 0
    y: 0

  win =
    width: window.innerWidth
    height: window.innerHeight

  initController true,
    onSwipeLeft: ->
      console.log 'SWIPE LEFT'

    onSwipeRight: ->
      console.log 'SWIPE RIGHT'

    onSwipeVertical: ->
      console.log 'SWIPE VERTICAL'
      location.href = 'index.html'

    onTouch: (x, y) ->

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

  controller.on('connect', -> console.log 'Leap Motion Server connected.')
  controller.on('disconnect', -> console.log 'Leap Motion Server disconnected.')
  controller.on('deviceConnect', -> console.log 'Leap Motion connected.')
  controller.on('deviceDisconnect', -> console.log 'Leap Motion disconnected.')

  controller.connect() if autoConnect
