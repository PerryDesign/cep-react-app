import React from 'react';
import styled from 'styled-components';

const Hideable = ({ key, visible, title, comp}) => {

    var divName = "div" + title

    return (
        <HideableDiv visible={visible}>
            {comp}
        </HideableDiv>
    )

}

const HideableDiv = styled.div`
    display: ${props => props.visible ? 'flex' : 'none'};
    flex-direction: column;
    height: 100%;
`

export default Hideable