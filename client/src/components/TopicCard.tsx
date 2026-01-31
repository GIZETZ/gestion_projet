import { motion } from "framer-motion";
import { type Topic, type User } from "@shared/schema";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";

interface TopicCardProps {
  topic: Topic & { assignedUser?: User | null };
  onSelect: (id: number) => void;
  isPending: boolean;
  currentUser?: User | null;
}

export function TopicCard({ topic, onSelect, isPending, currentUser }: TopicCardProps) {
  // A card is revealed if it has an assigned user or if the isRevealed flag is true
  const isRevealed = !!topic.assignedToUserId;
  const isMyChoice = currentUser?.id === topic.assignedToUserId;

  return (
    <div className="relative h-64 w-full perspective-1000 group cursor-pointer" onClick={() => !isRevealed && !isPending && onSelect(topic.id)}>
      <motion.div
        className="relative h-full w-full preserve-3d transition-all duration-500"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRONT (Face Down - Letter) */}
        <div className={cn(
          "absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl border-4",
          "bg-white border-primary/20 hover:border-primary transition-colors",
          "hover:shadow-2xl hover:scale-[1.02] duration-300"
        )}>
          <div className="text-8xl font-black text-primary font-display drop-shadow-sm select-none">
            ?
          </div>
          <p className="mt-4 text-muted-foreground font-hand text-lg">Si tu cliques c'est ton thème!</p>
        </div>

        {/* BACK (Face Up - Topic & Group) */}
        <div className={cn(
          "absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl rotate-y-180 border-4",
          isMyChoice ? "bg-green-50 border-green-500" : "bg-white border-secondary"
        )}>
          {isMyChoice && (
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          )}
          
          <div className="text-center w-full">
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3",
              isMyChoice ? "bg-green-200 text-green-800" : "bg-orange-100 text-orange-800"
            )}>
              {isMyChoice ? "Votre Sujet" : "Déjà Pris"}
            </span>
            
            <h3 className="text-2xl font-bold text-foreground mb-4 font-display leading-tight">
              {topic.title}
            </h3>
            
            <div className="w-full h-px bg-border my-4" />
            
            <div className="bg-slate-100 rounded-lg p-3 w-full">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Groupe</p>
              <p className="font-hand text-xl text-primary font-bold truncate">
                {topic.assignedUser?.groupName || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
