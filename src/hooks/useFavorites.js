
import { useEffect, useReducer } from 'react'

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const photoId = action.payload

      if (state.includes(photoId)) {
        return state.filter((id) => id !== photoId)
      }

      return [...state, photoId]
    }

    default:
      return state
  }
}

function getInitialFavorites() {
  try {
    const savedFavorites = localStorage.getItem('favorites')
    return savedFavorites ? JSON.parse(savedFavorites) : []
  } catch {
    return []
  }
}

function useFavorites() {
  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    undefined,
    getInitialFavorites
  )

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  return { favorites, dispatch }
}

export default useFavorites
