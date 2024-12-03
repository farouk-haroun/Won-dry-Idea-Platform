import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './screens/home';
import Discover from './screens/discover';
import Login from './screens/login';
import Signup from './screens/signup.js';
import Challenge from './screens/challenge';
import Idea from './screens/idea.js';
import ChallengeIdea from './screens/challenge_idea';
import Profile from './screens/profile';
import IdeaSpace from './screens/idea_space';
import {IdeaSpaceProvider} from './contexts/IdeaSpaceContext';
function App() {
  return (
    <Provider store={store}>
      <IdeaSpaceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/discover" element={<Discover />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/challenge/:id" element={<Challenge />} />
          <Route path="/idea/:id" element={<Idea />} />
          <Route path="/challenge_idea" element={<ChallengeIdea />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/idea-space/:id" element={<IdeaSpace />} />

          {/* Add other routes as needed */}
        </Routes>
      </Router>
      </IdeaSpaceProvider>
    </Provider>
  );
}

export default App;
