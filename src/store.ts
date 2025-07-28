import { configureStore } from '@reduxjs/toolkit'
import { pokemonApi } from './features/Pokmen/pokmenApi'

export const setupStore = () => configureStore({
    reducer: {
        [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
});

export const store = setupStore();
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch