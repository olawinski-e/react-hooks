// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  key,
  initialValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [value, setValue] = React.useState(() => {
    const valueLocalStorage = window.localStorage.getItem(key)
    if (valueLocalStorage) {
      return deserialize(valueLocalStorage)
    } else if (typeof initialValue === 'function') {
      initialValue()
    } else return initialValue
  })

  const prevKey = React.useRef(key)

  React.useEffect(() => {
    if (prevKey.current !== key) {
      window.localStorage.removeItem(prevKey.current)
    } else {
      prevKey.current = key
      window.localStorage.setItem(key, serialize(value))
    }
  }, [key, serialize, value])

  return [value, setValue]
}

const Greeting = ({initialName = ''}) => {
  const [name, setName] = useLocalStorageState('name', initialName)

  const handleChange = event => {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

const App = () => {
  return <Greeting />
}

export default App
