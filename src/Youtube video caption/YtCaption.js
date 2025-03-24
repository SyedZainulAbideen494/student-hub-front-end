import React, { useState } from "react";
import { YoutubeTranscript } from "youtube-transcript";

const YouTubeCaptionFetcher = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState("");

  // Function to extract YouTube Video ID
  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    return match ? match[1] : null;
  };

  // Fetch Captions Using CORS Proxy
  const fetchCaptions = async () => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    try {
      // Use a free CORS proxy (change if needed)
      const proxyUrl = "https://corsproxy.io/?";
      const transcript = await fetch(
        `${proxyUrl}https://www.youtube.com/watch?v=${videoId}`
      );

      if (!transcript.ok) throw new Error("Failed to fetch transcript");

      const captionsArray = await YoutubeTranscript.fetchTranscript(videoId);
      const captionText = captionsArray.map((item) => item.text).join(" ");
      setCaptions(captionText);
    } catch (error) {
      console.error("Error fetching captions:", error);
      alert("Captions not available for this video!");
    }
  };

  return (
    <div>
      <h2> YouTube Caption Fetcher </h2>
      <input
        type="text"
        placeholder="Paste YouTube link here"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button onClick={fetchCaptions}>Get Captions</button>
      <p>{captions}</p>
    </div>
  );
};

export default YouTubeCaptionFetcher;
