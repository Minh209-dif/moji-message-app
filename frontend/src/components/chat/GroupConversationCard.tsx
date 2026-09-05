import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import UnreadCountBadge from "./UnreadCountBadge";
import GroupChatAvatar from "./GroupChatAvatar";

const GroupConversationCard = ({convo}: {convo:Conversation}) => {
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, messages} = useChatStore();

    if(!user) return;

    const unreadCount = convo.unreadCounts[user._id];
    const name = convo.group?.name ?? "";
    const handleSelectConversation = async(id: string) => {
        setActiveConversation(id);
        if(!messages[id]){
            await useChatStore.getState().fetchMessages(id);
        }
    }
    
    return (<ChatCard 
        convoId={convo._id}
        name={name}
        timestamp={
            convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined
        }
        isActive={activeConversationId === convo._id}
        onSelect={handleSelectConversation}
        leftSection={<>
            {unreadCount>0 && <UnreadCountBadge unreadCount={unreadCount}/>}
            <GroupChatAvatar 
                participants={convo.participants}
                type="chat"
            />
        </>}
        subtitle={
            <p className="text-sm truncate text-muted-foreground">
                {convo.participants.length} members
            </p>     
        }/>)
}

export default GroupConversationCard;