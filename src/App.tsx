import './App.css'
import Router from './router'
// import { UserContext, userEmpty } from './context/userContext'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './components/ui/theme-provider';
import { useCheckNewVersion } from './hooks/useCheckNewVersion'

function App() {

  // const [user, setUser] = useState(userEmpty);

  // function setUserValues(data) {
  //   setUser(data);
  // }

  useCheckNewVersion(30000);

  return (
    // <UserContext.Provider value={{ user, setUserValues }}>
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router />
      </ThemeProvider>
      <ToastContainer stacked newestOnTop pauseOnHover={false} pauseOnFocusLoss={false} position="top-right" autoClose={1500} />
    </>
    // </UserContext.Provider>
  )
}

export default App
