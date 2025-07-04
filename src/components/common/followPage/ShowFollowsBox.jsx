"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { followRecv } from "@/store/authSlice";
import { TableCell, TableRow } from "@/components/ui/table";
import ShowAvatar from "../ShowAvatar";
import { API_URL } from "@/constants/constant";

const ShowFollowsBox = ({ user, userId }) => {
  const dispatch = useDispatch();

  const meUserFollowing = useSelector((state) => state.auth.user.following);
  const isFollowing = meUserFollowing.includes(user._id);

  const followUser = async () => {
    try {
      const res = await axios.patch(`${API_URL}/follow/${user._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        const follow = res.data.follow;
        dispatch(followRecv({ follow, recvId: user._id }));
      } else {
        throw new Error(res.data.message || "Failed to follow / unfollow user");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch posts"
      );
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Link href={`/home/user/profile${user._id == userId ? "" : `/${user._id}`}`} className="flex items-center gap-4">
          <ShowAvatar
            profilePicture={user.profilePicture}
            username={user.username}
            size={10}
          />
          <div>
            <div className="font-medium">{user.username || "User"}</div>
            <div className="text-sm text-muted-foreground">
              @{user.username || "User"}
            </div>
          </div>
        </Link>
      </TableCell>
      <TableCell className="flex justify-end gap-2">
        {/* <Link
          href={`/home/user/profile${user._id == userId ? "" : `/${user._id}`}`}
        >
          <Button variant="outline" size="sm" className="gap-1">
            <Eye className="h-4 w-4" />
            <span>Profile</span>
          </Button>
        </Link> */}
        {user._id == userId ? (
          <Button
            variant={"outline"}
            size="sm"
            className="gap-1"
            disable={"true"}
          >
            You
          </Button>
        ) : isFollowing ? (
          <Button
            variant="default"
            size="sm"
            className="gap-1 "
            onClick={followUser}
          >
            <UserMinus className="h-4 w-4" />
            <span>Unfollow</span>
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="gap-1 bg-blue-600 hover:bg-blue-700"
            onClick={followUser}
          >
            <UserPlus className="h-4 w-4" />
            <span>Follow</span>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ShowFollowsBox;
