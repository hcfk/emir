import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="http://visualdatacore.com" target="_blank" rel="noopener noreferrer">
          Visual Data Core
        </a>
        <span className="ms-1">&copy; 2025 gokbilge labs.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="http://visualdatacore.com" target="_blank" rel="noopener noreferrer">
          Visual Data Core &amp; Pro Version
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
