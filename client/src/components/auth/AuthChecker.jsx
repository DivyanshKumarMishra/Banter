import { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Spinner from '../common/Spinner' 

const AuthRoute = ({children}) => {
  const {userInfo} = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [userInfo])

  if (loading) {
    return <div className="flex justify-center items-center h-screen w-full"><Spinner /></div>
  }

  return userInfo ? <Navigate to="/chat" replace/> : children
}

const ProtectedRoute = ({children}) => {
  const {userInfo} = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [userInfo])

  if (loading) {
    return <div className="flex justify-center items-center h-screen w-full"><Spinner /></div>
  }

  return userInfo ? children : <Navigate to="/auth" />
}

export {AuthRoute, ProtectedRoute}