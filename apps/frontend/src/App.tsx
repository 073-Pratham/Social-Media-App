import { useEffect } from 'react';
import './App.css';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from './components/Auth/AuthPage';
import { useDispatch } from 'react-redux';
import { setUser } from "./redux/slices/authSlice";
import PostSection from './components/Home/PostSection';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/myprofile`, {
          method: "GET",
          credentials: "include" 
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(
            setUser({
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
            })
          );
        } 
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        {/* Layout route */}
        <Route path="/" element={<Home />}>
          <Route index element={<PostSection />} />
          <Route path="trending" element={<div>Trending topic posts</div>} />
          <Route path="trending/:topic" element={<div>Trending topic posts</div>} />
          <Route path="profile" element={<div>User Profile posts</div>} />
        </Route>

        {/* Auth route */}
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  )
}

export default App;


// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "./redux/store";
// import { login, logout } from "./redux/slices/authSlice";

// function App() {
//   const { user, token } = useSelector((state: RootState) => state.auth);
//   const dispatch = useDispatch();

//   return (
//     <div>
//       <h1>Social Media App</h1>
//       {user ? (
//         <div>
//           <p>Welcome {user.username}!</p>
//           <button onClick={() => dispatch(logout())}>Logout</button>
//         </div>
//       ) : (
//         <button
//           onClick={() =>
//             dispatch(
//               login({
//                 user: { id: "1", username: "Pratham", email: "p@example.com" },
//                 token: "abcd1234",
//               })
//             )
//           }
//         >
//           Login
//         </button>
//       )}
//     </div>
//   );
// }

// export default App;
