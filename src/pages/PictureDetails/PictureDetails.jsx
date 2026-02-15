import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "./PictureDetails.module.css";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import PictureScroller from "../../components/PictureScroller/PictureScroller";
import useDeviceWidth from "../../hooks/useDeviceWidth";
import Spinner from "../../components/Spinner/Spinner";
import gsap from "gsap";

function PictureDetails({ getDetails, pictures, loadNextPage }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useDeviceWidth();

  // Check if the requested image was already in the list of pictures
  // retrieved through the gallery
  const [wasAlreadyDownloaded, setWasAlreadyDownloaded] = useState();

  // Initializing an empty object because I can then
  // check if the value turns to null, meaning that the picture
  // has not been found, while still showing a loading screen
  const [picture, setPicture] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { picture, wasAlreadyDownloaded } = await getDetails(id);
      setPicture(picture);
      setWasAlreadyDownloaded(wasAlreadyDownloaded);
    };

    fetchData();
  }, [id]);

  // Smoothly fade in image when loaded
  const image = useRef();
  const handleLoad = () => {
    gsap.fromTo(image.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  };

  // Picture not found by the API, redirect to 404
  if (picture == null) return <Navigate to={"/404"} replace />;

  // If the picture object is still empty, show the loading screen
  // I can just check the description because all the fields are
  // initialized at once
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
        <img id="detailsPicture" ref={image} src={picture.urls.regular} onLoad={handleLoad} />
      </div>
      <div className={styles.rightContent}>
        <PictureScroller
          // If the requested picture is not in the state
          // that holds all the pictures, it means that the user
          // arrived there through direct URL request
          pictures={wasAlreadyDownloaded ? pictures : [picture]}
          currentPic={picture}
          onSelectPic={(id) => navigate(`/gallery/${id}`)}
          loadNextPage={loadNextPage}
          axis={isMobile ? "horizontal" : "vertical"}
        />
      </div>
    </div>
  );
}

export default PictureDetails;
