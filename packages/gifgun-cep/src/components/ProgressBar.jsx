import React from 'react'
import ProgressContainer from './ProgressContainer'
import ProgressInner from './ProgressInner'

const ProgressBar = ({percentage,isComplete}) => {

    return (
      <ProgressContainer>
        <ProgressInner percentage={percentage} isComplete={isComplete} />
      </ProgressContainer>
    )

}

export default ProgressBar