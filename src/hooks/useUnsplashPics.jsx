import { useEffect, useState } from "react";
import UnsplashService from "../services/UnsplashService";
import Picture from "../models/Picture";

export default function useUnsplashPics() {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await UnsplashService.getNextPage();

      let pics = [];
      data.forEach((obj, i) => {
        pics.push(Picture.newPicture(obj));
      });
      setPictures(pics);
    };

    getData();
  }, []);

  return { pictures };
}
