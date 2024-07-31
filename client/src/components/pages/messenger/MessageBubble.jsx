import { useEffect, useState, useRef } from "react";
import React from "react";

const MessageBubble = React.memo(
  ({
    message,
    id,
    time,
    status,
    type,
    chatId,
    messageId,
    receiverChatId,
    senderId,
    success,
    onMessageSeen,
    handleRetryClick,
    deleteMessage,
    // index,
    // dropdownStates,
    // toggleDropdown,
  }) => {
    const [seen, setSeen] = useState(!status == "read" && false);
    const [msgOptionsDropdownIsOpen, setMsgOptionsDropdownIsOpen] =
      useState(false);
    const messageRef = useRef();
    const timeString = new Date(time).toLocaleTimeString("en", {
      timeStyle: "short",
      hour12: true,
      timeZone: "Asia/Karachi",
    });

    const handleMsgRetryClick = () => {
      handleRetryClick({ message, messageId, chatId, senderId });
    };

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !seen && type != "self") {
            setSeen(true);
            onMessageSeen({ messageId, senderId });
            observer.unobserve(messageRef.current);
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(messageRef.current);
    }, [messageId, seen, onMessageSeen]);

    const dltMsg = () => {
      deleteMessage({ messageId });
      setMsgOptionsDropdownIsOpen(false);
    };

    return (
      <>
        <div
          className={`message ${type} ${
            !success && "failed"
          } position-relative`}
          data-id={id}
          data-chatid={chatId}
          data-receiver-chatid={receiverChatId}
          data-messageid={messageId}
          id={messageId}
          ref={messageRef}
        >
          {type == "self" && (
            <>
              <div
                className="message-options cursor-pointer"
                onClick={() =>
                  setMsgOptionsDropdownIsOpen(!msgOptionsDropdownIsOpen)
                }
              >
                <i className="fas fa-angle-down"></i>
              </div>
              {msgOptionsDropdownIsOpen && (
                <div className="messages-options-dropdown">
                  <p className="cursor-pointer" onClick={dltMsg}>
                    Delete
                  </p>
                </div>
              )}
            </>
          )}
          <p className="message-text" style={{ color: "#000" }}>
            {message}
          </p>
          <div className="detail">
            <span className="message-time me-2">{timeString}</span>
            {type == "self" &&
              (status == "read" ? (
                <i
                  className="fa-solid fa-check-double"
                  style={{ color: "blue" }}
                ></i>
              ) : status == "unread" ? (
                <i className="fa-solid fa-check-double"></i>
              ) : (
                status == "undelivered" && (
                  <i className="fa-regular fa-clock"></i>
                )
              ))}
          </div>
          {!success && (
            <span className="retry" onClick={handleMsgRetryClick}>
              Retry
            </span>
          )}
        </div>
      </>
    );
  }
);

MessageBubble.displayName = "MessageBubble";
export default MessageBubble;
