import { useState } from 'react';
import ChatBot from './components/ChatBot';

function App() {
   return (
      <div className="flex flex-col justify-center items-stretch p-8 gap-8 h-screen">
         <h1 className="text-center text-3xl font-bold">
            Welcome to our ChatBot!
         </h1>
         <ChatBot />
      </div>
   );
}

export default App;
