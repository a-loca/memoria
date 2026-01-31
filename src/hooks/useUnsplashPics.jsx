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
    sessionStorage.setItem("page", page.current);
  };

  const getNextPage = async (append = true, page) => {
    // Get JSON data from API
    const data = await UnsplashService.getNextPage(page);

    // Create picture objects from the JSON data
    let pics = data.map(Picture.newFromApi);

    // If the number of returned images is lower than
    // the 30 requested, that means that there are no more
    // images to be downloaded
    if (pics.length < 30) {
      setCanDownloadMore(false);
      sessionStorage.setItem("canDownloadMore", false);
    }

    setPictures((prev) => {
      if (append) {
        // Append pics to session storage
        const newPics = prev.concat(pics);
        sessionStorage.setItem("pictures", JSON.stringify(newPics.map((p) => p.toStore())));
        return newPics;
      } else {
        // Save the new fetched images in the session storage
        sessionStorage.setItem("pictures", JSON.stringify(pics.map((p) => p.toStore())));
        return pics;
      }
    });
  };

  useEffect(() => {
    // Load the initial page
    const initialFetch = async () => {
      // If data is present in the session storage, restore it
      // and the latest requested page
      if (
        sessionStorage.getItem("pictures") &&
        sessionStorage.getItem("page") &&
        sessionStorage.getItem("canDownloadMore")
      ) {
        // Restore the pics
        const rawPics = JSON.parse(sessionStorage.getItem("pictures"));

        const pics = rawPics.map(Picture.newFromStorage);
        setPictures(pics);

        // Restore latest fetched page
        page.current = parseInt(sessionStorage.getItem("page"));

        setCanDownloadMore(JSON.parse(sessionStorage.getItem("canDownloadMore")));
      } else {
        // Fetch first page from API and save in the storage
        await getNextPage(false, 1);
        page.current = 2;
        sessionStorage.setItem("page", 2);
        sessionStorage.setItem("canDownloadMore", true);
      }
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

    // TODO: UPDATE THE LIST OF PICTURES

    // Return the picture that now has the additional info
    return picture;
  };

  return { pictures, loadNext, canDownloadMore, getDetails };
}
