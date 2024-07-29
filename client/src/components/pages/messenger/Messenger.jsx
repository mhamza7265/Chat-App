import { Input } from "@chakra-ui/react";
import photoPlaceholder from "../../../assets/images/user-placeholder.jpg";
import ChatItem from "./ChatItem";
import { useForm } from "react-hook-form";

function Messenger() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  return (
    <div className="container h-100 p-0">
      <div className="chat h-100">
        <div className="d-flex h-100">
          <div className="chat-list">
            <div className="header d-flex align-items-center justify-content-between">
              <div className="image">
                <img src={photoPlaceholder} />
              </div>
              <i className="fa-regular fa-square-plus cursor-pointer"></i>
            </div>
            {/* <div className="search"></div> */}
            <div className="list">
              <h5 className="text-center" style={{ padding: "20px 0" }}>
                CHATS
              </h5>
              <ChatItem image={photoPlaceholder} name={"Lorem Ipsum 1"} />
              <ChatItem image={photoPlaceholder} name={"Lorem Ipsum 2"} />
              <ChatItem image={photoPlaceholder} name={"Lorem Ipsum 3"} />
              <ChatItem image={photoPlaceholder} name={"Lorem Ipsum 4"} />
            </div>
          </div>
          <div className="chat-detail">
            <div className="chat-window h-100 position-relative">
              <div className="header d-flex align-items-center justify-content-start">
                <div className="image">
                  <img src={photoPlaceholder} />
                </div>
                <div className="content  cursor-pointer">
                  <span>Lorem Ipsum</span>
                </div>
              </div>
              <div className="message-input d-flex align-items-center justify-content-between px-4 py-3">
                <Input
                  register={register}
                  name="message"
                  placeholder="Type your message"
                  required={true}
                  error={errors}
                />
                <i className="fa-solid fa-location-arrow ms-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messenger;
