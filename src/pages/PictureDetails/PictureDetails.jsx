import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import NotFound from "../NotFound/NotFound";

function PictureDetails({ getDetails }) {
  const { id } = useParams();
  const [picture, setPicture] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const picture = await getDetails(id);

      if (!picture) {
        return <Navigate to={<NotFound />} />;
      }

      setPicture(picture);
    };

    fetchData();
  }, []);

  return <div>{picture.description ?? "Loading"}</div>;
}

export default PictureDetails;
