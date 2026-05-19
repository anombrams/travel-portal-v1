import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SeaLogPostProps {
  id: string;
  username: string;
  initials: string;
  location: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked?: boolean;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
}

export default function SeaLogPost({
  id,
  username,
  initials,
  location,
  image,
  caption,
  likes,
  comments,
  timeAgo,
  isLiked = false,
  onLike,
  onComment,
}: SeaLogPostProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [shared, setShared] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.(id);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/komunitas?post=${id}`;
    const shareData = {
      title: `Sea-Log oleh ${username}`,
      text: caption,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        toast({
          title: "Link disalin!",
          description: "Link postingan telah disalin ke clipboard",
        });
        setTimeout(() => setShared(false), 2000);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        toast({
          title: "Link disalin!",
          description: "Link postingan telah disalin ke clipboard",
        });
        setTimeout(() => setShared(false), 2000);
      }
    }
  };

  return (
    <div
      className="bg-card rounded-xl overflow-hidden border border-card-border"
      data-testid={`sea-log-post-${id}`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold text-sm text-foreground">{username}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {location}
            </div>
          </div>
        </div>
        <Button size="icon" variant="ghost" data-testid={`button-more-${id}`}>
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      <div className="aspect-square relative">
        <img
          src={image}
          alt={caption}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3">
        <div className="flex items-center gap-4 mb-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLike}
            className={liked ? "text-destructive" : ""}
            data-testid={`button-like-${id}`}
          >
            <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onComment?.(id)}
            data-testid={`button-comment-${id}`}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleShare}
            className={shared ? "text-primary" : ""}
            data-testid={`button-share-${id}`}
          >
            {shared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          </Button>
        </div>

        <div className="text-sm font-semibold text-foreground mb-1">
          {likeCount.toLocaleString()} suka
        </div>

        <p className="text-sm text-foreground">
          <span className="font-semibold">{username}</span>{" "}
          <span className="text-muted-foreground">{caption}</span>
        </p>

        {comments > 0 && (
          <button
            className="text-sm text-muted-foreground mt-1"
            onClick={() => onComment?.(id)}
            data-testid={`link-comments-${id}`}
          >
            Lihat {comments} komentar
          </button>
        )}

        <div className="text-xs text-muted-foreground mt-2">{timeAgo}</div>
      </div>
    </div>
  );
}
