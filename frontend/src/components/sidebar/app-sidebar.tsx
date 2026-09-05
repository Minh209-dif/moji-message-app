import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import CreateNewChat from "../chat/CreateNewChat";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/stores/useAuthStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {isDark, toggleTheme} = useThemeStore();
  const {user} = useAuthStore();


  return (
    <Sidebar variant="inset" {...props}>

      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="bg-gradient-primary">
              <a href="#" className="block w-full">
                <div className="flex w-full items-center justify-between px-2">
                  <h1 className="text-xl font-bold text-white">Moji</h1>
                  <div className="flex items-center gap-2">
                    <Sun className="size-4 text-white/80"/>
                    <Switch 
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-background/80"/>
                    <Moon className="size-4 text-white/80"/>
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      {/* Content */}
      <SidebarContent className="beautiful-scrollbar">
        {/*  New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat/>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group chat */}
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="uppercase">Group Chat</SidebarGroupLabel>
            <NewGroupChatModal/>
          </div>
          <SidebarGroupContent>
            <GroupChatList/>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct message */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Friends</SidebarGroupLabel>
          <SidebarGroupAction title="Add friend" className="cursor-pointer">
            {/* Add friend modal */}
            <AddFriendModal/> 
          </SidebarGroupAction>
          <SidebarGroupContent>
            {/* Direct message list */}
            <DirectMessageList/>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
