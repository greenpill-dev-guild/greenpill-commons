"use client";

import React from "react";
import { CalendarRangeIcon, ThumbsUpIcon, MapPinIcon } from "lucide-react";

import { truncateDescription } from "../../utils/text";
import { Button } from "../Button";
import Image from "next/image";

export interface ProposalCardProps extends TSummaryProposal {
  userVote?: boolean | null; // true if upvoted, false if downvoted, null if not voted
  onUpVote: () => void;
  onCardClick: () => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  name,
  location,
  problem,
  banner_image,
  start_date,
  end_date,
  votes,
  userVote,
  onUpVote,
  onCardClick,
}) => {
  const upvotes = votes?.filter((vote) => vote.vote_type === true).length ?? 0;

  return (
    <div
      className="flex flex-col bg-white border border-1 shadow-md rounded-xl"
      onClick={onCardClick}
    >
      <div className="relative w-full h-auto rounded-t-xl">
        <span className="flex gap-1 items-center absolute top-2 right-2 bg-white px-1.5 py-1 rounded-xl">
          <ThumbsUpIcon
            onClick={onUpVote}
            className={`
              ${userVote === true ? "fill-green-500" : "fill-slate-500"}
              h-5 text-slate-500
            `}
          />
          {upvotes}
        </span>
        <img
          className="w-full rounded-t-xl aspect-[4/2] object-cover object-top"
          width={400}
          height={200}
          src={
            banner_image ??
            "https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80"
          }
          alt="Image Description"
        />
      </div>
      <div className="p-4 md:p-5 flex flex-col gap-1">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
          {name}
        </h3>
        <div className="flex gap-1">
          <MapPinIcon className="h-5 text-teal-400" />
          <span className="text-sm font-medium">{location}</span>
        </div>
        <div className="flex gap-1">
          <CalendarRangeIcon className="h-5 text-teal-400" />
          <span className="text-sm font-medium">
            {start_date && end_date
              ? `${start_date.toLocaleDateString()} - ${end_date.toLocaleDateString()}`
              : "No timeline provided."}
          </span>
        </div>
        <p className="mt-1 text-slate-600 line-clamp-3 leading-5">{problem}</p>
        {/* <div className="flex w-full justify-end">
          <Button label="View" size="small" onClick={onCardClick} />
        </div> */}
      </div>
    </div>
  );
};

// <div className="flex flex-col gap-x-4 p-2 mt-2" onClick={onCardClick}>
//   <div className="justify-between cursor-pointer mb-2">
//     <div className="flex">
//       <h3 className="text-lg font-semibold leading-6 text-gray-900">
//         {name}
//       </h3>
//     </div>
//     <span className="text-sm">
//       <MapPinIcon className="h-5 inline-block" />
//       {location}
//     </span>
//   </div>
//   <div className="mt-1 text-sm">
//     {problem ? truncateDescription(problem) : "No summary provided."}
//   </div>
//   <div>
//     <span className="text-xs mt-2">
//       Allocations: {votesCastedToRecipient ?? 0}
//     </span>
//   </div>
//   <div className="mt-1">
//     <span className="text-xs font-semibold">{author.username}</span>
//     {collaborators &&
//       collaborators?.map((user) => (
//         <span
//           key={`${id}-${user.user_id}`}
//           className="text-xs font-semibold"
//         >
//           {user.username}
//         </span>
//       ))}
//   </div>
// </div>