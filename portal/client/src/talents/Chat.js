import React, { useState } from 'react'
import axios from '../utils/axiosInstance' // Import the axios instance
import { CCard, CCardBody, CCardHeader, CButton, CFormInput, CForm } from '@coreui/react'
import '../scss/vendors/Chat.scss' // Import the new SCSS styling for the Chat component

const Chat = () => {
  const [prompt, setPrompt] = useState('') // State for user input
  const [response, setResponse] = useState('') // State for AI response
  const [loading, setLoading] = useState(false) // Loading state

  // Handler for generating text from prompt
  const handleGenerateText = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponse('')

    try {
      const token = localStorage.getItem('authToken')

      // Send request to backend API to generate text
      const res = await axios.post(
        'chat/generate',
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (res.data && res.data.text) {
        setResponse(res.data.text)
      } else {
        setResponse('No response generated. Please try again.')
      }
    } catch (error) {
      console.error('An error occurred:', error.response ? error.response.data : error.message)

      if (error.response) {
        switch (error.response.status) {
          case 401:
            setResponse('Unauthorized. Please log in again.')
            break
          case 500:
            setResponse('Server error occurred. Please try again later.')
            break
          default:
            setResponse('An unexpected error occurred. Please try again.')
        }
      } else {
        setResponse(
          'An error occurred while generating text. Please check your connection and try again.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>Metin Geliştirme Robotu</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleGenerateText}>
          <CFormInput
            type="text"
            placeholder="Metni buraya girebilirsiniz..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <CButton type="submit" color="primary" className="mt-3" disabled={loading || !prompt}>
            {loading ? 'Oluşturuluyor...' : 'Oluştur'}
          </CButton>
        </CForm>
        {response && (
          <div className="response-container mt-4">
            <h5>AI Yanıtı:</h5>
            <div className="response-box">
              <p>{response}</p>
            </div>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Chat
