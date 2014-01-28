class window.App extends Backbone.Model
  initialize: ->
    @set 'postMessageModel', new PostMessageModel()
    @set 'messagesModel', new MessagesModel()
  postMessage: ->

  reloadMessages: ->

  