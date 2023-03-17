import * as React from 'react'

export const useLocalStorageState = (
  key,
  initialValue,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [value, setValue] = React.useState(() => {
    const localStorageValue = window.localStorage.getItem(key)
    return localStorageValue
      ? deserialize(localStorageValue)
      : typeof initialValue === 'function'
      ? initialValue()
      : initialValue
  })

  const prevKey = React.useRef(key)

  React.useEffect(() => {
    prevKey.current !== key
      ? window.localStorage.remove(prevKey)
      : (prevKey.current = key) &&
        window.localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setValue]
}
