import React, { useState } from "react";
import styles from "./Gallery.module.css";
import PlusMarker from "../../components/PlusMarker/PlusMarker";
import MasonryLayout from "../../components/MasonryLayout/MasonryLayout";
import ListLayout from "../../components/ListLayout/ListLayout";
import ViewModeSwitcher from "../../components/ViewModeSwitcher/ViewModeSwitcher";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import GalleryHero from "../../components/GalleryHero/GalleryHero";
import ErrorScreen from "../../components/ErrorScreen/ErrorScreen";

function Gallery({ pictures, loadNext, canDownloadMore }) {
  const modes = [
    { type: "Grid", id: 0, element: <MasonryLayout pictures={pictures} /> },
    { type: "List", id: 1, element: <ListLayout pictures={pictures} /> },
  ];

  const [currentMode, setCurrentMode] = useState(modes[0].id);

  return (
    <div className={styles.container}>
      <GalleryHero />

      <div className={styles.gallery}>
        <div className={styles.wrapper}>
          <div className={styles.sticky}>
            <div className={styles.plusMarkers}>
              <PlusMarker />
              <PlusMarker />
            </div>

            <div className={styles.actions}>
              <div className={styles.switcher}>
                <ViewModeSwitcher
                  modes={modes}
                  currentMode={currentMode}
                  setCurrentMode={setCurrentMode}
                />
              </div>
              <ScrollToTopButton />
            </div>
          </div>
        </div>

        {!pictures || pictures.length === 0 ? (
          <ErrorScreen />
        ) : (
          <>
            <div className={styles.content}>
              {modes.find((mode) => mode.id === currentMode).element}
            </div>
            <div className={styles.loadMore}>
              <LoadMoreButton enabled={canDownloadMore} action={loadNext} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Gallery;
