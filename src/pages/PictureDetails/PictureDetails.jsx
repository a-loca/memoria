import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import styles from "./PictureDetails.module.css";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

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

  if (picture == null) return <Navigate to={"/404"} replace />;

  return (
    <div className={styles.container}>
      <LoadingScreen/>
    </div>
  );
}

export default PictureDetails;
