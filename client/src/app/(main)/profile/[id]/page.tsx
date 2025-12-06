"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProfileData } from "@/lib/types/profile";
import { fetchUserProfile } from "@/lib/api/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Coins, Flame, CircleAlert, CheckSquare } from "lucide-react";
import { FriendshipButton } from "@/components/ui/profile/friendshipButton";
import { StatCard } from "@/components/ui/profile/statCard";
import { TaskItem } from "@/components/ui/taskList/taskItem";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default function ProfilePage({
  params: paramsPromise,
}: ProfilePageProps) {
  const params = use(paramsPromise);
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const profileId = parseInt(params.id, 10);
  const isOwnProfile = currentUser?.ID === profileId;

  const loadProfile = useCallback(async () => {
    if (isNaN(profileId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await fetchUserProfile(profileId);
    setProfileData(data);
    setLoading(false);
  }, [profileId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-center p-10">User not found.</div>;
  }

  const {
    user,
    totalCompleted,
    totalMistakes,
    tasksWithProgress,
    friendshipWithView,
  } = profileData;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card border rounded-lg">
        <Avatar className="w-24 h-24 border-4 border-primary">
          <AvatarImage src={user.avatarURL} alt={user.username} />
          <AvatarFallback className="text-3xl">
            {user.username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        {!isOwnProfile && friendshipWithView && (
          <div className="flex-shrink-0 mt-4 sm:mt-0">
            <FriendshipButton
              profileUserId={user.ID}
              friendshipStatus={friendshipWithView}
              onActionComplete={loadProfile}
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Level"
          value={user.level}
          icon={<Star className="w-5 h-5 text-yellow-400" />}
        />
        <StatCard
          title="Points"
          value={user.points}
          icon={<Coins className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Streak"
          value={`${user.streakCount} days`}
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        />
        <StatCard
          title="Completed Tasks"
          value={totalCompleted}
          icon={<CheckSquare className="w-5 h-5 text-green-500" />}
        />
        <StatCard
          title="Total Mistakes"
          value={totalMistakes}
          icon={<CircleAlert className="w-5 h-5 text-red-500" />}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Task Progress</h2>
        {tasksWithProgress && tasksWithProgress.length > 0 ? (
          <div className="space-y-3">
            {tasksWithProgress
              .filter((task) => task.user_progress)
              .map((task) => (
                <TaskItem key={task.ID} task={task} isMyTask={isOwnProfile} />
              ))}
          </div>
        ) : (
          <div className="text-center p-10 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">
              {user.username} hasn&apos;t started any tasks yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
