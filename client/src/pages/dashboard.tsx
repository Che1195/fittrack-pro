import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import type { Client, Session } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: clients } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const { data: sessions } = useQuery<Session[]>({ queryKey: ["/api/sessions"] });

  const unpaidSessions = sessions?.filter(s => !s.paid) || [];
  const totalUnpaid = unpaidSessions.reduce((acc, session) => {
    const client = clients?.find(c => c.id === session.clientId);
    return acc + (client?.sessionCost || 0);
  }, 0);

  const stats = [
    { 
      title: "Active Clients", 
      value: clients?.length || 0, 
      icon: Users, 
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10"
    },
    { 
      title: "Total Sessions", 
      value: sessions?.length || 0, 
      icon: Calendar, 
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-500/10 to-emerald-600/10"
    },
    { 
      title: "Unpaid", 
      value: `$${totalUnpaid}`, 
      icon: DollarSign, 
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your training business</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden border-0 shadow-sm">
            <CardContent className={`p-5 bg-gradient-to-br ${stat.bgGradient}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">Get things done faster</p>
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/clients">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="link-add-client">
                  <Users className="w-4 h-4" />
                  Add New Client
                </Button>
              </Link>
              <Link href="/sessions">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="link-log-session">
                  <Calendar className="w-4 h-4" />
                  Log a Session
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">Payment Status</h3>
                <p className="text-sm text-muted-foreground">Outstanding balances</p>
              </div>
            </div>
            {unpaidSessions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You have <span className="font-semibold text-foreground">{unpaidSessions.length}</span> unpaid session{unpaidSessions.length > 1 ? 's' : ''}
                </p>
                <Link href="/sessions">
                  <Button variant="secondary" size="sm" className="w-full" data-testid="link-view-unpaid">
                    View Sessions
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All sessions are paid up!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
