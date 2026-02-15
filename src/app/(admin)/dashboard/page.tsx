import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Total Chats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No chats yet.</p>
          </CardContent>
        </Card>

        {/* Total Knowledge Fragments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Knowledge Fragments
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Add documents to your knowledge base.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Recent chat activity on your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              No data available
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest changes to your knowledge base.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[100px] items-center justify-center text-sm text-muted-foreground">
              No recent activity.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
