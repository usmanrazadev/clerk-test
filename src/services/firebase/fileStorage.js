import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

export const uploadImage = async (file, name) => {
  try {
    // Create a storage reference from our storage service
    const fileRef = ref(storage, `events/${name}`)

    // Upload the file to the specified reference
    const snapshot = await uploadBytes(fileRef, file)

    // Get the URL of the uploaded file
    const url = await getDownloadURL(snapshot.ref)
    return url
  } catch (error) {
    console.error('Error uploading image: ', error)
    throw error // It's generally a good practice to re-throw the error after logging it
  }
}
