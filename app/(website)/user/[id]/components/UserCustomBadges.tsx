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
      // alternatif penamaan dari API lama
      ColorHex?: string | null;
      Icon?: string | null;
      IconType?: string | null;
    };

interface UserCustomBadgesProps {
  customBadges?: BadgeItem[];
  small?: boolean;
  className?: string;
  withToolTip?: boolean;
  tintAlpha?: number; // kontrol intensitas transparansi latar
}

export default function UserCustomBadges({
  customBadges,
  small,
  className,
  withToolTip = true,
  tintAlpha = 0.3,
}: UserCustomBadgesProps) {
  const badges = (customBadges ?? []).filter((b) => !!b);

  // DEBUG: Log data structure untuk troubleshooting
  console.log("UserCustomBadges received:", { customBadges, badges });

  if (badges.length === 0) return null;

  // Fungsi untuk convert hex ke RGB values
  function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return { r, g, b };
  }

  // Generate Tailwind-style color string seperti privilege badges
  function generateColorString(hex: string) {
    const { r, g, b } = hexToRgb(hex);
    
    // Buat warna yang lebih terang untuk text (seperti text-orange-400)
    const textR = Math.min(255, Math.round(r * 1.2));
    const textG = Math.min(255, Math.round(g * 1.2));
    const textB = Math.min(255, Math.round(b * 1.2));
    
    // Buat warna yang lebih gelap untuk border (seperti border-orange-600)
    const borderR = Math.max(0, Math.round(r * 0.8));
    const borderG = Math.max(0, Math.round(g * 0.8));
    const borderB = Math.max(0, Math.round(b * 0.8));
    
    // Buat warna hover yang sedikit lebih terang
    const hoverR = Math.min(255, Math.round(r * 1.1));
    const hoverG = Math.min(255, Math.round(g * 1.1));
    const hoverB = Math.min(255, Math.round(b * 1.1));
    
    return {
      background: `rgb(${r} ${g} ${b} / 0.3)`, // 30% opacity seperti bg-orange-500/30
      hover: `rgb(${hoverR} ${hoverG} ${hoverB} / 0.3)`, // hover color
      text: `rgb(${textR}, ${textG}, ${textB})`, // text color
      border: `rgb(${borderR}, ${borderG}, ${borderB})`, // border color
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

        // DEBUG: Log each badge data
        console.log(`Badge ${index}:`, { 
          item, 
          name, 
          colorHex, 
          iconNameRaw, 
          iconType,
          isBadgeObject: isBadgeObject(item)
        });

        // Generate icon component
        let icon;
        if (iconType === "emoji" && typeof iconNameRaw === "string") {
          icon = (
            <span
              className={small ? "w-4 h-4 text-sm" : "w-4 h-4 md:w-6 md:h-6 text-base md:text-lg"}
              role="img"
              aria-label={name}
            >
              {iconNameRaw}
            </span>
          );
        } else if (iconType === "url" && typeof iconNameRaw === "string") {
          icon = (
            // eslint-disable-next-line @next/next/no-img-element
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

        // Generate color string PERSIS seperti privilege badges
        let color = "bg-slate-600/30 hover:bg-slate-500/30 text-slate-400 border-slate-600";
        
        // Jika ada custom color dari database, override dengan warna custom
        if (colorHex) {
          const colors = generateColorString(colorHex);
          color = ""; // Kosongkan default color karena akan pakai inline style
        }

        // Adjust icon for small size if needed (following privilege badges pattern)
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
                        const colors = generateColorString(colorHex);
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
                {!small && <span className="capitalize">{name}</span>}
              </Badge>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}


