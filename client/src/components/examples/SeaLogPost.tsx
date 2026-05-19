import SeaLogPost from "../features/SeaLogPost";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";

export default function SeaLogPostExample() {
  return (
    <div className="max-w-sm">
      <SeaLogPost
        id="post-1"
        username="diver_maya"
        initials="DM"
        location="Raja Ampat"
        image={rajaAmpatImage}
        caption="Terumbu karang masih sehat! Melihat 3 pari manta hari ini"
        likes={247}
        comments={18}
        timeAgo="2 jam lalu"
        onLike={(id) => console.log("Liked post:", id)}
        onComment={(id) => console.log("Comment on post:", id)}
      />
    </div>
  );
}
