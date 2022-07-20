import React from 'react'
import Button from './Button'
import styled from 'styled-components'
import PropTypes from 'prop-types'

class PreviousButton extends React.Component {

  render () {
    return (
      <Button onClick={this.props.onClick} className={this.props.className}>
        <FlexPrev>
          <img src="assets/tutorial/arrow-left.svg" alt="Back" />
          <span>Back</span>
        </FlexPrev>
      </Button>
    )
  }

}

PreviousButton.propTypes = {
  onChange: PropTypes.func.isRequired
}

const FlexPrev = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export default styled(PreviousButton)`
  background: none;
  border: none;
  min-width: 0;
  img {
    height: 12px;
    margin-right: 5px;
  }
  &:active, &:focus {
    background: none;    
  }
`