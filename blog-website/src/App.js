import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Modal from './components/Modal/Modal';

function App() {
  const [showModal, setShowModal] = useState(false);

  const hideModalHandler= () => {
    setShowModal(false);
  }

  const showModalHandler = () => {
    setShowModal(true);
  }

  return (
    <div className="App">
      {showModal && <Modal onClose={hideModalHandler}/>}
      <Header onAddBlow={showModalHandler}/>
    </div>
  );
}

export default App;
