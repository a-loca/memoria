import { useEffect, useRef, useState } from "react";
import UnsplashService from "../services/UnsplashService";
import Picture from "../models/Picture";

export default function useUnsplashPics() {
  const [pictures, setPictures] = useState(() => {
    // Initialize pictures with data read from session storage
    // if present, otherwise empty array and another useEffect
    // will populate the list
    const stored = sessionStorage.getItem("pictures");
    if (!stored) return [];
    return JSON.parse(stored).map(Picture.newFromStorage);
  });

  const [canDownloadMore, setCanDownloadMore] = useState(() => {
    // Load value from session storage, otherwise it must
    // mean that there haven't been any requests for additional
    // pages to the API yet and there are more to be downloaded
    const stored = sessionStorage.getItem("canDownloadMore");
    return stored ? JSON.parse(stored) : true;
  });

  // If there isn't a stored value, it means that
  // the app has just started, which means that
  // no request for new pages has been sent yet, so
  // the current page can be the first
  const page = useRef(parseInt(sessionStorage.getItem("page")) || 1);

  const initialize = async () => {
    // If the data is present in the storage, it has already
    // been loaded when the state was created,
    // which means that there's no need for an API call
    if (pictures.length > 0) return;

    // Fetch first page from API and save in the storage
    await getNextPage(false, 1);

    // Start counting from the next page and save it into storage
    page.current = 2;
    sessionStorage.setItem("page", 2);
  };

  const loadNextPage = () => {
    // On click even handler for requesting more pictures
    getNextPage(true, page.current);
    page.current += 1;
    sessionStorage.setItem("page", page.current);
  };

  const getNextPage = async (append = true, page) => {
    // Get JSON data from API
    // If no data is fetched, the pictures list will stay
    // empty and the view will handle it by showing an appropriate message
    const data = await UnsplashService.getNextPage(page);

    // Create picture objects from the JSON data
    let pics = data.map(Picture.newFromApi);

    // If the number of returned images is lower than
    // the 30 requested, that means that there are no more
    // images to be downloaded
    if (pics.length < 30) {
      setCanDownloadMore(false);
    }

    setPictures((prev) => (append ? prev.concat(pics) : pics));
  };

  useEffect(() => {
    // If the list is null or empty, there's no need
    // to back it up in the storage
    if (!pictures || pictures.length < 1) return;

    // Every time the list of pictures changes, update the session storage
    sessionStorage.setItem("pictures", JSON.stringify(pictures.map((p) => p.toStore())));
  }, [pictures]);

  useEffect(() => {
    // Update the session storage every time the state changes
    sessionStorage.setItem("canDownloadMore", canDownloadMore);
  }, [canDownloadMore]);

  const getDetails = async (id) => {
    // Find picture in the collection
    let picture = pictures.find((pic) => pic.id === id);

    // Check if picture is not undefined or null
    const wasAlreadyDownloaded = !!picture;

    // If the picture exists in the already downloaded list
    if (wasAlreadyDownloaded) {
      // Check if the picture already has the details
      if (picture.hasDetails()) return { picture, wasAlreadyDownloaded };

      // If the picture does not have the details, fetch them
      const details = await UnsplashService.getPictureDetails(id);

      // If details are null (there has been a problem with the request)
      // just return the image as is
      if (!details) return { picture, wasAlreadyDownloaded };

      // Add retrieved data to the object
      picture.addDetails(details);

      // Save the data in the list
      setPictures((prev) => prev.map((p) => (p.id === id ? picture : p)));

      return { picture, wasAlreadyDownloaded };
    } else {
      // If the picture is not in the downloaded list, check
      // if it actually exists by sending the request
      const fullData = await UnsplashService.getPictureDetails(id);

      // If it does not exist, return null and the page will redirect to 404
      if (!fullData) return { picture: null, wasAlreadyDownloaded };

      // If the details exist, create the object using that data and send it back
      const newPic = Picture.newFromApi(fullData);
      newPic.addDetails(fullData);

      return { picture: newPic, wasAlreadyDownloaded };
    }
  };

  return { initialize, pictures, loadNextPage, canDownloadMore, getDetails };
}
