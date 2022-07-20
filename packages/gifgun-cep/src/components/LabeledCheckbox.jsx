import React from 'react'
import Checkbox from './Checkbox'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

class LabeledCheckbox extends React.Component {

  render () {
    return (
      <label className={this.props.className}>
        <span>{this.props.label}</span>
        <Checkbox {...omit(this.props, ['className','isVisible'])} />
      </label>
    )
  }

}

LabeledCheckbox.propTypes = {
  label: PropTypes.string
}

export default styled(LabeledCheckbox)`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  justify-content: space-between;
  margin: 3px 0 3px 0;
  > span, div {
    font-family: "${props => props.theme.ae.baseFontFamily}", "Segoe UI", "San Francisco", sans-serif;
    font-size: ${props => props.theme.ae.baseFontSize}pt;
    color: ${props => props.checked ? props.theme.text.bright : props.theme.text.mid};
    display: inline-block;
    vertical-align: middle;
  }
  > span {
    margin-left: 0;
  }
`