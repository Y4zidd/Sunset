import { twMerge } from "tailwind-merge";

import Image from "next/image";
import ImageWithFallback from "./ImageWithFallback";
import { FriendshipButton } from "@/components/FriendshipButton";
import { useRouter } from "next/navigation";
import UserStatusText, {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";
import Link from "next/link";
import { MaterialSymbolsCircleOutline } from "@/components/ui/icons/circle-outline";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import UserCustomBadges from "@/app/(website)/user/[id]/components/UserCustomBadges";
import { UserResponse } from "@/lib/types/api";

interface UserProfileBannerProps {
  user: UserResponse;
  includeFriendshipButton?: boolean;
  className?: string;
  rightSlot?: React.ReactNode;
}

export default function UserElement({
  user,
  includeFriendshipButton = false,
  className,
  rightSlot,
}: UserProfileBannerProps) {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        "relative w-full overflow-hidden rounded-lg group h-36",
        className
      )}
    >
      <div className="relative h-full place-content-between flex-col flex group-hover:cursor-pointer ">
        <ImageWithFallback
          src={`${user?.banner_url}&default=false`}
          alt=""
          fill={true}
          objectFit="cover"
          className="bg-stone-700 rounded-t-lg"
          fallBackSrc="/images/placeholder.png"
        />

        <div className="absolute inset-0 bg-black bg-opacity-50 smooth-transition group-hover:bg-opacity-35" />

        <Link
          href={`/user/${user.user_id}`}
          className="relative flex place-content-between flex-1 p-4"
        >
          <div className="relative flex items-start overflow-hidden flex-1 min-w-0">
            {/* Profile Picture */}
            <div className="rounded-full flex-none overflow-hidden border-2 border-white mr-4">
              <Image
                src={user?.avatar_url}
                alt={`${user.username}'s profile`}
                objectFit="cover"
                width={48}
                height={48}
              />
            </div>

            {/* Username, Flag, Badges */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center mb-1">
                <h2 className="text-white md:text-lg lg:text-xl font-bold mr-2 truncate">
                  {user.username}
                </h2>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <img
                  src={`/images/flags/${user.country_code}.png`}
                  alt="User Flag"
                  className="w-8 h-8 flex-shrink-0"
                />
                <div
                  className="flex items-center gap-1 flex-shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <UserPrivilegeBadges badges={user.badges} small={true} />
                  <UserCustomBadges
                    customBadges={
                      (user as any).custom_badges_detailed ??
                      (user as any).custom_badges
                    }
                    small
                    withToolTip={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {rightSlot ?? (
            includeFriendshipButton && (
              <FriendshipButton
                userId={user.user_id}
                className="w-10 h-10 flex-shrink-0"
                includeText={false}
              />
            )
          )}
        </Link>

        <div className="relative py-2 px-4 bg-black bg-opacity-50 rounded-b-lg flex flex-row w-full">
          <div className="flex space-x-2 items-center text-sm w-full">
            <MaterialSymbolsCircleOutline
              className={`text-base text-${statusColor(
                user.user_status
              )} flex-shrink-0`}
            />
            <div className="flex flex-grow line-clamp-1 w-8/12">
              <UserStatusText user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
