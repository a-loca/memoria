import { useEffect, useRef, useState } from "react";
import UnsplashService from "../services/UnsplashService";
import Picture from "../models/Picture";

export default function useUnsplashPics() {
  const [pictures, setPictures] = useState([]);
  const [canDownloadMore, setCanDownloadMore] = useState(true);
  const page = useRef(1);

  const loadNext = () => {
    getNextPage(true, page.current);
    page.current += 1;
  };

  const getNextPage = async (append = true, page) => {
    // Get JSON data from API
    const data = await UnsplashService.getNextPage(page);

    // Create picture objects from the JSON data
    let pics = data.map(Picture.newPicture);

    // If the number of returned images is lower than
    // the 30 requested, that means that there are no more
    // images to be downloaded
    if (pics.length < 30) {
      setCanDownloadMore(false);
    }

    setPictures((prev) => (append ? prev.concat(pics) : pics));
  };

  useEffect(() => {
    const initialFetch = async () => {
      getNextPage(false, 1);
      page.current = 2;
    };

    initialFetch();
  }, []);

  return { pictures, loadNext, canDownloadMore };
}
