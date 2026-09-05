import { useChatStore } from "@/stores/useChatStore";
import DirectMessageCard from "./DirectMessageCard";

const DirectMessageList = () => {
    const { conversations, convoLoading } = useChatStore();

    if(!conversations) return;

    const directConversations = conversations.filter((convo) => convo.type === 'direct');

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {convoLoading ? (
                <p className="px-2 text-sm text-muted-foreground">Loading conversations...</p>
            ) : null}
            {directConversations.length === 0 ? (
                <p className="px-2 text-sm text-muted-foreground">No direct conversations available.</p>
            ) : null}
            {directConversations.map((convo) => (
                <DirectMessageCard key={convo._id} convo={convo} />
            ))}
        </div>
    );
};

export default DirectMessageList;