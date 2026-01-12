import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Session, type Client } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { z } from "zod";
import { Plus, Calendar, Clock, DollarSign, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sessionFormSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  date: z.string().min(1, "Please select a date"),
  notes: z.string().optional(),
  duration: z.number().default(60),
});

type SessionFormData = z.infer<typeof sessionFormSchema>;

export default function Sessions() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: clients } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const { data: sessions } = useQuery<Session[]>({ queryKey: ["/api/sessions"] });

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: { clientId: "", date: "", notes: "", duration: 60 },
  });

  const mutation = useMutation({
    mutationFn: async (values: SessionFormData) => {
      await apiRequest("POST", "/api/sessions", {
        clientId: Number(values.clientId),
        date: new Date(values.date).toISOString(),
        notes: values.notes || null,
        duration: values.duration,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({ title: "Session logged", description: "Successfully logged new session." });
      form.reset();
      setIsAddDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to log session.", variant: "destructive" });
    },
  });

  const paidMutation = useMutation({
    mutationFn: async ({ id, paid }: { id: number; paid: boolean }) => {
      await apiRequest("PATCH", `/api/sessions/${id}/paid`, { paid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });

  const sortedSessions = sessions?.slice().sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Sessions</h1>
          <p className="text-muted-foreground text-sm">{sessions?.length || 0} total sessions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/25" data-testid="button-add-session">
              <Plus className="w-4 h-4" />
              Log Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log New Session</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-client">
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()} data-testid={`option-client-${client.id}`}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" data-testid="input-date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          data-testid="input-duration" 
                          value={field.value} 
                          onChange={(e) => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Session notes..." data-testid="input-notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={mutation.isPending} data-testid="button-log-session">
                    Log Session
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedSessions?.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No sessions yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start logging your training sessions</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2" disabled={!clients?.length}>
              <Plus className="w-4 h-4" />
              Log Your First Session
            </Button>
            {!clients?.length && (
              <p className="text-xs text-muted-foreground mt-2">Add a client first to log sessions</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {sortedSessions?.map((session) => {
            const client = clients?.find(c => c.id === session.clientId);
            const sessionDate = new Date(session.date);
            return (
              <Card key={session.id} className="border-0 shadow-sm" data-testid={`card-session-${session.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{client?.name || "Unknown"}</h3>
                        <Badge variant={session.paid ? "secondary" : "outline"} className={session.paid ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}>
                          {session.paid ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(sessionDate, "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(sessionDate, "h:mm a")}
                        </span>
                        {client?.sessionCost && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {client.sessionCost}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={session.paid || false}
                        onCheckedChange={(checked) => paidMutation.mutate({ id: session.id, paid: !!checked })}
                        data-testid={`checkbox-paid-${session.id}`}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
