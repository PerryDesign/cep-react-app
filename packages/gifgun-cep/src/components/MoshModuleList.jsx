import React from 'react';
import styled from 'styled-components';

import MoshModule from './MoshModule'
import Module from './Module'

const MoshModuleList = ({isTrial,moshModules, setMoshModules, activeItemComp}) => {

    // Render
    return (
        <MoshModulesUL>
            {moshModules && moshModules.map((moshModule,i) => (
                <Module
                    key ={`moshModuleContainer-${i}`}
                    comp=
                        {<MoshModule
                            isTrial={isTrial}
                            key={"Module"+i}
                            moshModules={moshModules}
                            setMoshModules={setMoshModules}
                            moshModule={moshModule}
                            activeItemComp = {activeItemComp}
                        />}
                />

            ))}
        </MoshModulesUL>
    );
};

// Theme
const MoshModulesUL = styled.ul`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-inline-start: 0;
    margin: 6px 0px 0px 0px;

`

export default MoshModuleList