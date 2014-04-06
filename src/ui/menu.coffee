MAX_WIDTH = 3000
MIN_TOUCH_DELAY = 2000
MIN_SWIPE_DISTANCE = 50
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

  $('.menuitem').on 'click', ->
    loc = $(this).attr('data-location')
    console.log loc
    return if not loc?
    location.href = loc

  initController true,
    onTouch: (x, y) ->
      el = document.elementFromPoint(x, y)
      console.log 'TOUCH', x, y, el
      $(el)?.trigger 'click'

# Stupid underscore arg ordering
debounce = (time, fn) -> _.debounce fn, time

initController = (autoConnect, api) ->
  controller = new Leap.Controller(enableGestures: true)
  console.log 'Leap Motions start.'

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
