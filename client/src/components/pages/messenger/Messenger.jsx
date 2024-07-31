import photoPlaceholder from "../../../assets/images/user-placeholder.jpg";
import ChatItem from "./ChatItem";
import { useForm } from "react-hook-form";
import ChatWindow from "./ChatWindow";
import { useEffect, useState, useRef } from "react";
import sendRequest from "../../../utility/apiManager";
import { errorToast } from "../../../utility/toast";
import { BASE_URL } from "../../../utility/config";
import { Modal } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import socketClient from "socket.io-client";
const tok = localStorage.getItem("currentUser");
const token = JSON.parse(tok)?.token;
const decode = tok ? jwtDecode(token) : null;

function Messenger() {
  const [messages, setMessages] = useState({ docs: [] });
  const [receiver, setReceiver] = useState(null);
  const [chatwindowIsActive, setChatWindowIsActive] = useState(false);
  const [usersList, setUsersList] = useState(null);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [chatsList, setChatsList] = useState(null);
  const [newChatModalIsOpen, setNewChatModalIsOpen] = useState(false);
  const [scrollBottomTrig, setScrollBottomTrig] = useState(null);
  const [scrollHoldUpdate, setScrollHoldUpdate] = useState(null);
  const [messageLoading, setMessageLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [btnIsDisabled, setBtnIsDisabled] = useState(true);
  const [dropdownStates, setDropdownStates] = useState(Array(9).fill(false));
  const messageDiv = useRef();
  const prevScrollHeightRef = useRef();
  const socket = socketClient("http://localhost:3000", {
    query: {
      token: token,
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    sendRequest("get", "profile").then((res) => {
      if (res.status) {
        setProfile(res.user);
      }
    });
  }, []);

  useEffect(() => {
    socket.emit("add_user", decode?.id);
    socket.on("connection", () => {
      console.log("connected socket");
    });
  }, [socket]);

  useEffect(() => {
    socket.on("receiveMsg", (data) => {
      if (data.success) {
        setMessages((prevMessages) => {
          return {
            ...prevMessages,
            docs: prevMessages.docs.concat(data),
          };
        });
        setScrollBottomTrig(Math.random());
      }
    });

    return () => socket.off("receiveMsg");
  }, [socket]);

  useEffect(() => {
    socket.on("chatsList", (data) => {
      if (data.status) {
        console.log("chat res", data.chats);
        setChatsList(data.chats);
      }
    });
  }, [socket]);

  socket.on("deleteMsgRes", (data) => {
    console.log("deleteReceived");
    const messagesList = messages?.docs?.filter(
      (item) => item.messageId !== data.messageId
    );
    setMessages((prevMessages) => {
      return {
        ...prevMessages,
        docs: messagesList,
      };
    });
  });

  useEffect(() => {
    socket.on("getMessages", (data) => {
      if (data) {
        setMessages(() => data.messages);
        setScrollBottomTrig(Math.random());
      }
      socket.off("getMessages");
    });
  }, [messages]);

  const onMessageSeen = (data) => {
    socket.emit("msgRead", {
      senderId: data.senderId,
      messageId: data.messageId,
      chatId: receiver?.id,
    });
  };

  useEffect(() => {
    socket.emit("getChats");
    socket.on("chatsList", (data) => {
      if (data.status) {
        setChatsList(data.chats);
      }
    });
  }, []);

  const handleChatClick = (data) => {
    socket.emit("getMessages", { chatId: data.id });
    socket.on("getMsgs", (messages) => {
      if (messages.status) {
        setMessages(messages.messages);
        setChatWindowIsActive(true);
        setScrollBottomTrig(Math.random());
      } else {
        console.log("messagesErr", messages.error);
      }
    });
    setReceiver(data);
  };

  const onSubmit = (data) => {
    const randomId = `msg-${Math.floor(Math.random() * 99999999)}`;
    socket.emit("send_msg", {
      receiver: receiver?.userId,
      chatId: receiver?.id,
      sender: decode?.id,
      message: data.newMessage,
      messageId: randomId,
    });

    socket.on("checkMsgDelivered", (dta) => {
      setMessages({
        ...messages,
        docs: [
          ...messages.docs,
          {
            message: data.newMessage,
            time: new Date().toISOString(),
            status:
              dta.response.message && dta.response.status
                ? "unread"
                : "undelivered",
            chatId: receiver?.id,
            messageId: randomId,
            sender: decode.email,
            success: dta.response.status ? true : false,
          },
        ],
      });
      setScrollBottomTrig(Math.random());
      socket.off("checkMsgDelivered");
    });

    socket.on("msgFailure", (data) => {
      const msg = messages.find((item) => item.messageId == data.messageId);
      console.log("msgFailure", msg);
      // setMessages([...messages]);
    });

    reset();
    setBtnIsDisabled(true);
  };

  const handleRetryClick = (data) => {
    const filtered = messages.docs.filter(
      (item) => item.messageId !== data.messageId
    );
    const randomId = `msg-${Math.floor(Math.random() * 99999999)}`;
    socket.emit("send_msg", {
      receiver: receiver?.userId,
      chatId: receiver?.id,
      sender: decode?.id,
      message: data.message,
      messageId: randomId,
    });

    socket.on("checkMsgDelivered", (dta) => {
      console.log("dta", dta);
      setMessages({
        ...messages,
        docs: [
          ...filtered,
          {
            message: data.message,
            time: new Date().toISOString(),
            status:
              dta.response.message && dta.response.status
                ? "unread"
                : "undelivered",
            chatId: receiver?.id,
            messageId: randomId,
            sender: decode.email,
            success: dta.response.status ? true : false,
          },
        ],
      });
      setScrollBottomTrig(Math.random());
    });
  };

  const handleNewMessageClick = () => {
    if (!dropdownIsOpen) {
      socket.emit("getUsersRequest", { page: 1 });
      socket.on("getUsers", (data) => {
        if (data.status) {
          console.log("data.users", data.users);
          setUsersList(data.users);
          setDropdownIsOpen(true);
        } else {
          console.log("err", data.error);
        }
      });
    } else {
      setDropdownIsOpen(false);
    }
  };

  const handleUserClick = (e) => {
    const obj = {
      image: e.currentTarget.getAttribute("data-image"),
      name: e.currentTarget.getAttribute("data-name"),
      email: e.currentTarget.getAttribute("data-email"),
      userId: e.currentTarget.getAttribute("data-userid"),
    };

    socket.emit("addChat", {
      receiver: obj.email,
      name: obj.name,
      image1: profile?.image ?? photoPlaceholder,
      image2: obj.image,
      userId: obj.userId,
    });

    socket.on("chatAdded", (data) => {
      if (data.status) {
        socket.emit("getChats");
        socket.on("chatsList", (data) => {
          if (data.status) {
            console.log("chat res", data.chats);
            setChatsList(data.chats);
          }
        });
        socket.emit("getSingleChat", { receiver: obj.email });
        socket.on("singleChat", (data) => {
          if (data.status) {
            obj["id"] = data?.user?._id;
            obj["name"] = [obj.name];
            obj["image"] = { [obj.email]: obj.image };

            socket.emit("getMessages", { chatId: data?.user?._id });
            socket.on("getMsgs", (messages) => {
              if (messages.status) {
                setMessages(messages.messages);
                setReceiver(obj);
                setChatWindowIsActive(true);
                setNewChatModalIsOpen(false);
                setScrollBottomTrig(Math.random());
              } else {
                console.log("messagesErr", messages.error);
              }
              socket.off("getMsgs");
            });
          }
        });
      }
    });
  };

  const deleteMessage = (data) => {
    if (confirm("Do you want to delete this message?")) {
      socket.emit("deleteMsg", {
        messageId: data.messageId,
        receiver: receiver?.userId,
      });
    }
    return;
  };

  const handleContainerClick = (e) => {
    const node = e.target.classList;
    const classNames = [
      "users-dropdown",
      "users-dropdown-ul",
      "users-dropdown-li",
      "users-dropdown-img",
      "users-dropdown-text",
      "users-dropdown-div",
      "users-dropdown-email",
      "dropdown-btn",
      "dropdown-btn-div",
    ];
    if (!classNames.some((className) => node.contains(className))) {
      setDropdownIsOpen(false);
    }
  };

  const handleLoadMoreUsersClick = () => {
    socket.emit("getUsersRequest", { page: usersList.page + 1 });
    socket.on("getUsers", (data) => {
      if (data.status) {
        setUsersList({
          ...data.users,
          docs: usersList.docs.concat(data.users.docs),
        });
      } else {
        errorToast(data.error);
        console.log("err", data.error);
      }
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value != "") {
      socket.emit("getSearchedUserRequest", { email: value });
      socket.on("getSearchedUsers", (data) => {
        if (data.status) {
          setUsersList({ ...usersList, docs: data.user });
        } else {
          console.log("err", data.error);
        }
      });
    } else {
      socket.emit("getUsersRequest", { page: 1 });
      socket.on("getUsers", (data) => {
        if (data.status) {
          setUsersList(data.users);
        } else {
          console.log("err", data.error);
        }
      });
    }
  };

  useEffect(() => {
    const newContentHeight =
      messageDiv?.current?.scrollHeight - prevScrollHeightRef.current;
    messageDiv?.current?.scrollBy(0, newContentHeight);
  }, [scrollHoldUpdate]);

  const sendUpdateRequest = () => {
    prevScrollHeightRef.current = messageDiv?.current?.scrollHeight;

    if (messages.hasNextPage && Object.keys(messages).length > 0) {
      setMessageLoading(true);
      socket.emit("getMoreMessages", {
        page: messages.page + 1,
        chatId: receiver?.id,
      });

      socket.on("moreMessages", (data) => {
        setMessages({
          ...data.messages,
          docs: [...data.messages.docs, ...messages.docs],
        });
        setScrollHoldUpdate(Math.random());
        setMessageLoading(false);
      });
    }
  };

  const toggleDropdown = (index) => {
    console.log("index", index);
    console.time("dropDownMap");
    setDropdownStates((prevStates) =>
      prevStates.map((isOpen, i) => (i === index ? !isOpen : false))
    );
    console.timeEnd("dropDownMap");
  };

  return (
    <div
      className="container-fluid chat-container p-0"
      onClick={handleContainerClick}
    >
      <div className="chat h-100">
        <div className="d-flex h-100">
          <div className="chat-list">
            <div className="header d-flex align-items-center justify-content-between position-relative">
              <div className="image">
                <img
                  src={
                    profile?.image
                      ? BASE_URL + "/" + profile.image
                      : photoPlaceholder
                  }
                />
              </div>
              <i
                className="fa-regular fa-square-plus cursor-pointer"
                onClick={handleNewMessageClick}
              ></i>
              {dropdownIsOpen && (
                <div className="users-dropdown py-5">
                  <div className="w-max-content mx-auto mb-4 dropdown-btn-div">
                    <button
                      className="btn btn-sm dropdown-btn"
                      onClick={() => {
                        setDropdownIsOpen(false);
                        setNewChatModalIsOpen(true);
                      }}
                    >
                      New Chat
                    </button>
                  </div>
                  <div className="w-max-content mx-auto dropdown-btn-div">
                    <button className="btn btn-sm disabled dropdown-btn">
                      Create Group
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="search"></div> */}
            <div className="list">
              <h5 className="text-center" style={{ padding: "20px 0" }}>
                CHATS
              </h5>
              {chatsList?.map((item, i) => (
                <ChatItem
                  key={i}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  users={item.users}
                  userIds={item.userIds}
                  handleChatClick={handleChatClick}
                  receiver={receiver}
                />
              ))}
            </div>
          </div>
          <div className="chat-detail">
            {chatwindowIsActive && (
              <ChatWindow
                register={register}
                image={photoPlaceholder}
                name="newMessage"
                placeholder="Type your message"
                required={true}
                error={errors}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                messages={messages}
                reset={reset}
                receiver={receiver}
                onMessageSeen={onMessageSeen}
                handleRetryClick={handleRetryClick}
                sendUpdateRequest={sendUpdateRequest}
                scrollBottomTrig={scrollBottomTrig}
                messageDiv={messageDiv}
                messageLoading={messageLoading}
                setBtnIsDisabled={setBtnIsDisabled}
                btnIsDisabled={btnIsDisabled}
                deleteMessage={deleteMessage}
                toggleDropdown={toggleDropdown}
                dropdownStates={dropdownStates}
              />
            )}
          </div>
        </div>
      </div>
      <>
        <Modal
          size="md"
          className="new-chat"
          centered
          show={newChatModalIsOpen}
          onHide={() => {
            // resetChat();
            setNewChatModalIsOpen(false);
          }}
          style={{ zIndex: "9999", padding: 0 }}
        >
          <Modal.Header
            style={{ borderBottom: "1px solid #d1d7db" }}
            closeButton
          >
            <h5 className="text-center w-100">USERS</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <input
                placeholder="Search user"
                style={{
                  height: "40px",
                  marginBottom: "20px",
                  borderColor: "#aad6ce",
                }}
                onChange={handleSearchChange}
              />
              <div className="users">
                {usersList?.docs?.map((item, i) => (
                  <div
                    className="user-div cursor-pointer"
                    key={i}
                    onClick={handleUserClick}
                    data-email={item.email}
                    data-name={item.firstName + " " + item.lastName}
                    data-image={item.image ?? photoPlaceholder}
                    data-userid={item._id}
                  >
                    <img
                      className="users-dropdown-img"
                      src={
                        item.image
                          ? BASE_URL + "/" + item.image
                          : photoPlaceholder
                      }
                    />
                    <div className="users-dropdown-div ms-5">
                      <h5 className="users-dropdown-text">
                        {item.firstName + " " + item.lastName}
                      </h5>
                      <span className="users-dropdown-email">{item.email}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-max-content mx-auto mt-4 mb-5">
                <button
                  className={`btn btn-sm btn-heading btn-block hover-up mx-auto 
                    ${!usersList?.hasNextPage && "disabled"}
                    `}
                  onClick={handleLoadMoreUsersClick}
                >
                  <i className="fa-solid fa-arrows-rotate"></i> Load More
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}

export default Messenger;
