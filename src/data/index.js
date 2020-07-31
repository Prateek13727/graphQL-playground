const videoA = {
  id: "a",
  title: "how to speak like a pro",
  duration: 20, 
  watched: true
}

const videoB = {
  id: "b",
  title: "how to speak like a pro part-2",
  duration: 30, 
  watched: false
}

const videos = [videoA, videoB];

const getVideoById = (id) =>  new Promise((resolve) => {
  console.log(id)
  const [found_video] = videos.filter((video) => {
    return video.id === id
  })
  console.log(found_video)
  resolve(found_video);
})

const getVideos = () => new Promise((resolve) => resolve(videos));

const createVideo = ({ title, duration, released}) => {
  const video = {
    id: (new Buffer(title, 'utf8')).toString('base64'),
    title,
    duration,
    released,
  };

  videos.push(video);

  return video;
};

exports.getVideoById = getVideoById;
exports.getVideos = getVideos;
exports.createVideo = createVideo;