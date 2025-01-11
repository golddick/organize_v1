// "use client";


// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useMessage } from "@/store/conversation/messages";
// import React, { useEffect, useRef, useState } from "react";
// import { Message } from "./Message";
// import { DeleteMessage } from "./DeleteMessage";
// import { supabase } from "@/lib/supabase";
// import {
//   RealtimePostgresDeletePayload,
//   RealtimePostgresInsertPayload,
//   RealtimePostgresUpdatePayload,
// } from "@supabase/supabase-js";
// import axios from "axios";
// import { ExtendedMessage } from "@/types/extended";
// import { domain } from "@/lib/api";
// import { ScrollDown } from "./ScrollDown";
// import { LoadMoreMessages } from "./LoadMoreMessages";
// import { MessageSquare } from "lucide-react";
// import { useTranslations } from "next-intl";
// import { LoadingState } from "@/components/loader/loadingState";

// interface Props {
//   workspaceId: string;
//   chatId: string;
//   sessionUserId: string;
// }

// export const MessagesContainer = ({
//   workspaceId,
//   chatId,
//   sessionUserId,
// }: Props) => {
//   // const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
//   const scrollRef = useRef<HTMLDivElement | null>(null);


//   const [userScrolled, setUserScrolled] = useState(false);

//   const {
//     messages,
//     initialMessagesLoading,
//     addMessage,
//     editMessage,
//     deleteMessage,
//     hasMore,
//   } = useMessage((state) => state);

//   useEffect(() => {
//     const scrollContainer = scrollRef.current;
//     if (scrollContainer && !userScrolled) {
//       scrollContainer.scrollTop = scrollContainer.scrollHeight;
//     }
//   }, [messages, userScrolled]);

//   const [notifications, setNotifications] = useState(0);

//   useEffect(() => {
//     const supabaseClient = supabase();

//     const handleAddMessage = async (
//       payload: RealtimePostgresInsertPayload<{
//         [key: string]: any;
//       }>
//     ) => {
//       if (sessionUserId !== payload.new.senderId) {
//         try {
//           const { data, status } = await axios.get<ExtendedMessage>(
//             `${domain}/api/conversation/get/new_message?messageId=${payload.new.id}`
//           );
//           console.log(data);

//           if (data) addMessage(data);

//           const scrollContainer = scrollRef.current;
//           if (
//             scrollContainer.scrollTop <
//             scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
//           ) {
//             setNotifications((current) => current + 1);
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };

//     const handleUpdateMessage = (
//       payload: RealtimePostgresUpdatePayload<{
//         [key: string]: any;
//       }>
//     ) => {
//       if (sessionUserId !== payload.new.senderId) {
//         editMessage(payload.new.id, payload.new.content);
//       }
//     };

//     const handleDeleteMessage = (
//       payload: RealtimePostgresDeletePayload<{
//         [key: string]: any;
//       }>
//     ) => {
//       const messageExists = messages.find(
//         (message) => message.id === payload.old.id
//       );

//       if (messageExists) deleteMessage(payload.old.id);
//     };

//     const channel = supabaseClient
//       .channel(`chat-${chatId}`)
//       .on(
//         `postgres_changes`,
//         { event: "INSERT", schema: "public", table: "Message" },
//         handleAddMessage
//       )
//       .on(
//         `postgres_changes`,
//         { event: "UPDATE", schema: "public", table: "Message" },
//         handleUpdateMessage
//       )
//       .on(
//         `postgres_changes`,
//         { event: "DELETE", schema: "public", table: "Message" },
//         handleDeleteMessage
//       )
//       .subscribe();

//     return () => {
//       channel.unsubscribe();
//     };
//   }, [chatId, messages, sessionUserId]);

//   const handleOnScroll = () => {
//     const scrollContainer = scrollRef.current;
//     if (scrollContainer) {
//       const isScroll =
//         scrollContainer.scrollTop <
//         scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
//       setUserScrolled(isScroll);
//       if (
//         scrollContainer.scrollTop ===
//         scrollContainer.scrollHeight - scrollContainer.clientHeight
//       ) {
//         setNotifications(0);
//       }
//     }
//   };

//   const scrollDown = () => {
//     scrollRef.current.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//     setNotifications(0);
//   };

//   if (initialMessagesLoading) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center">
//         <LoadingState />
//       </div>
//     );
//   }

//   const t = useTranslations("CHAT.NO_MESSAGES");

