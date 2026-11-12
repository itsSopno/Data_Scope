"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { RecordDetailDrawer } from "@/components/explorer/RecordDetailDrawer";
import { AIQueryAssistantModal } from "@/components/modals/AIQueryAssistantModal";
import { QueryBuilderModal } from "@/components/modals/QueryBuilderModal";
import { ExportModal } from "@/components/modals/ExportModal";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Topbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
          <div className="mx-auto max-w-[1600px] h-full flex flex-col space-y-4">
            {children}
          </div>
        </main>
      </div>

      {/* Interactive Global Modals & Drawers */}
      <RecordDetailDrawer />
      <AIQueryAssistantModal />
      <QueryBuilderModal />
      <ExportModal />
    </div>
  );
}

