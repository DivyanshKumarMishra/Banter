import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthRoute, ProtectedRoute } from './components/auth/AuthChecker'
import {logout, setUserInfo} from './redux/slices/userSlice'
import protectedAxios from './services/axiosService'
import { USER_URL } from './utils/constants'
import Spinner from './components/common/Spinner'
import Auth from './pages/auth'
import Chat from './pages/chat'

function App() {
  const [loading, setLoading] = useState(false)
  const {userInfo} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(!userInfo){
      fetchUserInfo()
    }

    async function fetchUserInfo(){
      try {
        setLoading(true)
        const response = await protectedAxios.get(USER_URL)
        if(response.status === 200){
          dispatch(setUserInfo(response.data.user))
        }
      } catch (error) {
        // console.log(error)
        dispatch(logout())
        navigate('/auth')
      }finally{
        setLoading(false)
      }
    }
  }, [dispatch, userInfo, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Spinner />
      </div>
    )
  }
  
  return (
    <Routes>
      <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path='/*' element={<Navigate to='/auth' />} />
    </Routes>
  )
}

export default App
