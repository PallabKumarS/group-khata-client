"use client";

import { Users, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TUser } from "@/types/user.type";

interface MembersListProps {
  members: TUser[];
  onKick: (user: TUser) => void;
}

export function MembersList({ members, onKick }: MembersListProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border/40">
      <h4 className="font-semibold text-foreground flex items-center gap-2">
        <Users className="w-4 h-4 text-violet-500" />
        Current Members ({members.length})
      </h4>

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground italic p-4 rounded-xl border border-dashed border-border/40 bg-muted/10 text-center">
          No members joined yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50 group"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{member.name}</span>
                <span className="text-xs text-muted-foreground">
                  {member.phone || member.email}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onKick(member)}
                className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-full"
              >
                <UserMinus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
