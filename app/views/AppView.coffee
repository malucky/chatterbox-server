class window.AppView extends Backbone.View
  template: ->

  events: ->

  initialize: ->

  render: ->
    @$el.children().detach()
    @$el.append new PostMessageView(model: @model.get 'postMessageModel') 
    @$el.append new MessagesView(collection: @model.get 'messagesModel')
