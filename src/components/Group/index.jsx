import React, { useContext } from 'react';
import classnames from 'classnames';

import { BoardContext } from 'context/BoardContext';

import styles from './styles.module.scss';

const Group = (props) => {
  const { keymap } = props;
  const {
    activeGroup,
    effects,
    isEditMode,
    setActiveGroup,
    setActiveModal
  } = useContext(BoardContext);
  const label = effects[keymap].label;

  function handleOnClick() {
    if (isEditMode || !label) {
      setActiveModal(keymap);
    } else {
      setActiveGroup(keymap);
    }
  }

  return (
    <div
      className={classnames(styles.effectButton, {
        [styles.editMode]: isEditMode,
        [styles.active]: activeGroup === keymap,
      })}
      onClick={handleOnClick}
    >
      <div className={styles.key}>{keymap}</div>
      <div className={styles.name}>{label}</div>
    </div>
  );
};

export default Group;
