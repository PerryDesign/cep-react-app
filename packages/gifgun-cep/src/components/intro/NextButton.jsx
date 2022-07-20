import React from 'react'
import Button from './Button'
import styled from 'styled-components'
import PropTypes from 'prop-types'

class NextButton extends React.Component {

  render () {
    return (
      <Button onClick={this.props.onClick} className={this.props.className}>
        <FlexNext>
          <span>{this.props.children}</span>
          <img src="assets/tutorial/arrow-right.svg" alt="Next" />
        </FlexNext>
      </Button>
    )
  }

}

NextButton.propTypes = {
  onChange: PropTypes.func.isRequired
}

const FlexNext = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export default styled(NextButton)`
  background: ${props => props.theme.ae.systemHighlightColor};
  border: none;
  span {
    margin-right: 5px;
  }
  img {
    height: 12px;
    margin-left: auto;
  }
  &:hover, &:active, &:focus {
    background: ${props => props.theme.ae.systemHighlightColor};
  }
  &:hover {
    background: ${props => props.theme.background.darker};
  }
`