import React from 'react';
import styled from 'styled-components';

const DividerRect = ({isVisible}) => {

    // Return
    return(
        <DividerRectDiv isVisible={isVisible}></DividerRectDiv>
    )

};

const DividerRectDiv = styled.div`
    display: ${props => props.isVisible ? 'flex' : 'none'};
    flex-direction: column;
    align-items: center;
    background-color: ${props => props.theme.background.light};
    height: 1px;
    margin: 5px 5px;
`


export default DividerRect