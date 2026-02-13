import React, { useEffect, useRef } from "react";
import styles from "./PictureScroller.module.css";
import gsap from "gsap";
import { lerp } from "../../utils/utils";
import Picture from "../Picture/Picture";

function PictureScroller({ pictures, currentPic, onSelectPic, loadNextPage, axis }) {
  // Ref to container that needs to be moved
  const container = useRef();

  // The wrappers of the pictures
  const pics = useRef([]);

  // Height and width of one pic
  const picHeight = useRef();
  const picWidth = useRef();

  // Pixel space between centers of sequential pics
  const picStride = useRef();

  // Need to keep a ref to the pictures state
  // because inside the animation loop i can't access
  // the state, the list of pics will always be the one
  // that the prop had when the function was created
  const currentPics = useRef();

  // The X/Y coordinate the pics container needs to be moved to
  // based on the scroll the user made
  const targetCoord = useRef(0);

  // The actual X/Y value of the container used to animate
  // with linear interpolation with respect to the target
  // Y goal
  const currentCoord = useRef(0);

  // ID of the current animation loop
  const rafId = useRef();

  // Track if the wheel scroll has stopped to avoid
  // constant requests for the currently selected picture
  // const hasSettled = useRef(true);

  // The center of the window, based on the current axis
  const windowCenter = useRef();

  // Record the latest X position of the finger while scrolling
  // in order to detect the amount of force and movement
  // to apply to the container
  const latestTouch = useRef();

  // Vertical scroll event handler
  const VERTICAL_SPEED = 0.5;
  const handleScroll = (e) => {
    e.preventDefault();

    // hasSettled.current = false;

    // The "amount of scroll" requested
    const offset = -1 * e.deltaY * VERTICAL_SPEED;

    moveContainer(offset);
  };

  // Horizontal scroll event handlers
  const HORIZONTAL_SPEED = 2;
  const handleTouchMove = (e) => {
    // The wheel event natively tracks the "amount of scroll",
    // while in the touch event it needs to be manually computed
    // as the difference between the current X value of the finger
    // and the previous X value
    const clientX = e.touches[0].clientX;

    // Negative if finger moving towards the left
    const offset = (clientX - latestTouch.current) * HORIZONTAL_SPEED;

    latestTouch.current = clientX;

    // Move the container using the offset tracked
    // through the event.
    moveContainer(offset);
  };

  const handleTouchStart = (e) => {
    // hasSettled.current = false;
    latestTouch.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    latestTouch.current = null;
  };

  // Actual movement based on the amount requested through scroll
  const moveContainer = (offset) => {
    const rect = container.current.getBoundingClientRect();

    // The coordinate the container will be after the scroll
    let next = targetCoord.current + offset;

    let remainingTop = 0;
    let remainingBottom = 0;

    if (axis === "vertical") {
      // How much space left until the first pic of the list reaches the
      // middle of the window (it's a positive number)
      remainingTop = windowCenter.current - (rect.top + picHeight.current / 2);
      // How much space left until the last pic of the list reaches
      // the middle of the window (it's a negative number)
      remainingBottom = windowCenter.current - (rect.bottom - picHeight.current / 2);
    } else {
      remainingTop = windowCenter.current - (rect.left + picWidth.current / 2);
      remainingBottom = windowCenter.current - (rect.right - picWidth.current / 2);
    }

    // Can't move the container down past the sum of the current position and the space
    // left until the upper bound, if vertical scroll. Same for horizontal scroll,
    // cannot move left past the first pic
    next = Math.min(next, remainingTop + currentCoord.current);

    // Can't move the container up past the sum of the current position and the
    // space left until the lower bound, if vertical scroll. Cannot move right
    // past the last pic.
    next = Math.max(next, remainingBottom + currentCoord.current);

    // The animation is implemented through the requestanimationframe
    // loop
    targetCoord.current = next;
  };

  // Animation loop
  const animate = () => {
    // Gradually move the current X/Y value of the container
    // towards the target X/Y coordinate it needs to reach
    currentCoord.current = lerp(currentCoord.current, targetCoord.current, 0.05);

    const prop = axis === "vertical" ? "y" : "x";
    gsap.set(container.current, { [prop]: currentCoord.current });

    if (currentPics.current && currentPics.current.length > 1) {
      decideIfPictureChange();
    }

    rafId.current = requestAnimationFrame(animate);
  };

  const convergenceIndex = useRef(-1);
  const convergenceTime = useRef();

  const CONVERGENCE_THRESH = useRef(500); // ms

  const decideIfPictureChange = () => {
    let fromTop = targetCoord.current - windowCenter.current;
    const index = -Math.trunc(fromTop / picStride.current);

    const now = performance.now();

    if (convergenceIndex.current === index) {
      // Check how much time has passed since the index
      // was set. If the target has been the same for some time,
      // it means that the intention of the user is to load the picture
      // at the index the scroll will end up at, meaning that it can be loaded
      if (now - convergenceTime.current > CONVERGENCE_THRESH.current) {
        changeCurrentPic(index);
      }
    } else {
      // If the target index the scroll aims to has changed
      // start counting for how long it has been the case
      convergenceIndex.current = index;
      convergenceTime.current = now;
    }
  };

  // Currently selected picture ID
  const latestFetchedIndex = useRef();

  useEffect(() => {
    latestFetchedIndex.current = pictures.findIndex((p) => currentPic.id === p.id);
  }, []);

  const changeCurrentPic = (index) => {
    if (latestFetchedIndex.current != index) {
      latestFetchedIndex.current = index;

      // Look for the picture in the list based on its index
      const newPic = currentPics.current[index];

      // Request navigation towards the details page of the
      // new picture the user has scrolled to
      onSelectPic(newPic.id);

      // Load the next page of pics if the index is the last of the list
      if (index === currentPics.current.length - 1 && currentPics.current.length > 1) {
        loadNextPage();
      }
    }
  };

  const handleClick = (index) => {
    const picRect = pics.current[index].getBoundingClientRect();

    let center = 0;
    if (axis === "vertical") {
      center = picRect.top + picRect.height / 2;
    } else {
      center = picRect.left + picRect.width / 2;
    }

    targetCoord.current = targetCoord.current + (windowCenter.current - center);

    // hasSettled.current = false;
  };

  const handleResize = () => {
    // Calc picture height and width, since they change through css media query
    const first = pics.current[0].getBoundingClientRect();
    const second = (
      pics.current.length > 1 ? pics.current[1] : pics.current[0]
    ).getBoundingClientRect();

    picHeight.current = first.height;
    picWidth.current = first.width;

    if (axis == "vertical") {
      // Some measurements required for computing positions
      // while scrolling: space between start of consecutive images
      // and vertical center of the window
      picStride.current = second.top - first.top;
      windowCenter.current = window.innerHeight / 2;

      // Position container so that the selected picture is centered
      // The actual movement is applied through the raf loop
      targetCoord.current =
        -latestFetchedIndex.current * picStride.current +
        windowCenter.current -
        picHeight.current / 2;
    } else {
      // Measurements: space between start of sequential pics and horizontal
      // center of the window
      picStride.current = second.left - first.left;
      windowCenter.current = window.innerWidth / 2;

      // Position the container so that the selected picture is centered
      targetCoord.current =
        -latestFetchedIndex.current * picStride.current +
        windowCenter.current -
        picWidth.current / 2;
    }

    // No need to actually animate the first movement of the container to
    // center the correct picture, just snap into place
    currentCoord.current = targetCoord.current;
  };

  useEffect(() => {
    // Needs to be registered every time an axis changes
    window.addEventListener("resize", handleResize);
    handleResize();

    CONVERGENCE_THRESH.current = axis === "vertical" ? 500 : 800;

    if (axis === "vertical") {
      // Reset the horizontal position of the container
      gsap.set(container.current, { x: 0 });

      // Remove touch events and add scroll event
      document.removeEventListener("touchstart", handleTouchMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchMove);
      document.addEventListener("wheel", handleScroll, { passive: false });
    } else {
      // Reset vertical position of the container
      gsap.set(container.current, { y: 0 });
      // Remove scroll event and add touch events
      document.removeEventListener("wheel", handleScroll);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchend", handleTouchEnd);
    }

    // Cancel previous animation loop and start a new one
    // Needed because the value of axis will not be updated
    // inside the animate function, after it is created and
    // registered in the loop
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // Start the smooth animation loop
    animate();

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("wheel", handleScroll);
      document.removeEventListener("touchstart", handleTouchMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchMove);
    };
  }, [axis]);

  useEffect(() => {
    // Updating the ref to mirror the value of the prop
    currentPics.current = pictures;
  }, [pictures]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.pics} ref={container}>
        {pictures.map((pic, i) => {
          return (
            <div
              ref={(el) => (pics.current[i] = el)}
              className={styles.picWrapper}
              key={pic.id}
              onClick={() => handleClick(i)}
              data-selected={pic.id === currentPic.id}
            >
              <Picture src={pic.urls.thumb} alt={pic.description} blurhash={pic.blurhash} />
            </div>
          );
        })}
      </div>
      <div className={styles.frame}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default PictureScroller;
