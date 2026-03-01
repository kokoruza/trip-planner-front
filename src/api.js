// Compatibility shim: re-export selected functions from new modular API
export { createTrip } from './api/tripApi'
export { getMyTrips, getTrips as getAllTrips } from './api/tripApi'