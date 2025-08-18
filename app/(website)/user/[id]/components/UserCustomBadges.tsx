import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { twMerge } from "tailwind-merge";
import React from "react";
import * as Lucide from "lucide-react";

export type BadgeItem =
  | string
  | {
      name: string;
      colorHex?: string | null;
      icon?: string | null;
      iconType?: string | null;
      ColorHex?: string | null;
      Icon?: string | null;
      IconType?: string | null;
    };

interface UserCustomBadgesProps {
  customBadges?: BadgeItem[];
  small?: boolean;
  className?: string;
  withToolTip?: boolean;
  tintAlpha?: number;
}

export default function UserCustomBadges({
  customBadges,
  small,
  className,
  withToolTip = true,
  tintAlpha = 0.3,
}: UserCustomBadgesProps) {
  const badges = (customBadges ?? []).filter((b) => !!b);

  if (badges.length === 0) return null;

  function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return { r, g, b };
  }

  function generateColorString(hex: string, alpha: number) {
    const { r, g, b } = hexToRgb(hex);
    // Text color lebih terang dari background (mirip dengan text-{color}-400)
    const textR = Math.min(255, r + 60);
    const textG = Math.min(255, g + 60);
    const textB = Math.min(255, b + 60);
    // Border lebih gelap (mirip dengan border-{color}-600)
    const borderR = Math.max(0, Math.round(r * 0.7));
    const borderG = Math.max(0, Math.round(g * 0.7));
    const borderB = Math.max(0, Math.round(b * 0.7));
    return {
      background: `rgb(${r} ${g} ${b} / ${alpha})`,
      text: `rgb(${textR}, ${textG}, ${textB})`,
      border: `rgb(${borderR}, ${borderG}, ${borderB})`,
    };
  }


  function kebabToPascal(name: string) {
    return name
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("");
  }

  function isBadgeObject(item: BadgeItem): item is Exclude<BadgeItem, string> {
    return typeof item !== "string";
  }

  const iconAliases: Record<string, string> = {
    "paw-print": "PawPrint",
    paw: "PawPrint",
    flower: "Flower",
    "flower-2": "Flower2",
    heart: "Heart",
    music: "Music",
    gamepad: "Gamepad2",
    "gamepad-2": "Gamepad2",
    tag: "Tag",
  };

  return (
    <div className={twMerge("flex flex-wrap gap-1", className)}>
      {badges.map((item, index) => {
        const name = isBadgeObject(item) ? item.name : item;
        const colorHex = isBadgeObject(item) ? item.colorHex ?? item.ColorHex ?? undefined : undefined;
        const iconNameRaw = isBadgeObject(item)
          ? item.icon ?? item.Icon ?? item.name
          : item;
        const iconType = isBadgeObject(item) ? item.iconType ?? item.IconType ?? undefined : undefined;

        let icon;
        if (iconType === "emoji" && typeof iconNameRaw === "string") {
          icon = (
            <span
              className="w-4 h-4 md:w-6 md:h-6"
              role="img"
              aria-label={name}
            >
              {iconNameRaw}
            </span>
          );
        } else if (iconType === "url" && typeof iconNameRaw === "string") {
          icon = (
            <img
              src={iconNameRaw}
              alt={name}
              className={small ? "w-4 h-4" : "w-4 h-4 md:w-6 md:h-6"}
            />
          );
        } else {
          const IconComp = (() => {
            if (!iconNameRaw) return (Lucide as any).Tag;
            const alias = iconAliases[iconNameRaw] || iconAliases[(iconNameRaw as string).toLowerCase()] || kebabToPascal(iconNameRaw as string);
            return (Lucide as any)[alias] ?? (Lucide as any).Tag;
          })();
          icon = <IconComp className={small ? "w-4 h-4" : "w-4 h-4 md:w-6 md:h-6"} />;
        }
        let color = "bg-slate-600/30 hover:bg-slate-500/30 text-slate-400 border-slate-600";
        if (colorHex) {
          color = "";
        }
        if (small && icon) {
          icon = React.cloneElement(icon, {
            className: "w-4 h-4",
          });
        }

        return (
          <Tooltip
            content={<p className="capitalize">{name}</p>}
            key={`user-custom-badge-${index}`}
            disabled={!withToolTip}
          >
            <div className="rounded-lg">
              <Badge
                className={twMerge(
                  `flex text-white items-center text-xs p-1 rounded-lg ${color} smooth-transition`,
                  !small ? "md:text-base md:gap-2 md:p-1.5 gap-1" : "",
                  withToolTip ? "hover:scale-105" : ""
                )}
                style={
                  colorHex
                    ? (() => {
                        const colors = generateColorString(colorHex, tintAlpha);
                        return {
                          backgroundColor: colors.background,
                          color: colors.text,
                          borderColor: colors.border,
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        };
                      })()
                    : undefined
                }
              >
                {icon}
              </Badge>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}


