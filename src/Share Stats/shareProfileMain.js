import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import StoryCard from './shareProfile';

const StoryCardMain = () => {


  return (
<StoryCard
  name="Ayaan"
  hours="3.5"
  percentile="92"
  badge="Top 3% - Midnight Hustler"
  profilePic="https://srv594954.hstgr.cloud/1746006602585.jpg"
/>

  );
};

export default StoryCardMain;
