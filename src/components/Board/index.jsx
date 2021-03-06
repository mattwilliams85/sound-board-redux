import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';
import classnames from 'classnames';
import { find } from 'lodash';
import fs from 'fs';

import Effect from 'components/Effect';
import Group from 'components/Group';
import EditEffect from 'components/Forms/EditEffect';
import EditGroup from 'components/Forms/EditGroup';
import Modal from 'components/Modal';
import DurationList from 'components/DurationList';

import { getAudioPath, generateUniqueRandom } from 'helpers.js';
import { defaultEffects, qwerty } from 'constants.js';
import { BoardContext } from 'context/BoardContext';

import { ReactComponent as IconEdit } from 'icons/edit-icon.svg';
import { ReactComponent as IconClose } from 'icons/close-icon.svg';
import styles from './styles.module.scss';

const Board = () => {
  const [effects, setEffects] = useState(
    { ...defaultEffects, ...JSON.parse(localStorage.getItem('effects')) } ||
      defaultEffects
  );
  const [activeKey, setActiveKey] = useState();
  const [loopActive, setLoopActive] = useState();
  const [metaActive, setMetaActive] = useState();
  const [randomizeActive, setRandomizeActive] = useState();
  const [activeModal, setActiveModal] = useState();
  const [activeEffects, setActiveEffects] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeGroup, setActiveGroup] = useState(effects.activeGroup || 0);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    getFolderNames();
  }, []);

  useEffect(() => {
    getFileNames(effects[activeGroup].label)
    folders.forEach(name => {
      if (!effects[name]) {
        effects[name] = {};
        localStorage.setItem('effects', JSON.stringify(effects));
      }
    })
  }, [folders, activeGroup])

  useEffect(() => {
    localStorage.setItem(
      'effects',
      JSON.stringify({ ...effects, activeGroup })
    );
  }, [activeGroup]);

  function getFolderNames() {
    const names = [];

    fs.readdir('./src/audio', (err, files) => {
      files.forEach((file) => {
        if (file[0] !== '.') names.push(file);
      });
    });
    setFolders(names);
  }

  function getFileNames(folderName) {
    if (!folderName) return [];

    const names = [];

    fs.readdir(`./src/audio/${folderName}`, (err, files) => {
      files.forEach((file) => {
        if (file[0] !== '.') names.push(file);
      });
    });
    setFiles(names);
  }

  function playEffect(keymap) {
    const folder = effects[activeGroup].label
    const effect = effects[folder][keymap];

    if (effect) {
      const path = getAudioPath(effect);
      const sound = new Howl({
        src: [path],
        rate: randomizeActive ? generateUniqueRandom() : 1,
        loop: loopActive,
      });

      const dupeEffect = find(activeEffects, { id: effect.id });
      if (loopActive && dupeEffect) {
        dupeEffect.sound.stop();
        setActiveEffects({
          ...activeEffects,
          [dupeEffect.timestamp]: undefined,
        });
      } else {
        const timestamp = Date.now();
        setActiveEffects({
          ...activeEffects,
          [timestamp]: { ...effect, timestamp, looping: loopActive, sound },
        });
        sound.play();
      }
    }
  }

  function handleKeyDown(e) {
    if (!e.key) return;

    const key = e.key.toLowerCase();
    if (isEditMode || activeModal || metaActive) return;

    if (qwerty[0].includes(key)) {
      setActiveGroup(key);
    } else if (key === 'shift') {
      setLoopActive(true);
    } else if (key === 'meta') {
      setMetaActive(true);
    } else if (key === 'tab') {
      e.preventDefault();
      setRandomizeActive(!randomizeActive);
    } else {
      playEffect(key);
      setActiveKey(key);
    }
  }

  function handleKeyUp(e) {
    if (e.key === 'Shift') {
      setLoopActive(false);
    } else if (e.key === 'Meta') {
      setMetaActive(false);
    }
  }

  return (
    <BoardContext.Provider
      value={{
        activeKey,
        setActiveKey,
        activeModal,
        setActiveModal,
        activeGroup,
        setActiveGroup,
        effects,
        setEffects,
        isEditMode,
        setIsEditMode,
        playEffect,
        folders,
        files
      }}
    >
      {isEditMode ? (
        <IconClose
          className={styles.editToggle}
          onClick={() => setIsEditMode(false)}
        />
      ) : (
        <IconEdit
          className={styles.editToggle}
          onClick={() => setIsEditMode(true)}
        />
      )}
      <div
        className={classnames(styles.topButton, styles.shiftButton, {
          [styles.active]: loopActive,
        })}
      >
        Loop Effect<span className={styles.buttonKey}>???</span>
      </div>
      <div
        className={classnames(styles.topButton, styles.tabButton, {
          [styles.active]: randomizeActive,
        })}
      >
        Randomize <span className={styles.buttonKey}>???</span>
      </div>
      <div className={styles.board}>
        <div>
          <div className={styles.row}>
            {qwerty[0].map((keymap) => {
              return <Group key={keymap} keymap={keymap} />;
            })}
          </div>
          {qwerty.slice(1, 4).map((row, index) => {
            return (
              <div className={styles.row} key={index}>
                {row.map((keymap) => {
                  return (
                    <Effect
                      keymap={keymap}
                      key={keymap}
                      loopActive={loopActive}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <DurationList
          activeEffects={activeEffects}
          setActiveEffects={setActiveEffects}
        />
      </div>

      {activeModal && isNaN(activeModal) && (
        <Modal onOverlayClick={() => setActiveModal()}>
          <EditEffect />
        </Modal>
      )}
      {activeModal && !isNaN(activeModal) && (
        <Modal onOverlayClick={() => setActiveModal()}>
          <EditGroup />
        </Modal>
      )}
    </BoardContext.Provider>
  );
};

export default Board;
