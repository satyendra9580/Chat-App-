import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2  transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#9d9b9b] hover:bg-[#757373]"
              : "hover:bg-[#f1f1f111] "
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 ">
                {contact.image && (
                  <AvatarImage
                    src={contact.image}
                    alt="profile"
                    className="rounded-full bg-cover h-full w-full"
                  />
                )}

                <AvatarFallback
                  className={`uppercase  ${
                    selectedChatData && selectedChatData._id === contact._id
                      ? "bg-[#ffffff22]  border border-[#19191f]"
                      : getColor(contact.color)
                  } h-10 w-10 flex items-center justify-center  rounded-full`}
                >
                  <span className={`${selectedChatData && selectedChatData._id === contact._id ?"text-[#19191f]":""}`}>
                  {contact.firstName.split("").shift()}
                  </span>
                </AvatarFallback>
              </Avatar>
            )}
            {isChannel && (
              <div
                className={` bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full`}
              >
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span className={`${selectedChatData && selectedChatData._id === contact._id ?"text-[#19191f]":""}`}>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
