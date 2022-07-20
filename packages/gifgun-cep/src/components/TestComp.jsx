import React from 'react';
import styled from 'styled-components';
import AddButton from './AddButton'
import {evalScript} from './evalScript'

const TestComp = () => {

    const submitToHandler = (e) => {
        e.preventDefault();
        evalScript('testObj',{money:'millions', dollars:'a lot', value: 20}).then(res=> console.log(res) )
        // var csInterface = new CSInterface();
        // csInterface.evalScript(`test_host(${JSON.stringify({money:'millions', dollars:'a lot', value: 20})})`, (res) => {
        //     console.log(res)
        // })
    }


    return (
        <AddButtonDiv>
            <AddButton onClick={submitToHandler} visible={true}>Clikc me?</AddButton>
        </AddButtonDiv>
    )
}

const AddButtonDiv = styled.div`
    display: blue;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: yellow;
    padding: 10px;
`

export default TestComp 