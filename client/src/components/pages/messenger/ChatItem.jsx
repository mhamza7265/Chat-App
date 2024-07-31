import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../../utility/config";

function ChatItem({
  image,
  name,
  id,
  users,
  userIds,
  handleChatClick,
  receiver,
}) {
  const tok = localStorage.getItem("currentUser");
  const token = JSON.parse(tok)?.token;
  const decode = tok ? jwtDecode(token) : null;
  const email = users?.filter((item) => item != decode.email)[0];
  const userName = name?.find(
    (item) => item != decode?.firstName + " " + decode?.lastName
  );
  const userImage = Object.keys(image).find(
    (item) => item != decode.email.replaceAll(".", "")
  );
  const userImg = image[userImage];
  const userId = userIds?.filter((item) => item != decode.id)[0];
  const handleClick = () => {
    handleChatClick({ image, name, email, id, userId });
  };

  return (
    <div
      className={`chat-individual ${
        receiver?.email == email ? "selected" : "inactive"
      }`}
      data-id={id}
      onClick={handleClick}
    >
      <div className="image cursor-pointer">
        <img src={BASE_URL + "/" + userImg} />
      </div>
      <div className="content cursor-pointer">
        <span>{userName}</span>
      </div>
    </div>
  );
}

export default ChatItem;
