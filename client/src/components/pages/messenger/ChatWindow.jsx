import InputMessages from "../../common/InputMessages";
import MessageBubble from "./MessageBubble";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../../utility/config";

function ChatWindow({
  register,
  name,
  placeholder,
  required,
  error,
  handleSubmit,
  onSubmit,
  messages,
  receiver,
  onMessageSeen,
  handleRetryClick,
  sendUpdateRequest,
  scrollBottomTrig,
  messageDiv,
  messageLoading,
  setBtnIsDisabled,
  btnIsDisabled,
  deleteMessage,
  dropdownStates,
  toggleDropdown,
}) {
  useEffect(() => {
    messageDiv.current.scrollTo(0, messageDiv.current.scrollHeight);
  }, [scrollBottomTrig]);

  const tok = localStorage.getItem("currentUser");
  const token = JSON.parse(tok)?.token;
  const decode = tok ? jwtDecode(token) : null;

  const userName = receiver?.name?.find(
    (item) => item != decode.firstName + " " + decode.lastName
  );

  const userImage = Object.keys(receiver.image).find(
    (item) => item != decode.email.replaceAll(".", "")
  );
  const userImg = receiver.image[userImage];

  const handleScroll = () => {
    const scrollTop = messageDiv.current.scrollTop;
    if (scrollTop === 0) {
      sendUpdateRequest();
    }
  };

  return (
    <div className="chat-window h-100 position-relative">
      <div className="header d-flex align-items-center justify-content-start">
        <div className="image">
          <img src={BASE_URL + "/" + userImg} />
        </div>
        <div className="content  cursor-pointer">
          <span>{userName}</span>
        </div>
      </div>
      <div className="messages-body" ref={messageDiv} onScroll={handleScroll}>
        {messageLoading && (
          <div className="loading">
            <span>Loading...</span>
          </div>
        )}
        {messages?.docs?.map(
          (item, i) =>
            item.chatId === receiver?.id && (
              <MessageBubble
                key={i}
                index={i}
                id={item._id}
                message={item.message}
                messageId={item.messageId}
                time={item.time}
                type={item.sender == decode?.email ? "self" : "notself"}
                status={item.status}
                chatId={item.chatId}
                receiverChatId={receiver?.id}
                senderId={item.senderId}
                success={item.success}
                onMessageSeen={onMessageSeen}
                handleRetryClick={handleRetryClick}
                deleteMessage={deleteMessage}
                dropdownStates={dropdownStates}
                toggleDropdown={toggleDropdown}
              />
            )
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="message-input d-flex align-items-center justify-content-between px-4 py-1">
          <InputMessages
            register={register}
            name={name}
            placeholder={placeholder}
            required={required}
            error={error}
            setBtnIsDisabled={setBtnIsDisabled}
          />
          <button
            className={`fa-solid fa-location-arrow ms-3 submit-btn ${
              btnIsDisabled && "disable"
            }`}
          ></button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
