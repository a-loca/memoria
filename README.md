# ☁️ Memoria
Memoria is a web application that leverages [Unsplash API](https://unsplash.com/developers) to recreate the nostalgic vibe of joyful **memories** captured through **old-school film photography**.

The website was made with React.js and animated with [GSAP](https://gsap.com/) as part of the "Web Applications: Design and Development" course @Unimib.

## 📚 Table of contents
- [☁️ Memoria](#️-memoria)
  - [📚 Table of contents](#-table-of-contents)
  - [🗺️ Sitemap](#️-sitemap)
    - [Home (`/`)](#home-)
    - [Gallery (`/gallery`)](#gallery-gallery)
    - [Details (`/gallery/{id}`)](#details-galleryid)
    - [About (`/about`)](#about-about)
  - [⚙️ Technical Details](#️-technical-details)
    - [Unsplash API](#unsplash-api)
      - [`GET /collections/:id/photos`](#get-collectionsidphotos)
      - [`GET /photos/:id`](#get-photosid)
    - [MVVC](#mvvc)
      - [ViewModel](#viewmodel)
    - [Example Scenario](#example-scenario)
  - [🖥️ UI](#️-ui)
    - [Components](#components)
    - [Animations](#animations)
  - [🚀 Deployment](#-deployment)
  - [🚧 Future plans](#-future-plans)


## 🗺️ Sitemap
The website is made of 4 main pages and a 404 screen. What follows is a small description of the structure of the website.

### Home (`/`)
Just a welcome screen to set the tone of the application. As of now, the home page does not have any functionality.

### Gallery (`/gallery`)
The main content of the application. Here the user will have access to the pictures that are fetched from a **custom collection** of **hand-picked images** from Unsplash. You can find the collection [here](https://unsplash.com/collections/oxGVBF-n7Ts/film).

There are two separate modes of visualizing the pictures:
- **Grid**: a Pinterest-style layout built using the [masonry-grid](https://masonry-grid.js.org/) library.
- **List**: a vertical list of text descriptions of the available pictures. Hover each one to have a preview of the image.

By clicking on an image in the grid or a description in the list, you will be redirected to the details page of that specific picture.

### Details (`/gallery/{id}`)
Here you will be able to have a better look at the image you have selected, and also have additional information about:
- Photographer
- Location
- Camera exposure settings (ISO, shutter speed, aperture, focal length)
- The name of the camera/editing software that produced the picture

Unfortunately, most pictures are uploaded to Unsplash with incomplete metadata, so the information the website is able to gather through the API is limited, but interesting nonetheless, when present.

The user will be able to navigate to the rest of the images in the collection directly from this page by scrolling or clicking on the previews of the pictures in the sidebar.

### About (`/about`)
Another presentation-only page that is meant to provide some very brief information on the technological stack used to develop the website.

## ⚙️ Technical Details

### Unsplash API
The website uses Unsplash API to gather images to be displayed in the gallery. The idea of the website was always to recreate the nostalgic feeling of looking back at photographic albums, so other image retrieval related APIs were considered, the main alternative being Flickr. Unfortunately, Flickr's free API access was removed in May 2025. Unsplash was the next best option for my use case. 

> [!WARNING]
> Unsplash API only allows **50 requests/hour** for non-approved applications. Memoria has not been approved yet.

To access the API, a `UnsplashService` class with static functions was created at `src/services/UnsplashService.js`. This allows for better separation of concerns between all the different parts of the website. 

The endpoints that UnsplashService uses to collect data are the following.

#### `GET /collections/:id/photos`
Through the `getNextPage` function, the website is able to retrieve the next 30 pictures (maximum allowed by the API) in my custom collection on Unsplash, if requested by the user. Each request will specify the `page` parameter to make sure that the images are fetched in the correct order. Some of the information that this endpoint provides for each image: ID, original width and height, description, URLs to access it in different sizes, information about the user who uploaded it.

#### `GET /photos/:id`
The `getPictureDetails` function will get additional information about the specified image, which includes location and EXIF data, which ate not provided by the previous endpoint. 


### MVVC
The website was developed following the MVVC pattern:
- *Model*: a `Picture` class was created (`src/models/Picture.js`) to handle the parsing of the JSON data returned by the API into objects containing only the subset of information relevant to the application.
- *View*: divided into `src/pages/` and `src/components/`, will be explored later, in the UI section.
- *ViewModel*: the `useUnsplashPics` custom hook (`src/hooks/useUnsplashPics.jsx`) handles the state of the application and the interaction between the View and the data fetched through the `UnsplashService` class.

#### ViewModel
This is where the bulk of the logic of the application is implemented. It holds two state variables that are exposed to the rest of the app:

| State | Description |
|----------|-------------|
| `pictures` | The list of **pictures** that the website has already retrieved **from the Unsplash collection**. |
| `canDownloadMore` | A boolean variable that indicates **whether there are still remaining images in the collection** that have yet to be retrieved. Since the number of images requested with each API call is fixed at 30, we can assume that if a request for a new page returns a number of items that is not the maximum, then we have reached the end of the collection and the user should not be able to request more pics. |


The number of the latest page of images requested is stored in a ref, since we want it to persist through renders and does not need to trigger re-renders when changed.

The application uses the `sessionStorage` to **avoid repeating API calls**, given the strict usage limitations. Session storage was chosen over `localStorage` to avoid saving persistent data into the user's browser, since an application like Memoria is not meant for frequent usage. In case the Unsplash API request limit is reached:
- If the data is still present in the session storage, then the app will continue working, but it won't be able to fetch additional details about the images (location, EXIF).
- If there is no saved data in storage, an error screen will be displayed instead of the gallery.

Using the storage means that both **states are initialized through a function**: the app runs a check on the session storage and if it finds saved data, it uses it to initialize the state, otherwise it assigns a default value. The same goes for the page number ref. To keep state and storage synchronized, two `useEffect` hooks save the contents of the states into `sessionStorage` whenever they change, thanks to the dependency array.

`useUnsplashPics` also exposes 3 functions:

| Function | Description |
|----------|-------------|
| `initialize()` | Fetches the first page of pictures in the collection and adds them to the state, if they weren't already stored in the session storage. It's invoked from the Gallery page, the first time it is mounted. |
| `loadNextPage()` | Sends an API call to retrieve the next 30 images, while updating the `page` ref and its storage counterpart. It relies on the functionality provided by `UnsplashService`. |
| `getDetails(id)` | Fetches additional details about the specified picture through the `GET /photos/:id` API call implemented in the service. If the picture was also already present in the `pictures` state list, then that entry will be updated with the new data and in turn saved to the storage, so that the next time the details are requested they can be directly accessed locally instead of remotely. Delaying the request for details to when the user actually navigates to the details page is another way to try to reduce the number of API calls, given the limitations. |



### Example Scenario
This is an example of how the data is handled in Memoria.
1. User accesses the gallery: `initialize` is called through a `useEffect` hook, the first 30 images of the collection will be stored in the state defined in `useUnsplashPics` and displayed on the page. The pictures will be saved into the `sessionStorage`. 
2. User can decide to load more images through a special button at the end of the gallery page. A new API call will be made, and the resulting JSON will be parsed to create new Picture objects, saved into the state and session storage, and then shown through the UI.
3. User sees a picture that they like and decides to click on it to get more details. The `/gallery/{id}` page is loaded and an API call to get the details is dispatched. The new information will be integrated to the `pictures` state and storage, and then displayed to the user. In case the user reached the details page directly through the URL and typed a wrong picture ID, the `NotFound` page will be displayed instead.
4. The user can scroll the details page to change the picture that is currently being visualized. This will trigger a `navigate` function call (from `react-router-dom`) that will cause the component to re-render, and the same `useEffect` that retrieved the details the first time will run again, due to the ID specified in the URL being a dependency. The UI will thus be updated with the new data.

If the user decides to reload the page website, the state will be lost, but the data will still be accessible through the session storage, which means that no API calls are required to restore all the data that has already been downloaded.

## 🖥️ UI
### Components
The base structure of each of the pages of the website is layed down in specific components in the `src/pages/` folder. These are also the components passed as route elements to the `HashRouter`. All the other components are stored in `/src/components/ComponentName/` folders, each one having its own `ComponentName.jsx` and `ComponentName.module.css` files.

All the routes are wrapped with a `AnimatedRoutes` component that intercepts the changes in the URL and runs the fading in and out of the entering and exiting page components. The `Navbar` component is placed outside the routes, since it will be visualized in every page of the website.

Here is a brief overview of the components present in each page:
- **Home**: does not use other components as of now.
- **Not found**: just like Home, the functionality is implemented all in one component.
- **Gallery**:
  - The hero section of the page is built and animated in its own `GalleryHero` component to avoid cluttering `Gallery`, since the hero does not require any particular state.
  - The `ViewModeSwitcher` component handles the changes to the state that controls the conditional rendering between the `MasonryLayout` and `ListLayout` components, which are responsible for displaying the two modes of visualization of the pictures.
  - The `ErrorScreen` component will be shown if the list of pictures recorded in the `pictures` state of the `useUnsplashPics` hook is empty, usually when internet connection is not available.
  - The `LoadMoreButton` that allows the user to request the next page of images and the `ScrollToTopButton` to go back to the hero section are their own stateless components.
- **Details**:
  - The structure of the page is directly layed down in this component, while the side scroller is implemented in a separate `PictureScroller`, given its level of complexity.
  - The `LoadingScreen` component will be displayed while the details of the image are still being retrieved.
  - Users will be redirected to `NotFound` if the result of the request for details through the `getDetails` is null.
- **About**:
  - Includes the `Footer` component, which for now is only used in this page, but is self-contained and can be used elsewhere.

The components that have not been mentioned yet do not include any functionality and are purely for aesthetics:
- `FloatingPicture`: used in the `ListLayout` component to display and animate the hovered image.
- `PlusMarker`: the cross icon used in both the gallery and footer.
- `Spinner`: the loading animation displayed in `LoadingScreen`.
- `HoveredAnimatedText`: implements the hover animation that is seen in the navbar's links.
- `Picture`: displays a [BlurHash](https://blurha.sh/) while waiting for the specified image to load. The blurhash string for each image is provided by the API. The decoding of the string into the blurry gradient is handled by the `react-blurhash` package.

### Animations
To animate the website, GSAP is the library of choice. GSAP is a framework-agnostic JavaScript library that uses an imperative programming style, which is not native to React but can be facilitated through the use of refs. There are alternatives better suited specifically for React, Framer Motion in particular. However, GSAP offers greater flexibility and customization and is more widely adopted.

Briefly explained, GSAP allows access to DOM elements through their refs to then specify which CSS properties to change and which values to animate them towards/from, or directly set to. In particular, the `ScrollTrigger` plugin allows to trigger animations and sync changes to CSS properties with the scroll of the page. This is how the `GalleryHero` is implemented.

A more complex use of animations is found in `NotFound` and `FloatingImage`: the mouse following effect of both the picture and the clouds. JavaScript has a special function called `requestAnimationFrame`, which allows us to register a callback function that will run before every repaint of the viewport (usually matching display refresh rate). This enables the following logic, used in the two components just mentioned:
1. Through `useRef`, create two objects: the first one will hold the pixel coordinates of the mouse moving inside the window, the second one will hold the pixel coordinates of the element being animated.
2. Using a `useEffect` hook with no dependencies, we can register a `mousemove` event handler that stores the mouse X and Y coordinates into the first ref.
3. In the same `useEffect` hook, we can invoke a custom `animate` function. Inside this function, we can:
   - Use a linear interpolation function to update the ref coordinates of the object that is being animated towards the coordinates of the mouse
   - Set the X and Y coordinates of the element through GSAP using the interpolated coordinates
   - Recursively call the animate function again before the next repaint through `requestAnimationFrame(animate)`.

The resulting effect is that the object (picture, cloud) is smoothly moved, frame by frame by a percentage determined by the linear interpolation, towards the position of the mouse, that is constantly being updated as the user moves it. This is all done without interfering with React's lifecycle, which means that no re-render will be triggered, making this a performant implementation of this type of animation.

The same principles apply for the `PictureScroller` component, with the differences being that the event capturing user input is the `wheel` event, and the property that is being animated is the Y position of the container of the images, or the X position on mobile.

## 🚀 Deployment 
Memoria is deployed through [Vercel](https://www.vercel.com). The service is free (with limitations), directly links to this Github repository and will run the deployment pipeline every time a new commit is pushed to the main branch. Right now, the only command that needs to be launched is `npm run build`, to create the bundle that will be sent back to clients that try to access the website. Vercel also handles environment variables: the API key for Unsplash is set directly inside the project's dashboard.

## 🚧 Future plans
The website already includes the main functionalities intended for users, but is not complete as per the Figma design that was originally made.

One of the main ideas that was later discarded due to time constraints was using the Three.js library to introduce some 3D elements in the website, in particular a 3D interactable polaroid in the details page, whose content would dynamically change based on the selected image. I still plan on experimenting with it.

The original design also included a proper landing page with a brief scroll-based animated storyline about the relationship between photography and memories. It would still be great to implement it to get more familiar with GSAP.

There is room to optimize the images for better performance, and it would be appropriate to add an introductory loading animation to prevent the FOUC (Flash of Unstyled Content) that occurs when the website first loads. The `PictureScroller` component could also use some polishing to make it feel snappier and more responsive to user input.
