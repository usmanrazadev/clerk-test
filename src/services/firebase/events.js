import { get, push, ref, remove, set, update } from 'firebase/database'
import { db } from './firebase' // Ensure this path is correct to your Firebase config initialization

// Function to create a new event
export const createEvent = async (eventData) => {
  const eventsRef = ref(db, 'events')
  try {
    const newEventRef = await push(eventsRef)
    await set(newEventRef, eventData)
    return newEventRef.key
  } catch (error) {
    console.error('Create event failed: ', error)
    throw error
  }
}

// Function to update an existing event
export const updateEvent = async (eventId, eventData) => {
  const eventRef = ref(db, `events/${eventId}`)
  try {
    await update(eventRef, eventData)
    return eventId
  } catch (error) {
    console.error('Update event failed: ', error)
    throw error
  }
}

// Function to delete an event
export const deleteEvent = async (eventId) => {
  const eventRef = ref(db, `events/${eventId}`)
  try {
    await remove(eventRef)
  } catch (error) {
    console.error('Delete event failed: ', error)
    throw error
  }
}

// Function to retrieve a single event
export const getEvent = async (eventId) => {
  const eventRef = ref(db, `events/${eventId}`)
  try {
    const snapshot = await get(eventRef)
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      console.error('No data available')
      return null
    }
  } catch (error) {
    console.error('Get event failed: ', error)
    throw error
  }
}

// Function to retrieve all events
export const getAllEvents = async () => {
  const eventsRef = ref(db, 'events')
  try {
    const snapshot = await get(eventsRef)
    if (snapshot.exists()) {
      const eventsData = snapshot.val()
      // Convert the object of objects into an array of objects, including the key as _id
      return Object.entries(eventsData).map(([key, value]) => ({
        _id: key,
        ...value,
      }))
    } else {
      console.error('No data available')
      return {}
    }
  } catch (error) {
    console.error('Get all events failed: ', error)
    throw error
  }
}
