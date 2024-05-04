import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authSlice } from '../reducers'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

const rootReducer = combineReducers({
  auth: authSlice
})

const persistConfig = {
  key: 'root',
  storage: storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
