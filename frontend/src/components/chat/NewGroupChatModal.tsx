import { useFriendStore } from "@/stores/useFriendStore";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { User, UserPlus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Friend } from "@/types/user";
import InviteSuggestionList from "../newGroupChat/InviteSuggestionList";
import SelectedUsersList from "../newGroupChat/SelectedUsersList";
import { toast } from "sonner";
import { useChatStore } from "@/stores/useChatStore";


const NewGroupChatModal = () => {
    const [groupName, setGroupName] = useState("");
    const [search, setSearch] = useState("");
    const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
    const {friends, getFriends} = useFriendStore();
    const {loading, createConversation} = useChatStore();

    const handleGetFriends = async () => {
        await getFriends();
    };

    const handleSelectFriend = (friend: Friend)  => {
        setInvitedUsers([...invitedUsers, friend]);
        setSearch("");
    };

    const handleRemoveFriend = (friend: Friend) => {
        setInvitedUsers(invitedUsers.filter((u) => u._id !== friend._id));
    };

    const handleSubmit =  async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if(invitedUsers.length === 0) {
                toast.warning("Please select at least one user to invite.");
                return;
            }

            await createConversation(
                "group",
                groupName,
                invitedUsers.map((user) => user._id)
            );

            setSearch("");
            setInvitedUsers([]);
            setGroupName("");
        } catch (error) {
            console.error("Error creating group conversation: ", error);
        }
    }

    const filterFriends = friends.filter((friend) => 
        friend.displayName.toLowerCase().includes(search.toLowerCase())
        && !invitedUsers.some((u) => u._id === friend._id)
    );

    return (
        <Dialog>
            <DialogTrigger>
                <Button
                variant="ghost"
                onClick={handleGetFriends}
                className="flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent transition cursor-pointer">
                    <User className="size-4"/>
                    <span className="sr-only">Create group conversation</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] border-none">
                <DialogHeader>
                    <DialogTitle className="capitalize">create new group chat</DialogTitle>
                </DialogHeader>

                <form className="space-y-4"
                onSubmit={handleSubmit}>
                    {/* Group name */}
                    <div className="space-y-2">
                        <Label
                        htmlFor="groupName"
                        className="text-sm font-semibold">
                            Group name
                        </Label>
                        <Input
                        id="groupName"
                        placeholder="Enter group name..."
                        className="glass border-border/50 focus:border:primary/50 transition-smooth"
                        onChange={(e) => setGroupName(e.target.value)}
                        required/>
                    </div>

                    {/* Members for group */}
                    <div className="space-y-2">
                        <Label
                        htmlFor="invite"
                        className="text-sm font-semibold">
                            Invite member
                        </Label>
                        <Input
                        id="invite"
                        placeholder="Find the user's name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}/>

                        {/* Suggestion list */}
                        {search && filterFriends.length>0 && (
                            <InviteSuggestionList 
                            filteredFriends={filterFriends}
                            onSelect={handleSelectFriend}/>
                        )}

                        {/* Invited users list */}
                        <SelectedUsersList 
                        invitedUsers={invitedUsers}
                        onRemove={handleRemoveFriend}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth">
                            {
                                loading ? (
                                    <span>"Creating..."</span>
                                ) : (
                                    <UserPlus className="size-4 mr-2"/>
                                )
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
};

export default NewGroupChatModal;