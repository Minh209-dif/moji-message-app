import { useChatStore } from "@/stores/useChatStore";
import GroupConversationCard from "./GroupConversationCard";

const GroupChatList = () => {
    const { conversations, convoLoading } = useChatStore();
    if (!conversations) return;

    const groupConversations = conversations.filter((convo) => convo.type === 'group');

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {convoLoading ? (
                <p className="px-2 text-sm text-muted-foreground">Loading conversations...</p>
            ) : null}
            {groupConversations.length === 0 ? (
                <p className="px-2 text-sm text-muted-foreground">No group conversations available.</p>
            ) : null}
            {groupConversations.map((convo) => (
                <GroupConversationCard key={convo._id} convo={convo} />
            ))}
        </div>
    );
};

export default GroupChatList;