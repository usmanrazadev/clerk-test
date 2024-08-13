'use client'
import { createEvent } from '@/services/firebase/events'
import { uploadImage } from '@/services/firebase/fileStorage'
import { auth } from '@/services/firebase/firebase'
import { useAuth, useUser } from '@clerk/nextjs'
import { signInWithCustomToken } from 'firebase/auth'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Input, InputGroup } from '../../../../components/input' // Adjust this import based on your actual file structure
// Validation Schema using Yup
const EventValidationSchema = Yup.object().shape({
  name: Yup.string().required('Event name is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  location: Yup.string().required('Location is required'),
  totalRevenue: Yup.string().required('Total revenue is required'),
  ticketsAvailable: Yup.number()
    .min(0, 'Tickets available cannot be less than zero')
    .required('Tickets available is required'),

  imgUrl: Yup.string().required('Image is required'),
})

// Form component
function CreateEventForm() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { getToken } = useAuth()
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <div>You are not signed in</div>
  }

  // Firebase Authentication with Clerk's token
  const authenticateWithFirebase = async () => {
    try {
      const firebaseToken = await getToken({ template: 'integration_firebase' }) // Get the Firebase token from Clerk
      await signInWithCustomToken(auth, firebaseToken)
      console.log('Firebase authentication successful')
    } catch (error) {
      console.error('Firebase authentication failed:', error)
      throw error
    }
  }
  return (
    <Formik
      initialValues={{
        name: '',
        date: '',
        time: '',
        time: '',
        location: '',
        totalRevenue: '',
        ticketsAvailable: 0,
        imgUrl: '',
      }}
      validationSchema={EventValidationSchema}
      onSubmit={async (values, actions) => {
        await authenticateWithFirebase()
        console.log('imageurl...', values.imgUrl)
        uploadImage(values.imgUrl, values.name)
          .then((downloadURL) => {
            // Create a new reference with an auto-generated id
            const newEventData = {
              name: values.name,
              date: values.date,
              time: values.time,
              location: values.location,
              totalRevenue: values.totalRevenue,
              ticketsAvailable: values.ticketsAvailable,
              imgUrl: downloadURL,
              status: 'On Sale',
              ticketsSold: 0,
              userId: user.id,
            }
            return createEvent(newEventData)
          })
          .then(() => {
            console.log('Data submitted successfully!')
            actions.resetForm()
          })
          .catch((error) => {
            console.error('Error submitting form: ', error)
          })
          .finally(() => {
            actions.setSubmitting(false)
          })
      }}
    >
      {(formik) => {
        return (
          <Form className="mx-auto rounded-lg bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Create Event</h2>

            <InputGroup>
              <Field name="name" type="text" as={Input} placeholder="Enter event name" className="mb-2" />
              <ErrorMessage name="name" component="div" className="text-xs italic text-red-500" />
            </InputGroup>
            <InputGroup>
              <input
                id="image"
                name="image"
                type="file"
                onChange={(event) => {
                  formik.setFieldValue('imgUrl', event.currentTarget.files[0])
                }}
                className="mb-2"
              />
              {formik.touched.imgUrl && formik.errors.imgUrl && (
                <div className="text-xs italic text-red-500">{formik.errors.imgUrl}</div>
              )}
            </InputGroup>
            <InputGroup>
              <Field name="date" type="date" as={Input} className="mb-2" />
              <ErrorMessage name="date" component="div" className="text-xs italic text-red-500" />
            </InputGroup>
            <InputGroup>
              <Field name="time" type="time" as={Input} className="mb-2" />
              <ErrorMessage name="time" component="div" className="text-xs italic text-red-500" />
            </InputGroup>

            <InputGroup>
              <Field name="location" type="text" as={Input} placeholder="Enter location" className="mb-2" />
              <ErrorMessage name="location" component="div" className="text-xs italic text-red-500" />
            </InputGroup>

            <InputGroup>
              <Field name="totalRevenue" type="text" as={Input} placeholder="Enter totalRevenue" className="mb-2" />
              <ErrorMessage name="totalRevenue" component="div" className="text-xs italic text-red-500" />
            </InputGroup>
            <InputGroup>
              <Field
                name="ticketsAvailable"
                type="number"
                as={Input}
                placeholder="Enter ticketsAvailable"
                className="mb-2"
              />
              <ErrorMessage name="ticketsAvailable" component="div" className="text-xs italic text-red-500" />
            </InputGroup>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </Form>
        )
      }}
    </Formik>
  )
}

export default CreateEventForm
