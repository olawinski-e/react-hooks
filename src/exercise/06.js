// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
  fetchPokemon,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (Boolean(!pokemonName)) {
      return
    } else {
      setState({status: 'pending'})
      fetchPokemon(pokemonName)
        .then(pokemon => {
          setState({status: 'resolved', pokemon})
        })
        .catch(error => {
          setState({status: 'rejected', error})
        })
    }
  }, [pokemonName])

  const ResponseStatus = () => {
    switch (state.status) {
      case 'idle':
        return 'Submit a pokemon'
      case 'pending':
        return <PokemonInfoFallback name={pokemonName} />
      case 'resolved':
        return <PokemonDataView pokemon={state.pokemon} />
      case 'rejected':
        throw state.error

      default:
        return
    }
  }

  return <>{ResponseStatus()}</>
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  const handleReset = () => {
    setPokemonName('')
  }

  const ErrorFallback = ({error, resetErrorBoundary}) => {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
