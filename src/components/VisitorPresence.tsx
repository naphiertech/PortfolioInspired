"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  AblyProvider,
  ChannelProvider,
  usePresence,
  usePresenceListener,
  useConnectionStateListener,
  useAbly,
} from "ably/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  VisitorProfile,
  VisitorPresenceData,
  getOrCreateVisitor,
  getDiceBearAvatar,
} from "@/lib/avatarGenerator";
import { getAblyRealtimeClient } from "@/lib/ablyClient";
import { Users, RefreshCw, Eye } from "lucide-react";

interface ActiveMember {
  clientId: string;
  data: VisitorPresenceData;
}

/**
 * Inner component that interacts directly with Ably channel presence
 */
function VisitorPresenceContent({
  initialVisitor,
}: {
  initialVisitor: VisitorProfile;
}) {
  const ably = useAbly();
  const [currentVisitor, setCurrentVisitor] =
    useState<VisitorProfile>(initialVisitor);
  const [isConnected, setIsConnected] = useState(
    ably.connection.state === "connected"
  );

  // Monitor real-time connection state
  useConnectionStateListener((stateChange) => {
    setIsConnected(stateChange.current === "connected");
  });

  // Enter presence with current visitor profile and obtain status updater
  const { updateStatus, connectionError, channelError } =
    usePresence<VisitorPresenceData>(undefined, {
      name: currentVisitor.name,
      src: currentVisitor.src,
      fallback: currentVisitor.fallback,
      variantIndex: currentVisitor.variantIndex,
    });

  // Listen for real-time presence events (enter, leave, update)
  const { presenceData } = usePresenceListener<VisitorPresenceData>();

  // Deduplicate presence members by stable anonymous clientId
  const activeMembers = useMemo<ActiveMember[]>(() => {
    const map = new Map<string, ActiveMember>();

    for (const item of presenceData) {
      if (item.clientId && item.data) {
        map.set(item.clientId, {
          clientId: item.clientId,
          data: item.data as VisitorPresenceData,
        });
      }
    }

    // Ensure local visitor is included if connected
    if (isConnected && !map.has(currentVisitor.id)) {
      map.set(currentVisitor.id, {
        clientId: currentVisitor.id,
        data: {
          name: currentVisitor.name,
          src: currentVisitor.src,
          fallback: currentVisitor.fallback,
          variantIndex: currentVisitor.variantIndex,
        },
      });
    }

    const list = Array.from(map.values());

    // Sort so the current user is consistently first
    return list.sort((a, b) => {
      if (a.clientId === currentVisitor.id) return -1;
      if (b.clientId === currentVisitor.id) return 1;
      return 0;
    });
  }, [presenceData, currentVisitor, isConnected]);

  // Handle switching avatar: cycle variant index, update local state & Ably presence
  const handleChangeAvatar = async () => {
    const nextVariant = ((currentVisitor.variantIndex || 0) + 1) % 8;
    const newSrc = getDiceBearAvatar(currentVisitor.name, nextVariant);
    const updated: VisitorProfile = {
      ...currentVisitor,
      variantIndex: nextVariant,
      src: newSrc,
    };

    setCurrentVisitor(updated);

    try {
      localStorage.setItem(
        "portfolio_visitor_platform_self",
        JSON.stringify(updated)
      );
    } catch {
      // ignore
    }

    try {
      await updateStatus({
        name: updated.name,
        src: updated.src,
        fallback: updated.fallback,
        variantIndex: updated.variantIndex,
      });
    } catch (err) {
      console.error("Failed to update Ably presence avatar:", err);
    }
  };

  // If Ably is disconnected, unavailable, or 0 active members: hide avatar pill
  if (
    !isConnected ||
    Boolean(connectionError) ||
    Boolean(channelError) ||
    activeMembers.length === 0
  ) {
    return null;
  }

  const displayedMembers = activeMembers.slice(0, 4);
  const overflowCount = activeMembers.length - 4;
  const otherMembers = activeMembers.filter(
    (m) => m.clientId !== currentVisitor.id
  );

  return (
    <TooltipProvider delayDuration={150}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group relative flex items-center rounded-full border border-border-hairline bg-page hover:bg-surface p-0.5 sm:p-1 shadow-xs transition-all duration-200 hover:scale-[1.02] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-hairline"
            aria-label="Visitor presence indicator"
          >
            {/* Overlapping DiceBear Avatar Stack */}
            <div className="flex -space-x-2 sm:-space-x-2.5 items-center">
              {displayedMembers.map((member) => (
                <Avatar
                  key={member.clientId}
                  className="h-6 w-6 sm:h-6.5 sm:w-6.5 ring-2 ring-page transition-transform duration-150 group-hover:ring-surface bg-muted/40"
                >
                  <AvatarImage
                    src={member.data?.src}
                    alt={member.data?.name || "Visitor"}
                  />
                  <AvatarFallback className="text-[10px] font-mono">
                    {member.data?.fallback || "??"}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>

            {/* Overflow Counter Pill (Only shown when 5 or more active members) */}
            {overflowCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full bg-transparent px-1.5 sm:px-2 text-[11px] font-mono font-medium leading-none transition-colors">
                    +{overflowCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-mono">
                  <p className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>
                      {activeMembers.length} active{" "}
                      {activeMembers.length === 1 ? "visitor" : "visitors"}
                    </span>
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </button>
        </DropdownMenuTrigger>

        {/* Dropdown Menu for Presence Details & Customization */}
        <DropdownMenuContent
          align="center"
          sideOffset={6}
          className="w-64 font-sans p-2"
        >
          {/* Header */}
          <DropdownMenuLabel className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 pb-1">
            <Users className="w-3.5 h-3.5 text-foreground" />
            <span>Visitor Presence</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Current Local Visitor Card */}
          <div className="p-2 my-1 rounded-md bg-muted border border-border-hairline flex items-center gap-2.5">
            <Avatar className="h-8 w-8 ring-1 ring-border-hairline bg-surface">
              <AvatarImage src={currentVisitor.src} alt="Your Avatar" />
              <AvatarFallback className="text-xs">
                {currentVisitor.fallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                You ({currentVisitor.name})
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Online now
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Action to switch avatar */}
          <DropdownMenuItem
            onClick={handleChangeAvatar}
            className="cursor-pointer text-xs font-mono flex items-center gap-2 py-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Switch Your Avatar</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Live "Viewing Now" list */}
          <div className="pt-1 px-1">
            <p className="text-[10px] font-mono text-muted-foreground mb-1.5">
              Viewing Now
            </p>
            {otherMembers.length === 0 ? (
              <p className="text-[11px] font-mono text-muted-foreground/80 py-1.5 px-0.5">
                No one else is here right now.
              </p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {otherMembers.map((member) => (
                  <div
                    key={member.clientId}
                    className="flex items-center justify-between text-xs py-0.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-5 w-5 bg-surface ring-1 ring-border-hairline shrink-0">
                        <AvatarImage
                          src={member.data?.src}
                          alt={member.data?.name || "Visitor"}
                        />
                        <AvatarFallback className="text-[9px]">
                          {member.data?.fallback || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground truncate max-w-[120px] text-[11px] font-mono">
                        {member.data?.name || "Visitor"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/70 shrink-0">
                      Online
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}

/**
 * Root VisitorPresence Component
 * Initializes client-side stable identity and wraps content in AblyProvider & ChannelProvider
 */
export function VisitorPresence() {
  const [visitor, setVisitor] = useState<VisitorProfile | null>(null);

  useEffect(() => {
    const v = getOrCreateVisitor();
    setVisitor(v);
  }, []);

  if (!visitor) {
    return null;
  }

  const ablyClient = getAblyRealtimeClient(visitor.id);
  if (!ablyClient) {
    return null;
  }

  return (
    <AblyProvider client={ablyClient}>
      <ChannelProvider channelName="portfolio-presence">
        <VisitorPresenceContent initialVisitor={visitor} />
      </ChannelProvider>
    </AblyProvider>
  );
}

export default VisitorPresence;