//   if (messages.length === 0) {
//     return (
//       <div className="flex flex-col gap-2 sm:text-lg font-semibold items-center p-2 justify-center">
//         <MessageSquare className="w-16 h-16 sm:w-28 sm:h-28" />
//         <div className="text-center">
//           <p>{t("FIRST")}</p>
//           <p>{t("SECOND")}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={scrollRef}
//       onScroll={handleOnScroll}
//       className="h-full flex flex-col gap-2 px-4 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background"
//     >
//       {hasMore && (
//         <LoadMoreMessages chatId={chatId} sessionUserId={sessionUserId} />
//       )}
//       {messages.map((message) => (
//         <Message
//           key={message.id}
//           message={message}
//           sessionUserId={sessionUserId}
//         />
//       ))}
//       <DeleteMessage />
//       {userScrolled && (
//         <ScrollDown notifications={notifications} onScrollDown={scrollDown} />
//       )}
//     </div>
//   );
// };





"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessage } from "@/store/conversation/messages";
import React, { useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import { DeleteMessage } from "./DeleteMessage";
import { supabase } from "@/lib/supabase";
import {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import axios from "axios";
import { ExtendedMessage } from "@/types/extended";
import { domain } from "@/lib/api";
import { ScrollDown } from "./ScrollDown";
import { LoadMoreMessages } from "./LoadMoreMessages";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { LoadingState } from "@/components/loader/loadingState";

interface Props {
  workspaceId: string;
  chatId: string;
  sessionUserId: string;
}

export const MessagesContainer = ({
  workspaceId,
  chatId,
  sessionUserId,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [userScrolled, setUserScrolled] = useState(false);
  const [notifications, setNotifications] = useState(0);

  const {
    messages,
    initialMessagesLoading,
    addMessage,
    editMessage,
    deleteMessage,
    hasMore,
  } = useMessage((state) => state);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, userScrolled]);

  // Supabase real-time subscriptions for message events
  useEffect(() => {
    const supabaseClient = supabase();

    const handleAddMessage = async (
      payload: RealtimePostgresInsertPayload<Record<string, any>>
    ) => {
      if (sessionUserId !== payload.new.senderId) {
        try {
          const { data } = await axios.get<ExtendedMessage>(
            `${domain}/api/conversation/get/new_message?messageId=${payload.new.id}`
          );
          if (data) {
            addMessage(data);
            const scrollContainer = scrollRef.current;
            if (
              scrollContainer &&
              scrollContainer.scrollTop <
                scrollContainer.scrollHeight -
                  scrollContainer.clientHeight -
                  10
            ) {
              setNotifications((current) => current + 1);
            }
          }
        } catch (error) {
          console.error("Error fetching new message:", error);
        }
      }
    };

    const handleUpdateMessage = (
      payload: RealtimePostgresUpdatePayload<Record<string, any>>
    ) => {
      editMessage(payload.new.id, payload.new.content);
    };

    const handleDeleteMessage = (
      payload: RealtimePostgresDeletePayload<Record<string, any>>
    ) => {
      deleteMessage(payload.old.id);
    };

    const channel = supabaseClient
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Message" },
        handleAddMessage
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Message" },
        handleUpdateMessage
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "Message" },
        handleDeleteMessage
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [chatId, sessionUserId, addMessage, editMessage, deleteMessage]);

  // Handle user scroll
  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScrolled =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScrolled);

      if (!isScrolled) {
        setNotifications(0);
      }
    }
  };

  // Scroll to the bottom
  const scrollDown = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
      setNotifications(0);
    }
  };

  if (initialMessagesLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  const t = useTranslations("CHAT.NO_MESSAGES");

  if (messages.length === 0) {
    return (
      <div className="flex flex-col gap-2 sm:text-lg font-semibold items-center p-2 justify-center">
        <MessageSquare className="w-16 h-16 sm:w-28 sm:h-28" />
        <div className="text-center">
          <p>{t("FIRST")}</p>
          <p>{t("SECOND")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleOnScroll}
      className=" h-full flex flex-col gap-2 px-4 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background"
    >
      {hasMore && (
        <LoadMoreMessages chatId={chatId} sessionUserId={sessionUserId} />
      )}
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          sessionUserId={sessionUserId}
        />
      ))}
      <DeleteMessage />
      {userScrolled && (
        <ScrollDown notifications={notifications} onScrollDown={scrollDown} />
      )}
    </div>
  );
};
