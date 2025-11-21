// app/api/hackernews/route.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching top HackerNews stories...');

    // 1. Fetch top story IDs
    const topStoriesRes = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );

    if (!topStoriesRes.ok) {
      throw new Error('Failed to fetch top stories');
    }

    const topStoryIds = await topStoriesRes.json();
    
    // Get top 5 story IDs
    const top5Ids = topStoryIds.slice(0, 5);

    console.log(`Fetching details for ${top5Ids.length} stories...`);

    // 2. Fetch details for each story
    const storyPromises = top5Ids.map(async (id) => {
      const storyRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      
      if (!storyRes.ok) {
        console.warn(`Failed to fetch story ${id}`);
        return null;
      }
      
      return storyRes.json();
    });

    const stories = await Promise.all(storyPromises);
    
    // Filter out any null values (failed requests)
    const validStories = stories.filter(story => story !== null);

    // 3. Format the response
    const formattedStories = validStories.map(story => ({
      id: story.id,
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      score: story.score || 0,
      time: story.time, // Unix timestamp
      timeFormatted: new Date(story.time * 1000).toLocaleString(),
      type: story.type,
      by: story.by || 'Unknown'
    }));

    console.log(`Successfully fetched ${formattedStories.length} stories`);

    // 4. Send success response
    return res.status(200).json({
      success: true,
      data: formattedStories,
      count: formattedStories.length
    });

  } catch (error) {
    console.error('HackerNews API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch HackerNews stories',
      details: error.message
    });
  }
});

module.exports = router;