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
  tintAlpha = 0.2,
}: UserCustomBadgesProps) {
  const badges = (customBadges ?? []).filter((b) => !!b);

  if (badges.length === 0) return null;

  function hexToRgba(hex: string, alpha = 0.3) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  // Gelapkan/terangkan warna untuk border agar mirip pola text-400 vs border-600
  function adjustHexLightness(hex: string, amount: number) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const num = parseInt(full, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    r = clamp(Math.round(r + (amount * 255)), 0, 255);
    g = clamp(Math.round(g + (amount * 255)), 0, 255);
    b = clamp(Math.round(b + (amount * 255)), 0, 255);

    const toHex = (v: number) => v.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

        const IconComp = (() => {
          if (!iconNameRaw) return (Lucide as any).Tag;
          if (iconType === "emoji") return null;
          if (iconType === "url") return null;
          const alias = iconAliases[iconNameRaw] || iconAliases[(iconNameRaw as string).toLowerCase()] || kebabToPascal(iconNameRaw as string);
          return (Lucide as any)[alias] ?? (Lucide as any).Tag;
        })();

        return (
          <Tooltip
            content={<p className="capitalize">{name}</p>}
            key={`user-custom-badge-${index}`}
            disabled={!withToolTip}
          >
            <div className="rounded-lg">
              <Badge
                variant="outline"
                className={twMerge(
                  // samakan dengan badge bawaan: padding kecil, rounded, border
                  "flex items-center text-xs p-1 rounded-lg border smooth-transition hover:brightness-110",
                  !small ? "md:text-base md:gap-2 md:p-1.5 gap-1" : "",
                  withToolTip ? "hover:scale-105" : ""
                )}
                style={
                  colorHex
                    ? {
                        backgroundColor: hexToRgba(colorHex, tintAlpha),
                        borderColor: adjustHexLightness(colorHex, -0.12),
                        color: colorHex, // warna ikon/teks mengikuti colorHex
                      }
                    : undefined
                }
                title={!withToolTip ? name : undefined}
              >
                {iconType === "emoji" && typeof iconNameRaw === "string" ? (
                  <span
                    className={small ? "text-sm" : "text-base md:text-lg"}
                    style={colorHex ? { color: colorHex } : undefined}
                    role="img"
                    aria-label={name}
                  >
                    {iconNameRaw}
                  </span>
                ) : iconType === "url" && typeof iconNameRaw === "string" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={iconNameRaw}
                    alt={name}
                    className={small ? "w-4 h-4" : "w-4 h-4 md:w-6 md:h-6"}
                    style={{ filter: colorHex ? "" : undefined }}
                  />
                ) : (
                  // lucide default (stroke mengikuti currentColor)
                  // @ts-ignore
                  <IconComp
                    className={small ? "w-4 h-4" : "w-4 h-4 md:w-6 md:h-6"}
                    style={colorHex ? { color: colorHex } : undefined}
                  />
                )}
                {!small && <span className="capitalize">{name}</span>}
              </Badge>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}


