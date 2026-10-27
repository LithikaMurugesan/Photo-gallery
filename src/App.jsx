
import { useState, useCallback, useMemo } from 'react'
import useFetchPhotos from './hooks/useFetchPhotos'
import useFavorites from './hooks/useFavorites'

function App() {
  const { photos, loading, error } = useFetchPhotos()
  const { favorites, dispatch } = useFavorites()

  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesSearch = photo.author
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const matchesFavorites =
        !showFavoritesOnly || favorites.includes(photo.id)

      return matchesSearch && matchesFavorites
    })
  }, [photos, searchTerm, showFavoritesOnly, favorites])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Photo Gallery
        </h1>

        <p className="mb-6 text-gray-600">
          Explore photos from talented photographers.
        </p>

        <input
          type="text"
          placeholder="Search by author name..."
          value={searchTerm}
          onChange={handleSearch}
          className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(false)}
            aria-pressed={!showFavoritesOnly}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              !showFavoritesOnly
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Photos ({photos.length})
          </button>

          <button
            type="button"
            onClick={() => setShowFavoritesOnly(true)}
            aria-pressed={showFavoritesOnly}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              showFavoritesOnly
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Favourites ({favorites.length})
          </button>
        </div>

        <p className="mb-2 text-sm text-gray-600">
          Showing {filteredPhotos.length} of {photos.length} photos
        </p>

        {filteredPhotos.length === 0 ? (
          <p className="py-10 text-center text-gray-600">
            {showFavoritesOnly && favorites.length === 0
              ? 'You have no favourites yet. Click the heart on a photo to save it.'
              : `No photos found for "${searchTerm}".`}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => {
              const isFavorite = favorites.includes(photo.id)

              return (
                <article
                  key={photo.id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={photo.download_url}
                    alt={`Photo by ${photo.author}`}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />

                  <div className="flex items-center justify-between gap-3 p-4">
                    <p className="font-medium text-gray-800">
                      {photo.author}
                    </p>

                    <button
                      type="button"
                      aria-label={
                        isFavorite
                          ? `Remove ${photo.author} from favourites`
                          : `Add ${photo.author} to favourites`
                      }
                      aria-pressed={isFavorite}
                      onClick={() =>
                        dispatch({
                          type: 'TOGGLE_FAVORITE',
                          payload: photo.id,
                        })
                      }
                      className={`text-2xl transition ${
                        isFavorite
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      {isFavorite ? '♥' : '♡'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default App;