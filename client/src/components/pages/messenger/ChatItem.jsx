function ChatItem({ image, name }) {
  return (
    <div className="chat-individual">
      <div className="image cursor-pointer">
        <img src={image} />
      </div>
      <div className="content cursor-pointer">
        <span>{name}</span>
      </div>
    </div>
  );
}

export default ChatItem;
