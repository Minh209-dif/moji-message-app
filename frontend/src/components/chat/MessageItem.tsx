import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";


interface MessageItemProps{
    message: Message;
    index: number;
    messages: Message[];
    selectedConvo: Conversation;
    lastMessageStatus: "seen" | "delivered";
}

const MessageItem = ({message, index, messages, selectedConvo, lastMessageStatus}: MessageItemProps) => {
    const prev = index+1 < messages.length ? messages[index+1] : undefined;
    
    const isShowTime = 
        index === messages.length-1 ||
        new Date(message.createdAt).getTime() - 
        new Date(prev?.createdAt || 0).getTime() > 5 * 60 * 1000; // 5 minutes
    const isGroupBreak =
        isShowTime ||
        message.senderId !== prev?.senderId

    const participant = selectedConvo.participants.find(
        (p: Participant) => p._id.toString() === message.senderId.toString()
    );

    return (
        <div className="flex flex-1 flex-col space-y-4">
            {/* Time */}
            {isShowTime && (
                <span className="flex justify-center text-xs text-muted-foreground px-1">
                    {formatMessageTime(new Date(message.createdAt))}
                </span>
            )}


            <div className={cn(" flex gap-2 message-bounce mt-1",
                message.isOwned ? "justify-end" : "justify-start",
            )}>
                {/* Avatar */}
                {!message.isOwned && (
                    <div className="w-8">
                        {isGroupBreak && (
                        <UserAvatar
                                type="chat"
                                name={participant?.displayName ?? ""}
                                avatarUrl={participant?.avatarUrl ?? undefined}/>
                        )}
                    </div>
                )}

                {/* Message content */}
                <div className={cn("max-w-xs lg:max-w-md space-y-1 flex flex-col",
                    message.isOwned ? "items-end" : "items-start"
                )}>
                    <Card className={cn("p-3", message.isOwned ? "chat-bubble-sent border-0" :
                        "chat-bubble-received border-0"
                    )}>
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                    </Card>

                    {/* Seen/ delivered */}
                    {message.isOwned && message._id === selectedConvo.lastMessage?._id && (
                        <Badge variant="outline"
                        className={cn("text-xs px-1.5 py-0.5 h-4 border-0", lastMessageStatus === "seen" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                            {lastMessageStatus}
                        </Badge>
                    )}

                </div>
            </div>
        </div>
    )
}

export default MessageItem;