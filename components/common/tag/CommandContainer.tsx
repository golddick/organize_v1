// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
// } from "@/components/ui/command";
// import { Plus } from "lucide-react";
// import { useState } from "react";
// import { CommandTagItem } from "./CommandTagItem";
// import { CustomColors, Tag } from "@prisma/client";
// import { useTranslations } from "next-intl";
// import { CreateNewTagOrEditTag } from "./CreateNewTagorEditTag";

// interface Props {
//   tags?: Tag[];
//   currentActiveTags: Tag[];
//   onSelectActiveTag: (id: string) => void;
//   workspaceId: string;
//   onUpdateActiveTags: (
//     tagId: string,
//     color: CustomColors,
//     name: string
//   ) => void;
//   onDeleteActiveTag: (tagId: string) => void;
// }


// export const CommandContainer = ({
//   tags = [],
//   currentActiveTags,
//   onSelectActiveTag,
//   workspaceId,
//   onUpdateActiveTags,
//   onDeleteActiveTag,
// }: Props) => {
//   const [tab, setTab] = useState<"list" | "newTag" | "editTag">("list");
//   const [editedTagInfo, setEditedTagInfo] = useState<null | Tag>(null);
//   const t = useTranslations("TASK.HEADER.TAG");

//   const onEditTagInfoHandler = (tag: Tag) => {
//     setEditedTagInfo(tag);
//     setTab("editTag");
//   };

//   const onSetTab = (newTab: "list" | "newTag" | "editTag") => {
//     setTab(newTab);
//   };

//   return (
//     <Command className="w-[15rem]">
//       <>
    
//       {tab === "list" && (
//         <>
//           <CommandInput
//             className="text-xs"
//             placeholder={tags.length ? t("FILTER") : t("NO_TAGS_PLACEHOLDER")}
//           />
//           <CommandList>
//             <CommandEmpty>{t("NOT_FOUND")}</CommandEmpty>
//             {tags.length > 0 && (
//               <CommandGroup heading={t("TAGS_HEADING")}>
//                 {tags.map((tag) => (
//                   <CommandTagItem
//                     key={tag.id}
//                     tag={tag}
//                     currentActiveTags={currentActiveTags}
//                     onSelectActiveTag={onSelectActiveTag}
//                     onEditTagInfo={onEditTagInfoHandler}
//                   />
//                 ))}
//               </CommandGroup>
//             )}
//             <CommandSeparator />
//             <CommandGroup heading={t("NEW_HEADING")}>
//               <CommandItem className="p-0">
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   className="w-full h-fit justify-start px-2 py-1.5 text-xs"
//                   onClick={() => setTab("newTag")}
//                 >
//                   <Plus className="mr-1" size={16} />
//                   {t("ADD_TAG")}
//                 </Button>
//               </CommandItem>
//             </CommandGroup>
//           </CommandList>
//         </>
//       )}
//       {tab === "newTag" && (
//         <CreateNewTagOrEditTag onSetTab={onSetTab} workspaceId={workspaceId} />
//       )}
//       {tab === "editTag" && editedTagInfo && (
//         <CreateNewTagOrEditTag
//           edit
//           workspaceId={workspaceId}
//           color={editedTagInfo.color}
//           id={editedTagInfo.id}
//           tagName={editedTagInfo.name}
//           onSetTab={onSetTab}
//           onUpdateActiveTags={onUpdateActiveTags}
//           onDeleteActiveTag={onDeleteActiveTag}
//           currentActiveTags={currentActiveTags}
//           onSelectActiveTag={onSelectActiveTag}
//         />
//       )}
//         </>
//     </Command>
//   );
// };

import React from 'react'

export const CommandContainer = () => {
  return (
    <div>CommandContainer</div>
  )
}
