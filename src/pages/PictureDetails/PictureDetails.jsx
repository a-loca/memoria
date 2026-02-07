import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "./PictureDetails.module.css";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import PictureScroller from "../../components/PictureScroller/PictureScroller";

function PictureDetails({ getDetails, pictures, loadNextPage }) {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <p>{picture.description ?? "Unavailable"}</p>
        <dl>
          <div>
            <dt>Photographer</dt>
            <dd>{picture.user.name ?? "Unavailable"}</dd>
          </div>

          <div>
            <dt>Location</dt>
            <dd>{picture.location?.name ?? "Unavailable"}</dd>
          </div>

          <div>
            <dt>EXIF</dt>
            <dd>{picture.getEXIFString() ?? "Unavailable"}</dd>
          </div>

          <div>
            <dt>Shot On</dt>
            <dd>{picture.exif?.name ?? "Unavailable"}</dd>
          </div>
        </dl>
      </div>
      <div className={styles.centerContent}>
        {/* TODO: POLAROID   */}
        <img src={picture.urls.regular} />
      </div>
      <div className={styles.rightContent}>
        <PictureScroller
          pictures={pictures}
          currentPic={picture}
          onSelectPic={(id) => navigate(`/gallery/${id}`)}
          loadNextPage={loadNextPage}
        />
      </div>
    </div>
  );
}

export default PictureDetails;
