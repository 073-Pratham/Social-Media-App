import React from 'react'


interface propsType {
    message: string
}

const Alert = (props: propsType) => {
  return (
    <>
      alert(`Error: ${props.message}`)
    </>
  )
}

export default Alert;
