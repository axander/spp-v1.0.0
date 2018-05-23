import React, { Component } from 'react'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig, omit, isObject } from './utils'
import players from './players'
import Player from './Player'
import FilePlayer from './players/FilePlayer'
import renderPreloadPlayers from './preload'

const SUPPORTED_PROPS = Object.keys(propTypes)

export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
  static canPlay = url => {
    for (let Player of players) {
      if (Player.canPlay(url)) {
        return true
      }
    }
    return false
  }
  config = getConfig(this.props, defaultProps, true)
  componentDidMount () {
    this.props.getStop = this.stop ;
    this.progress()
  }
  componentWillUnmount () {
    clearTimeout(this.progressTimeout)
  }
  shouldComponentUpdate (nextProps) {
    for (let key of Object.keys(this.props)) {
      const prop = this.props[key]
      if (!isObject(prop) && prop !== nextProps[key]) {
        return true
      }
    }
    return false
  }
  getDuration = () => {
    if (!this.player) return null
    return this.player.getDuration()
  }
  getCurrentTime = () => {
    if (!this.player) return null
    return this.player.getCurrentTime()
  }
  getInternalPlayer = (key = 'player') => {
    if (!this.player) return null
    return this.player.getInternalPlayer(key)
  }
  seekTo = fraction => {
    if (!this.player) return null
    this.player.seekTo(fraction)
  }
  stop = () => {
    alert('stop1');
    if (!this.player) return null
    this.player.stop()
  }
  progress = () => {
    try{
      if (this.props.url && this.player && this.player.isReady && this.player.getCurrentTime() && this.player.getSecondsLoaded() && this.player.getDuration()) {
        var string = '';
        const playedSeconds = this.player.getCurrentTime() || 0;
        string = string + '1';
        const loadedSeconds = this.player.getSecondsLoaded() || 0;
        console.log('loadedSeconds');
        console.log(loadedSeconds);
        console.log(this.player.isReady);
        string = string + '2';
        const duration = this.player.getDuration() || 0
        string = string + '3';
        if (duration) {
          const progress = {
            playedSeconds,
            played: playedSeconds / duration
          }
          if (loadedSeconds !== null) {
            progress.loadedSeconds = loadedSeconds
            progress.loaded = loadedSeconds / duration
          }
          // Only call onProgress if values have changed
          if (progress.played !== this.prevPlayed || progress.loaded !== this.prevLoaded) {
            progress.buffering = false;
            this.props.onProgress(progress);
          }else{
            progress.buffering = true;
            this.props.onProgress(progress)
          }
          this.prevPlayed = progress.played
          this.prevLoaded = progress.loaded
        }
        //document.querySelector('#contadorxxx').innerHTML = playedSeconds + ' ' + string;
      }
    }catch(e){
      const progress = {
        'buffering':true
      }
      this.props.onProgress(progress);
      //document.querySelector('#contadorxxx').innerHTML = e;
    }

    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency)
  }
  getActivePlayer (url) {
    for (let Player of players) {
      if (Player.canPlay(url)) {
        return Player
      }
    }
    // Fall back to FilePlayer if nothing else can play the URL
    return FilePlayer
  }
  wrapperRef = wrapper => {
    this.wrapper = wrapper
  }
  activePlayerRef = player => {
    this.player = player
  }
  renderActivePlayer (url) {
    if (!url) return null
    const activePlayer = this.getActivePlayer(url)
    return (
      <Player
        {...this.props}
        key={activePlayer.displayName}
        ref={this.activePlayerRef}
        config={this.config}
        activePlayer={activePlayer}
      />
    )
  }
  sortPlayers (a, b) {
    // Retain player order to prevent weird iframe behaviour when switching players
    if (a && b) {
      return a.key < b.key ? -1 : 1
    }
    return 0
  }
  render () {
    const { url, style, width, height } = this.props
    const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS)
    const activePlayer = this.renderActivePlayer(url)
    const preloadPlayers = renderPreloadPlayers(url, this.config)
    const players = [ activePlayer, ...preloadPlayers ].sort(this.sortPlayers)
    return (
      <div ref={this.wrapperRef} style={{ ...style, width, height }} {...otherProps}>
        {players}
      </div>
    )
  }
}
