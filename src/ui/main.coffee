$ ->
  win =
    width: window.innerWidth
    height: window.innerHeight

  stage = new Kinetic.Stage(
    container: 'main'
    width: win.width
    height: win.height
  )

  layer = new Kinetic.Layer()

  images = []
  for i in [0..20]
    w = Math.round(Math.random() * 400)
    h = Math.round(Math.random() * 400)
    x = Math.round(Math.random() * 400)
    y = Math.round(Math.random() * 400)
    url = "http://placekitten.com/#{w}/#{h}"
    images.push createImage(url, w, h)

createImage = (url, w, h, x, y) ->
  img = new Image()
  img.onload = ->


# http://placekitten.com/200/300
