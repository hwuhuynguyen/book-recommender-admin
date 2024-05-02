import React from 'react'

const withTokenCheck = (WrappedComponent: React.ComponentType) => {
  const WithTokenCheck: React.FC = () => {
    return <WrappedComponent />
  }

  return WithTokenCheck
}

export default withTokenCheck
