# Gallery media

Add genuine photos and video files to this directory, then add entries to `js/gallery-data.js`. The catalogue is empty because no actual media was supplied. Do not publish test fixtures as institute photographs.

```js
window.STENO_GALLERY = [
  {
    type: "photo",
    src: "assets/gallery/your-photo.jpg",
    title: "Your factual title",
    alt: "Describe the actual photo",
    description: "Optional description",
    category: "campus"
  },
  {
    type: "video",
    src: "assets/gallery/your-video.mp4",
    poster: "assets/gallery/your-video-poster.jpg",
    captions: "assets/gallery/your-video-captions.vtt",
    title: "Your factual video title",
    description: "Optional description",
    category: "functions"
  }
];
```

Categories: campus, awards, functions, placements, tutorials. Video formats: MP4, WebM, Ogg/OGV. Use web-compatible codecs and provide captions for spoken audio; poster/captions are optional fields. Paths are relative to gallery.html. Remote HTTP(S) media is supported when the host permits it, but use HTTPS for production. YouTube watch pages are not video-file URLs: use the existing YouTube channel link for those videos.

Images load lazily. Videos load only when opened and never autoplay. Escape closes the viewer, arrow keys or Previous/Next switch items, and closing returns keyboard focus to the originating card.

Existing sm_student_corner browser records with an image or video URL are also displayed (descriptions with no media are skipped). Browser-local changes are visible only on that browser/origin. To publish for every visitor, edit this catalogue and deploy the media files. No upload/backend service is implied.
