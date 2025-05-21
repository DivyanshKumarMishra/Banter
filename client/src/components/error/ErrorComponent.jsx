import { useNavigate } from 'react-router-dom'
import { useErrorBoundary } from 'react-error-boundary'
import Button from '../common/Button'

function ErrorComponent({ error }) {
  const navigate = useNavigate()
  const { resetBoundary } = useErrorBoundary()

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="sm:text-4xl lg:text-5xl font-semibold text-red-600 mb-4">Something went wrong!!</h1>
      <div className="flex gap-4">
        <Button label='Reset' onClick={resetBoundary} />
        <Button label='Back to chat' onClick={() => navigate('/chat')} />
      </div>
    </div>
  )
}

export default ErrorComponent