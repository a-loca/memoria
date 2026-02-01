import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import styles from "./PictureDetails.module.css";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import example from "../../assets/gallery_hero.jpg";

function PictureDetails({ getDetails }) {
  const { id } = useParams();
  const [picture, setPicture] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const picture = await getDetails(id);

      setPicture(picture);
    };

    fetchData();
  }, [id]);

  // Picture not found by the API, redirect
  if (picture == null) return <Navigate to={"/404"} replace />;

  // If the picture object is still empty, show the loading screen
  if (!picture.description) return <LoadingScreen />;

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <p>{picture.description}</p>
        <dl>
          <div>
            <dt>Photographer</dt>
            <dd>{picture.user.name}</dd>
          </div>

          <div>
            <dt>Location</dt>
            <dd>Kyoto, Japan</dd>
          </div>

          <div>
            <dt>EXIF</dt>
            <dd>ISO 100 · 1/125 s · f/2.8 · 50 mm</dd>
          </div>

          <div>
            <dt>Shot On</dt>
            <dd>Canon E0S 40 D</dd>
          </div>
        </dl>
      </div>
      <div className={styles.rightContent}>
        <div className={styles.pics}>
          {[...new Array(20)].map((_, i) => {
            return (
              <div className={styles.picWrapper} key={i}>
                <img src={example} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PictureDetails;
