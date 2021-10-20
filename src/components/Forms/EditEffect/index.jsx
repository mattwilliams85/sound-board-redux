import React, { useContext, useState } from 'react';
import { TwitterPicker } from 'react-color';
import { Howl } from 'howler';

import { getAudioPath } from 'helpers.js';
import { colors } from 'constants.js';
import { BoardContext } from 'context/BoardContext';

import { ReactComponent as IconTrash } from 'icons/trash-icon.svg';
import styles from './styles.module.scss';

const EditEffect = ({keymap}) => {
  const {
    activeGroup,
    activeModal,
    setActiveModal,
    setEffects,
    effects,
    setIsEditMode,
    files,
    folders
  } = useContext(BoardContext);
  const folder = effects[activeGroup].label
  const effect = effects[folder][activeModal] || {};

  const initialValues = {
    folder: folder,
    file: files[0],
    keymap: '',
    color: { hex: '#de1bab' },
  };
  const [values, setValues] = useState(effect.file ? effect : initialValues);

  function handleChange(e) {
    const { target } = e;
    const { name, value } = target;
    e.persist();
    setValues({ ...values, [name]: value, keymap: activeModal });
  }

  function handleColorChange(e) {
    setValues({ ...values, color: e });
  }

  function addEffect(e) {
    e.preventDefault();

    const path = getAudioPath(values);
    const sound = new Howl({
      src: [path],
      preload: 'metadata',
      onload: (e) => {
        const duration = sound.duration();
        effects[folder][activeModal] = {
          ...values,
          duration,
          id: `${activeGroup}_${activeModal}`,
        };
        updateEffects(effects);
      },
    });
  }

  function removeEffect() {
    effects[folder] = undefined;
    updateEffects(effects);
  }

  function updateEffects(effects) {
    localStorage.setItem('effects', JSON.stringify(effects));
    setValues(initialValues);
    setActiveModal();
    setEffects(effects);
    setIsEditMode(false);
  }

  return (
    <>
      {effect.file && (
        <IconTrash className={styles.trashIcon} onClick={removeEffect} />
      )}
      <h2>Edit {activeModal.toUpperCase()} Button</h2>
      <form onSubmit={addEffect}>
        <div className={styles.input}>
          <label>Music File</label>
          <select
            name="file"
            type="file"
            value={values}
            onChange={(value) => handleChange(value)}
            required
          >
            {files.map((name, index) => {
              return (
                <option key={name} value={name}>
                  {name.replace(/\.[^/.]+$/, "")}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.input}>
          <label>Color</label>
          <TwitterPicker
            triangle={'hide'}
            colors={colors}
            color={values.color}
            value={values.color}
            onChange={handleColorChange}
          />
        </div>
        <button>Submit</button>
      </form>
    </>
  );
};

export default EditEffect;
