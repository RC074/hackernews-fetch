import React, { useState, useEffect } from 'react';
import Story from './Story';

const StoriesContainer = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = await response.json();
      const storiesData = await Promise.all(
        storyIds.slice(0, 10).map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json())
        )
      );
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  return (
    <div>
      {stories.map(story => (
        <Story key={story.id} story={story} />
      ))}
    </div>
  );
};

export default StoriesContainer;
