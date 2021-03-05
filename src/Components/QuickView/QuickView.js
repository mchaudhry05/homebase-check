import "./quickViewStyle.css";
import { useState } from "react";
import AddModal from "../AddModal/AddModal";

/**
 * QuickView is a component that represents the three
 * different pieces (total invested, diversity, the ability
 * to add a stock) of information you see on the Dashboard
 */
const QuickView = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const changeModalState = () => {
    setShowAddModal(!showAddModal);
  };

  return (
    <div className="quick-view-container">
      <div className="quick-view-holder"></div>
      <div className="quick-view-holder"></div>
      <div className="quick-view-holder add">
        <div className="label-container">
          <h1 className="label">Update</h1>
        </div>

        <div className="add-button" onClick={changeModalState}>
          <h1 className="add-icon" onClick={changeModalState}>
            +
          </h1>
        </div>
      </div>
      {showAddModal ? <AddModal closeModal={changeModalState} /> : null}
    </div>
  );
};

export default QuickView;
