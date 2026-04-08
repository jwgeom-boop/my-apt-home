import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SatisfactionRatingProps {
  defectId: string;
}

interface SavedRating {
  score: number;
  comment: string;
}

const RATING_KEY_PREFIX = "defect_rating_";

const ratingMessages: Record<number, string> = {
  1: "아쉬웠던 점을 알려주세요",
  2: "아쉬웠던 점을 알려주세요",
  3: "보통이었군요",
  4: "감사합니다!",
  5: "감사합니다!",
};

const SatisfactionRating = ({ defectId }: SatisfactionRatingProps) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [savedRating, setSavedRating] = useState<SavedRating | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(RATING_KEY_PREFIX + defectId);
    if (saved) {
      const parsed = JSON.parse(saved) as SavedRating;
      setSavedRating(parsed);
      setSubmitted(true);
    }
  }, [defectId]);

  const handleSubmit = () => {
    if (score === 0) return;
    const rating: SavedRating = { score, comment };
    localStorage.setItem(RATING_KEY_PREFIX + defectId, JSON.stringify(rating));
    setSavedRating(rating);
    setSubmitted(true);
    toast.success("평가가 등록되었습니다. 감사합니다.");
  };

  // Read-only stars for submitted rating
  if (submitted && savedRating) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border mt-3 mx-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">만족도 평가</h3>
          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
            평가 완료
          </span>
        </div>
        <div className="flex gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={cn(
                "w-6 h-6",
                i <= savedRating.score
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
        {savedRating.comment && (
          <p className="text-xs text-muted-foreground mt-2">"{savedRating.comment}"</p>
        )}
      </div>
    );
  }

  // Editable rating form
  return (
    <div className="bg-card rounded-xl p-4 border border-border mt-3 mx-4">
      <h3 className="text-sm font-bold text-foreground mb-3">처리 결과에 만족하셨나요?</h3>

      {/* Stars */}
      <div className="flex gap-1.5 mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setScore(i)}
            className="p-0.5 active:scale-110 transition-transform"
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                i <= score
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>

      {/* Auto message */}
      {score > 0 && (
        <p className="text-xs text-muted-foreground mb-3 animate-fade-in">
          {ratingMessages[score]}
        </p>
      )}

      {/* Comment */}
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="처리 결과에 대한 의견을 남겨주세요 (선택)"
        className="text-xs min-h-[60px] resize-none mb-3"
      />

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={score === 0}
        className="w-full h-11 rounded-xl font-bold"
      >
        평가 제출
      </Button>
    </div>
  );
};

export default SatisfactionRating;
