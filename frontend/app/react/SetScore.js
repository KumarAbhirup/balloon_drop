/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */

import 'babel-polyfill'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Koji from '@withkoji/vcc'
import { SaveToLeaderboard } from 'koji-react-leaderboard'

class SetScore extends Component {
  static propTypes = {
    score: PropTypes.number,
  }

  state = {
    email: '',
    name: '',
    data: null,
  }

  componentDidMount() {
    // Activated with a delay so it doesn't lose focus immediately after click
    setTimeout(
      function() {
        this.nameInput.focus()
      }.bind(this),
      100
    )
  }

  componentDidUpdate() {
    if (this.state.data && this.state.data.success) {
      window.setAppView('leaderboard')
    }
  }

  handleClose = () => {
    window.setAppView('game')
  }

  handleSubmit = async (e, saveData) => {
    e.preventDefault()

    if (this.state.name !== '') {
      const body = {
        name: this.state.name,
        score: this.props.score,
        privateAttributes: {
          email: this.state.email,
        },
      }

      const response = await saveData(body)

      this.setState({ data: response })
    }
  }

  render() {
    return (
      <SaveToLeaderboard
        kojiLeaderboardBackendUri={Koji.config.serviceMap.backend}
      >
        {(saveData, isLoading, isError) => (
          <div
            style={{
              position: 'absolute',
              backgroundColor: Koji.config.colors.backgroundColor,
              width: '100vw',
              height: '100vh',
            }}
          >
            <div className="title" style={{ color: `#ffff00` }}>
              {'Submit To Leaderboard'}
            </div>

            <div
              id="leaderboard-set-score"
              style={{
                backgroundColor: Koji.config.colors.backgroundColor,
                borderColor: `#ffff00`,
              }}
            >
              <form id="score-form" onSubmit={this.handleSubmit}>
                <div className="input-wrapper">
                  <label className="label" style={{ color: `#ffff00` }}>
                    {'Score'}
                  </label>
                  <input
                    disabled
                    value={this.props.score}
                    style={{
                      color: `#ffff00`,
                      borderColor: `#ffff00`,
                    }}
                  />
                </div>

                <div className="input-wrapper">
                  <label className="label" style={{ color: `#ffff00` }}>
                    {'Name'}
                  </label>
                  <input
                    onChange={event => {
                      this.setState({ name: event.target.value })
                    }}
                    type="text"
                    value={this.state.name}
                    style={{
                      color: `#ffff00`,
                      borderColor: `#ffff00`,
                    }}
                    ref={input => {
                      this.nameInput = input
                    }}
                  />
                </div>

                {Koji.config.strings.emailInputEnabled ? (
                  <div className="input-wrapper">
                    <label style={{ color: `#ffff00` }}>
                      {'Your Email Address (Private)'}
                    </label>
                    <input
                      onChange={event => {
                        this.setState({ email: event.target.value })
                      }}
                      type="email"
                      value={this.state.email}
                      style={{
                        color: `#ffff00`,
                        borderColor: `#ffff00`,
                      }}
                    />
                  </div>
                ) : (
                  <span></span>
                )}

                <button
                  disabled={isLoading}
                  onClick={e => this.handleSubmit(e, saveData)}
                  type="submit"
                  style={{
                    backgroundColor: Koji.config.colors.buttonColor,
                    color: Koji.config.colors.buttonTextColor,
                  }}
                >
                  {(() => {
                    if (isLoading) {
                      return 'Submitting...'
                    }

                    if (isError) {
                      return 'Error Occured'
                    }

                    return 'Submit'
                  })()}
                </button>
              </form>

              <button
                className="dismiss-button"
                onClick={this.handleClose}
                style={{
                  backgroundColor: Koji.config.colors.buttonColor,
                  color: Koji.config.colors.buttonTextColor,
                }}
              >
                {'Cancel'}
              </button>
            </div>
          </div>
        )}
      </SaveToLeaderboard>
    )
  }
}

export default SetScore
