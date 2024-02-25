import React from "react";

const Comment = ({ comment }) => {
  const renderComment = (comment) => {
    const getTimeSincePost = (time) => {
      const milliseconds = Date.now() - time * 1000;
      const seconds = Math.floor(milliseconds / 1000);
      if (seconds < 60) {
        return `${seconds} seconds ago`;
      }
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minutes ago`;
    };

    return (
      <div
        style={{
          marginLeft: `${comment.level * 20}px`,
          borderLeft: `2px solid #ccc`,
          paddingLeft: "10px",
          marginBottom: "10px",
        }}
      >
        <p dangerouslySetInnerHTML={{ __html: comment.text }} />
        <div style={{ fontSize: "0.8rem", color: "#666" }}>
          {comment.by} - {getTimeSincePost(comment.time)}
        </div>
        {comment.replies &&
          comment.replies.map((reply) => (
            <div key={reply.id}>
              {renderComment(reply)}
            </div>
          ))}
      </div>
    );
  };

  return <div>{renderComment(comment)}</div>;
};

export default Comment;
