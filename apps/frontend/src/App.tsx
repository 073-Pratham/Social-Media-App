import { useState } from 'react'
import './App.css'
import Home from './components/Home/Home'

function App() {

  return (
    <>
      <Home />
    </>
  )
}

export default App


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
