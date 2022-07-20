import React from 'react'
import Button from './Button'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Trash} from '@styled-icons/fa-solid'
import {RestartAlt} from '@styled-icons/material-outlined'

class RedownloadButton extends React.Component {

  render () {
    return (
      <Button onClick={this.props.onClick} className={this.props.className}>
        <FlexDownload>
          <span>{this.props.children}</span>
          <RestartAlt />
        </FlexDownload>
      </Button>
    )
  }

}

RedownloadButton.propTypes = {
  onChange: PropTypes.func.isRequired
}

const FlexDownload = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const StyledTrash = styled(Trash)`
    height:12px;
`

export default styled(RedownloadButton)`
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