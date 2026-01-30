import { useEffect, useRef, useState } from "react";
import UnsplashService from "../services/UnsplashService";
import Picture from "../models/Picture";

export default function useUnsplashPics() {
  const [pictures, setPictures] = useState([]);
  const [canDownloadMore, setCanDownloadMore] = useState(true);
  const page = useRef(1);

  const loadNext = () => {
    // On click even handler for requesting more pictures
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
    // Load the initial page
    const initialFetch = async () => {
      await getNextPage(false, 1);
      page.current = 2;
    };

    initialFetch();
  }, []);

  const getDetails = async (id) => {
    // Find picture in the collection
    const picture = pictures.find((pic) => pic.id === id);

    if (!picture) return;

    // Check if details have already been downloaded
    // If so, return the object
    if (picture.hasDetails()) return picture;

    // Get more details about the picture
    const details = await UnsplashService.getPictureDetails(id);

    // Add the details to the collection
    picture.addDetails(details);

    // Return the picture that now has the additional info
    return picture;
  };

  return { pictures, loadNext, canDownloadMore, getDetails };
}
