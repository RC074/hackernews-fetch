import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import Comment from "./Comment";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  url: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(1),
  },
  comment: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  info: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
}));

const Story = ({ story }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [storyDetails, setStoryDetails] = useState({});
  const [articleContent, setArticleContent] = useState("");

  useEffect(() => {
    fetchStoryDetails();
  }, []);

  useEffect(() => {
    if (expanded) {
      fetchArticleContent();
    }
  }, [expanded]);

  const fetchStoryDetails = async () => {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${story.id}.json`
      );
      const storyData = await response.json();
      console.log(storyData);
      setStoryDetails(storyData);
    } catch (error) {
      console.error("Error fetching story details:", error);
    }
  };

  const fetchArticleContent = async () => {
    try {
      const response = await fetch(story.url);
      const htmlContent = await response.text();
      setArticleContent(htmlContent);
    } catch (error) {
      console.error("Error fetching article content:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${story.id}.json`
      );
      const storyData = await response.json();
      if (storyData.kids) {
        const commentsData = await Promise.all(
          storyData.kids.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              (response) => response.json()
            )
          )
        );
        const commentsWithLevels = addCommentLevels(commentsData);
        setComments(commentsWithLevels);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addCommentLevels = (commentsData, level = 0) => {
    return commentsData.map((comment) => {
      if (comment) {
        return {
          ...comment,
          level,
          replies: comment.kids
            ? addCommentLevels(
                comment.kids.map((id) => commentsData.find((c) => c.id === id)),
                level + 1
              )
            : [],
        };
      } else {
        return { ...comment, level, replies: [] };
      }
    });
  };

  const toggleExpanded = () => {
    if (!expanded) {
      fetchComments();
    }
    setExpanded(!expanded);
  };

  const toggleCommentsExpanded = () => {
    if (!commentsExpanded) {
      fetchComments();
    }
    setCommentsExpanded(!commentsExpanded);
  };

  const getTimeSincePost = (time) => {
    const milliseconds = Date.now() - time * 1000;
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          {story.title}
        </Typography>
        <div className={classes.info}>
          {`${storyDetails.score} points by ${
            storyDetails.by
          } ${getTimeSincePost(storyDetails.time)} | ${
            storyDetails.descendants
          } comments`}
        </div>
        <Typography variant="body1" className={classes.url}>
          {story.url}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={toggleExpanded}
        >
          {expanded ? "Collapse Article" : "Expand Article"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleCommentsExpanded}
        >
          {commentsExpanded ? "Collapse Comments" : "Expand Comments"}
        </Button>
        {expanded && (
          <div className={classes.content}>
            <div dangerouslySetInnerHTML={{ __html: articleContent }}></div>
          </div>
        )}
        {commentsExpanded && (
          <div>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Story;
