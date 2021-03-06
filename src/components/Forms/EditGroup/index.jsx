import React, { useContext, useState } from 'react';

import { BoardContext } from 'context/BoardContext';

import { ReactComponent as IconTrash } from 'icons/trash-icon.svg';
import styles from './styles.module.scss';

const EditGroup = () => {
  const { activeModal, setActiveModal, effects, setIsEditMode, folders } =
    useContext(BoardContext);
  const effect = effects[activeModal] || {};

  const [values, setValues] = useState(
    effects[activeModal].label || folders[0]
  );

  function handleChange(e) {
    const { target } = e;
    const { value } = target;
    e.persist();
    setValues(value);
  }

  function addMode(e) {
    e.preventDefault();
    effects[activeModal].label = values;
    updateEffects(effects);
  }

  function removeMode() {
    effects[activeModal].label = undefined;
    updateEffects(effects);
  }

  function updateEffects(effects) {
    localStorage.setItem('effects', JSON.stringify(effects));
    setActiveModal();
    setIsEditMode(false);
  }

  return (
    <>
      {effect.label && (
        <IconTrash className={styles.trashIcon} onClick={removeMode} />
      )}
      <h2>Edit Mode Button</h2>
      <form onSubmit={addMode}>
        <div className={styles.input}>
          <label>Label</label>
          <select
            name="label"
            value={values}
            onChange={(value) => handleChange(value)}
            required
          >
            {folders.map((name, index) => {
              return (
                <option key={name} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <button>Submit</button>
      </form>
    </>
  );
};

export default EditGroup;
